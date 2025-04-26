import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertSnippetSchema, insertPostSchema, insertCommentSchema, insertPurchaseSchema, insertUserSchema } from "@shared/schema";
import { analyzeCode } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware for Zod validation errors
  const handleZodError = (err: any, res: any) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  };

  // User routes
  app.post('/api/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      const newUser = await storage.createUser(userData);
      // Don't return the password
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });

  // Snippet routes
  app.get('/api/snippets', async (req, res) => {
    try {
      const snippets = await storage.getAllSnippets();
      res.json(snippets);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });

  app.get('/api/snippets/:id', async (req, res) => {
    try {
      const snippet = await storage.getSnippet(parseInt(req.params.id));
      if (!snippet) {
        return res.status(404).json({ message: 'Snippet not found' });
      }
      res.json(snippet);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });

  app.post('/api/snippets', async (req, res) => {
    try {
      const snippetData = insertSnippetSchema.parse(req.body);
      const newSnippet = await storage.createSnippet(snippetData);
      
      // Set a timer to make snippet downloadable after 3 days
      setTimeout(async () => {
        await storage.updateSnippet(newSnippet.id, { downloadable: true });
      }, 3 * 24 * 60 * 60 * 1000); // 3 days
      
      res.status(201).json(newSnippet);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Purchase routes
  app.post('/api/purchases', async (req, res) => {
    try {
      const purchaseData = insertPurchaseSchema.parse(req.body);
      const newPurchase = await storage.createPurchase(purchaseData);
      res.status(201).json(newPurchase);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.get('/api/users/:userId/purchases', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const purchases = await storage.getUserPurchases(userId);
      res.json(purchases);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });

  // User snippets
  app.get('/api/users/:userId/snippets', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const snippets = await storage.getUserSnippets(userId);
      res.json(snippets);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });

  // Community posts
  app.get('/api/posts', async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });

  app.post('/api/posts', async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const newPost = await storage.createPost(postData);
      res.status(201).json(newPost);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Comments
  app.post('/api/comments', async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const newComment = await storage.createComment(commentData);
      res.status(201).json(newComment);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Get post comments
  app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });
  
  // Get snippet comments
  app.get('/api/snippets/:snippetId/comments', async (req, res) => {
    try {
      const snippetId = parseInt(req.params.snippetId);
      const comments = await storage.getSnippetComments(snippetId);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });
  
  // Upvote post
  app.patch('/api/posts/:id/upvote', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const updatedPost = await storage.upvotePost(postId);
      
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });

  // Sales stats
  app.get('/api/users/:userId/sales', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sales = await storage.getUserSales(userId);
      res.json(sales);
    } catch (err) {
      res.status(500).json({ message: err instanceof Error ? err.message : 'Internal Server Error' });
    }
  });

  // Code analysis using OpenAI API
  app.post('/api/analyze-code', async (req, res) => {
    try {
      const { code, filename } = req.body;
      
      if (!code || !filename) {
        return res.status(400).json({ message: 'Code and filename are required' });
      }
      
      // Limit the size of code to prevent abuse
      if (code.length > 50000) {
        return res.status(400).json({ message: 'Code is too large. Maximum size is 50KB' });
      }
      
      const analysis = await analyzeCode(code, filename);
      res.json(analysis);
    } catch (err) {
      console.error('Error analyzing code:', err);
      res.status(500).json({ 
        message: err instanceof Error ? err.message : 'Internal Server Error',
        analysis: 'Failed to analyze code. Please try again later.'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
