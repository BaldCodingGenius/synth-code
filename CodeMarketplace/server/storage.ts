import { 
  users, 
  snippets, 
  purchases, 
  comments, 
  posts,
  bundles,
  reviews,
  favorites,
  shares,
  subscriptions,
  authorFollowers,
  recommendations,
  type User, 
  type InsertUser, 
  type Snippet, 
  type InsertSnippet, 
  type Purchase, 
  type InsertPurchase, 
  type Comment, 
  type InsertComment, 
  type Post, 
  type InsertPost,
  type Bundle,
  type InsertBundle,
  type Review,
  type InsertReview,
  type Favorite,
  type InsertFavorite,
  type Share,
  type InsertShare,
  type Subscription,
  type InsertSubscription,
  type AuthorFollower,
  type InsertAuthorFollower,
  type Recommendation,
  type InsertRecommendation
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Snippet methods
  getAllSnippets(): Promise<Snippet[]>;
  getSnippet(id: number): Promise<Snippet | undefined>;
  createSnippet(snippet: InsertSnippet): Promise<Snippet>;
  updateSnippet(id: number, updates: Partial<Snippet>): Promise<Snippet | undefined>;
  getUserSnippets(userId: number): Promise<Snippet[]>;
  getRecommendedSnippets(userId: number): Promise<Snippet[]>;
  
  // Purchase methods
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: number): Promise<Purchase[]>;
  getUserSales(userId: number): Promise<any[]>; // Include snippet title
  
  // Comment methods
  createComment(comment: InsertComment): Promise<Comment>;
  getSnippetComments(snippetId: number): Promise<Comment[]>;
  getPostComments(postId: number): Promise<Comment[]>;
  
  // Post methods
  getAllPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined>;
  upvotePost(id: number): Promise<Post | undefined>;
  
  // Bundle methods
  getAllBundles(): Promise<Bundle[]>;
  getBundle(id: number): Promise<Bundle | undefined>;
  createBundle(bundle: InsertBundle): Promise<Bundle>;
  updateBundle(id: number, updates: Partial<Bundle>): Promise<Bundle | undefined>;
  getBundleSnippets(bundleId: number): Promise<Snippet[]>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getSnippetReviews(snippetId: number): Promise<Review[]>;
  getUserReviews(userId: number): Promise<Review[]>;
  
  // Favorite methods
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, snippetId: number): Promise<boolean>;
  getUserFavorites(userId: number): Promise<Favorite[]>;
  
  // Share methods
  createShare(share: InsertShare): Promise<Share>;
  getSnippetShares(snippetId: number): Promise<Share[]>;
  
  // Subscription methods
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getUserSubscription(userId: number): Promise<Subscription | undefined>;
  updateSubscription(id: number, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  
  // Author Follower methods
  followAuthor(follow: InsertAuthorFollower): Promise<AuthorFollower>;
  unfollowAuthor(followerId: number, authorId: number): Promise<boolean>;
  getAuthorFollowers(authorId: number): Promise<AuthorFollower[]>;
  getUserFollowing(followerId: number): Promise<AuthorFollower[]>;
  
  // Recommendation methods
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getUserRecommendations(userId: number): Promise<Recommendation[]>;
  
  // Playground methods
  createPlaygroundSession(session: InsertPlaygroundSession): Promise<PlaygroundSession>;
  getPlaygroundSession(id: number): Promise<PlaygroundSession | undefined>;
  getPlaygroundSessionBySessionId(sessionId: string): Promise<PlaygroundSession | undefined>;
  updatePlaygroundSession(id: number, updates: Partial<PlaygroundSession>): Promise<PlaygroundSession | undefined>;
  getUserPlaygroundSessions(userId: number): Promise<PlaygroundSession[]>;
  getSnippetPlaygroundSessions(snippetId: number): Promise<PlaygroundSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private snippets: Map<number, Snippet>;
  private purchases: Map<number, Purchase>;
  private comments: Map<number, Comment>;
  private posts: Map<number, Post>;
  private bundles: Map<number, Bundle>;
  private reviews: Map<number, Review>;
  private favorites: Map<number, Favorite>;
  private shares: Map<number, Share>;
  private subscriptions: Map<number, Subscription>;
  private authorFollowers: Map<number, AuthorFollower>;
  private recommendations: Map<number, Recommendation>;
  private playgroundSessions: Map<number, PlaygroundSession>;
  
  private userIdCounter: number;
  private snippetIdCounter: number;
  private purchaseIdCounter: number;
  private commentIdCounter: number;
  private postIdCounter: number;
  private bundleIdCounter: number;
  private reviewIdCounter: number;
  private favoriteIdCounter: number;
  private shareIdCounter: number;
  private subscriptionIdCounter: number;
  private authorFollowerIdCounter: number;
  private recommendationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.snippets = new Map();
    this.purchases = new Map();
    this.comments = new Map();
    this.posts = new Map();
    this.bundles = new Map();
    this.reviews = new Map();
    this.favorites = new Map();
    this.shares = new Map();
    this.subscriptions = new Map();
    this.authorFollowers = new Map();
    this.recommendations = new Map();
    
    this.userIdCounter = 1;
    this.snippetIdCounter = 1;
    this.purchaseIdCounter = 1;
    this.commentIdCounter = 1;
    this.postIdCounter = 1;
    this.bundleIdCounter = 1;
    this.reviewIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.shareIdCounter = 1;
    this.subscriptionIdCounter = 1;
    this.authorFollowerIdCounter = 1;
    this.recommendationIdCounter = 1;
    
    // Add some initial demo data
    this.initializeDemoData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date().toISOString();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Snippet methods
  async getAllSnippets(): Promise<Snippet[]> {
    return Array.from(this.snippets.values())
      .filter(snippet => snippet.publishedAt !== null) // Only return published snippets
      .map(snippet => {
        // Enrich with username
        const user = this.users.get(snippet.userId);
        const enrichedSnippet = { ...snippet } as any;
        enrichedSnippet.username = user?.username;
        return enrichedSnippet;
      });
  }
  
  async getSnippet(id: number): Promise<Snippet | undefined> {
    const snippet = this.snippets.get(id);
    if (!snippet) return undefined;
    
    // Enrich with username
    const user = this.users.get(snippet.userId);
    const enrichedSnippet = { ...snippet } as any;
    enrichedSnippet.username = user?.username;
    return enrichedSnippet;
  }
  
  async createSnippet(insertSnippet: InsertSnippet): Promise<Snippet> {
    const id = this.snippetIdCounter++;
    const createdAt = new Date().toISOString();
    const snippet: Snippet = { 
      ...insertSnippet, 
      id, 
      createdAt,
      downloadable: false 
    };
    this.snippets.set(id, snippet);
    return snippet;
  }
  
  async updateSnippet(id: number, updates: Partial<Snippet>): Promise<Snippet | undefined> {
    const snippet = this.snippets.get(id);
    if (!snippet) return undefined;
    
    const updatedSnippet = { ...snippet, ...updates };
    this.snippets.set(id, updatedSnippet);
    return updatedSnippet;
  }
  
  async getUserSnippets(userId: number): Promise<Snippet[]> {
    return Array.from(this.snippets.values())
      .filter(snippet => snippet.userId === userId);
  }
  
  async getRecommendedSnippets(userId: number): Promise<Snippet[]> {
    // In a real implementation, this would use recommendations from the AI system
    // but for now we'll just return the most popular snippets based on downloads
    // that the user hasn't purchased yet
    
    // Get user's purchases
    const userPurchases = await this.getUserPurchases(userId);
    const purchasedSnippetIds = new Set(userPurchases.map(p => p.snippetId));
    
    // Get all published snippets not created by the user and not already purchased
    return Array.from(this.snippets.values())
      .filter(snippet => 
        snippet.publishedAt && 
        snippet.userId !== userId && 
        !purchasedSnippetIds.has(snippet.id)
      )
      .sort((a, b) => {
        // Sort by downloads, or total sales, or rating
        const aPopularity = (a.totalDownloads || 0) + (a.totalSales || 0);
        const bPopularity = (b.totalDownloads || 0) + (b.totalSales || 0);
        return bPopularity - aPopularity;
      })
      .slice(0, 10) // Return top 10
      .map(snippet => {
        // Enrich with username
        const user = this.users.get(snippet.userId);
        const enrichedSnippet = { ...snippet } as any;
        enrichedSnippet.username = user?.username;
        return enrichedSnippet;
      });
  }
  
  // Purchase methods
  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = this.purchaseIdCounter++;
    const createdAt = new Date().toISOString();
    const purchase: Purchase = { ...insertPurchase, id, createdAt };
    this.purchases.set(id, purchase);
    return purchase;
  }
  
  async getUserPurchases(userId: number): Promise<Purchase[]> {
    return Array.from(this.purchases.values())
      .filter(purchase => purchase.buyerId === userId)
      .map(purchase => {
        // Enrich with snippet title
        const snippet = this.snippets.get(purchase.snippetId);
        return {
          ...purchase,
          snippetTitle: snippet?.title
        };
      });
  }
  
  async getUserSales(userId: number): Promise<any[]> {
    // Get all snippets by this user
    const userSnippets = await this.getUserSnippets(userId);
    
    // Find all purchases for those snippets
    const sales = [];
    for (const snippet of userSnippets) {
      const snippetPurchases = Array.from(this.purchases.values())
        .filter(purchase => purchase.snippetId === snippet.id)
        .map(purchase => ({
          ...purchase,
          snippetTitle: snippet.title
        }));
      
      sales.push(...snippetPurchases);
    }
    
    return sales;
  }
  
  // Comment methods
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const createdAt = new Date().toISOString();
    const comment: Comment = { ...insertComment, id, createdAt };
    this.comments.set(id, comment);
    return comment;
  }
  
  async getSnippetComments(snippetId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.snippetId === snippetId)
      .map(comment => {
        // Enrich with username
        const user = this.users.get(comment.userId);
        const enrichedComment = { ...comment } as any;
        enrichedComment.username = user?.username;
        return enrichedComment;
      });
  }
  
  async getPostComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .map(comment => {
        // Enrich with username
        const user = this.users.get(comment.userId);
        const enrichedComment = { ...comment } as any;
        enrichedComment.username = user?.username;
        return enrichedComment;
      });
  }
  
  // Post methods
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .map(post => {
        // Enrich with username and comment count
        const user = this.users.get(post.userId);
        const commentCount = Array.from(this.comments.values())
          .filter(comment => comment.postId === post.id)
          .length;
        
        const enrichedPost = { ...post } as any;
        enrichedPost.username = user?.username;
        enrichedPost.commentCount = commentCount;
        return enrichedPost;
      });
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    // Enrich with username and comment count
    const user = this.users.get(post.userId);
    const commentCount = Array.from(this.comments.values())
      .filter(comment => comment.postId === post.id)
      .length;
    
    const enrichedPost = { ...post } as any;
    enrichedPost.username = user?.username;
    enrichedPost.commentCount = commentCount;
    return enrichedPost;
  }
  
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const createdAt = new Date().toISOString();
    const post: Post = { 
      ...insertPost, 
      id, 
      createdAt,
      upvotes: 0 
    };
    this.posts.set(id, post);
    return post;
  }
  
  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  async upvotePost(id: number): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const currentUpvotes = post.upvotes || 0;
    const updatedPost = { ...post, upvotes: currentUpvotes + 1 };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  // Bundle methods
  async getAllBundles(): Promise<Bundle[]> {
    return Array.from(this.bundles.values())
      .map(bundle => {
        // Enrich with username
        const user = this.users.get(bundle.userId);
        const snippetCount = Array.from(this.snippets.values())
          .filter(snippet => snippet.bundleId === bundle.id)
          .length;
        
        const enrichedBundle = { ...bundle } as any;
        enrichedBundle.username = user?.username;
        enrichedBundle.snippetCount = snippetCount;
        return enrichedBundle;
      });
  }
  
  async getBundle(id: number): Promise<Bundle | undefined> {
    const bundle = this.bundles.get(id);
    if (!bundle) return undefined;
    
    // Enrich with username and snippet count
    const user = this.users.get(bundle.userId);
    const snippetCount = Array.from(this.snippets.values())
      .filter(snippet => snippet.bundleId === bundle.id)
      .length;
    
    const enrichedBundle = { ...bundle } as any;
    enrichedBundle.username = user?.username;
    enrichedBundle.snippetCount = snippetCount;
    return enrichedBundle;
  }
  
  async createBundle(insertBundle: InsertBundle): Promise<Bundle> {
    const id = this.bundleIdCounter++;
    const createdAt = new Date().toISOString();
    const bundle: Bundle = { ...insertBundle, id, createdAt, featured: false };
    this.bundles.set(id, bundle);
    return bundle;
  }
  
  async updateBundle(id: number, updates: Partial<Bundle>): Promise<Bundle | undefined> {
    const bundle = this.bundles.get(id);
    if (!bundle) return undefined;
    
    const updatedBundle = { ...bundle, ...updates };
    this.bundles.set(id, updatedBundle);
    return updatedBundle;
  }
  
  async getBundleSnippets(bundleId: number): Promise<Snippet[]> {
    return Array.from(this.snippets.values())
      .filter(snippet => snippet.bundleId === bundleId)
      .map(snippet => {
        // Enrich with username
        const user = this.users.get(snippet.userId);
        const enrichedSnippet = { ...snippet } as any;
        enrichedSnippet.username = user?.username;
        return enrichedSnippet;
      });
  }
  
  // Review methods
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const createdAt = new Date().toISOString();
    const review: Review = { ...insertReview, id, createdAt };
    this.reviews.set(id, review);
    return review;
  }
  
  async getSnippetReviews(snippetId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.snippetId === snippetId)
      .map(review => {
        // Enrich with username and avatar
        const user = this.users.get(review.userId);
        const enrichedReview = { ...review } as any;
        enrichedReview.username = user?.username;
        enrichedReview.userAvatar = user?.avatar;
        return enrichedReview;
      });
  }
  
  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId);
  }
  
  // Favorite methods
  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteIdCounter++;
    const createdAt = new Date().toISOString();
    const favorite: Favorite = { ...insertFavorite, id, createdAt };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, snippetId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.snippetId === snippetId);
    
    if (!favorite) return false;
    
    this.favorites.delete(favorite.id);
    return true;
  }
  
  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(favorite => favorite.userId === userId)
      .map(favorite => {
        // Enrich with snippet title
        const snippet = this.snippets.get(favorite.snippetId);
        return {
          ...favorite,
          snippetTitle: snippet?.title
        };
      });
  }
  
  // Share methods
  async createShare(insertShare: InsertShare): Promise<Share> {
    const id = this.shareIdCounter++;
    const createdAt = new Date().toISOString();
    const share: Share = { ...insertShare, id, createdAt };
    this.shares.set(id, share);
    return share;
  }
  
  async getSnippetShares(snippetId: number): Promise<Share[]> {
    return Array.from(this.shares.values())
      .filter(share => share.snippetId === snippetId);
  }
  
  // Subscription methods
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionIdCounter++;
    const createdAt = new Date().toISOString();
    const subscription: Subscription = { ...insertSubscription, id, createdAt };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  
  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId && sub.status === 'active');
  }
  
  async updateSubscription(id: number, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...updates };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  // Author Follower methods
  async followAuthor(insertAuthorFollower: InsertAuthorFollower): Promise<AuthorFollower> {
    const id = this.authorFollowerIdCounter++;
    const createdAt = new Date().toISOString();
    const authorFollower: AuthorFollower = { ...insertAuthorFollower, id, createdAt };
    this.authorFollowers.set(id, authorFollower);
    return authorFollower;
  }
  
  async unfollowAuthor(followerId: number, authorId: number): Promise<boolean> {
    const follow = Array.from(this.authorFollowers.values())
      .find(f => f.followerId === followerId && f.authorId === authorId);
    
    if (!follow) return false;
    
    this.authorFollowers.delete(follow.id);
    return true;
  }
  
  async getAuthorFollowers(authorId: number): Promise<AuthorFollower[]> {
    return Array.from(this.authorFollowers.values())
      .filter(follow => follow.authorId === authorId)
      .map(follow => {
        // Enrich with follower username and avatar
        const follower = this.users.get(follow.followerId);
        return {
          ...follow,
          followerUsername: follower?.username,
          followerAvatar: follower?.avatar
        };
      });
  }
  
  async getUserFollowing(followerId: number): Promise<AuthorFollower[]> {
    return Array.from(this.authorFollowers.values())
      .filter(follow => follow.followerId === followerId)
      .map(follow => {
        // Enrich with author username and avatar
        const author = this.users.get(follow.authorId);
        return {
          ...follow,
          authorUsername: author?.username,
          authorAvatar: author?.avatar
        };
      });
  }
  
  // Recommendation methods
  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationIdCounter++;
    const createdAt = new Date().toISOString();
    const recommendation: Recommendation = { ...insertRecommendation, id, createdAt };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }
  
  async getUserRecommendations(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(rec => rec.userId === userId)
      .map(rec => {
        // Enrich with snippet title and language
        const snippet = this.snippets.get(rec.snippetId);
        return {
          ...rec,
          snippetTitle: snippet?.title,
          snippetLanguage: snippet?.language
        };
      });
  }
  
  // Initialize demo data
  private initializeDemoData() {
    // Create demo users
    const demoUser1: User = {
      id: this.userIdCounter++,
      username: 'johndoe',
      password: 'password123',
      email: 'john@example.com',
      bio: 'Full-stack developer with 5 years of experience',
      createdAt: new Date().toISOString()
    };
    
    const demoUser2: User = {
      id: this.userIdCounter++,
      username: 'janedoe',
      password: 'password123',
      email: 'jane@example.com',
      bio: 'Frontend specialist focused on React and modern UI',
      createdAt: new Date().toISOString()
    };
    
    this.users.set(demoUser1.id, demoUser1);
    this.users.set(demoUser2.id, demoUser2);
    
    // Create demo snippets
    const demoSnippet1: Snippet = {
      id: this.snippetIdCounter++,
      title: 'React Infinite Scroll Hook',
      description: 'A custom hook for implementing infinite scroll in React applications',
      code: `import { useState, useEffect } from 'react';

function useInfiniteScroll(callback) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
        isFetching
      )
        return;
      setIsFetching(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching, callback]);

  return [isFetching, setIsFetching];
}

export default useInfiniteScroll;`,
      language: 'javascript',
      price: '3.99',
      userId: demoUser1.id,
      createdAt: new Date().toISOString(),
      downloadable: true,
      publishedAt: new Date().toISOString()
    };
    
    const demoSnippet2: Snippet = {
      id: this.snippetIdCounter++,
      title: 'Python Data Parser',
      description: 'Efficiently parse and transform CSV data using Python',
      code: `import pandas as pd
import numpy as np

def process_data(filename):
    # Read the CSV file
    df = pd.read_csv(filename)
    
    # Clean data
    df = df.dropna()
    
    # Transform data
    df['total'] = df['price'] * df['quantity']
    df['date'] = pd.to_datetime(df['date'])
    
    # Group by date
    result = df.groupby(df['date'].dt.date).agg({
        'total': 'sum',
        'quantity': 'sum'
    }).reset_index()
    
    return result

if __name__ == "__main__":
    result = process_data('sales.csv')
    print(result.head())`,
      language: 'python',
      price: '4.99',
      userId: demoUser2.id,
      createdAt: new Date().toISOString(),
      downloadable: true,
      publishedAt: new Date().toISOString()
    };
    
    const demoSnippet3: Snippet = {
      id: this.snippetIdCounter++,
      title: 'CSS Animated Button',
      description: 'Beautiful button with hover effects and animations',
      code: `.animated-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #9A6AFF, #00FFFF);
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.animated-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.animated-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.5s ease;
}

.animated-button:hover::before {
  left: 100%;
}`,
      language: 'css',
      price: '2.49',
      userId: demoUser1.id,
      createdAt: new Date().toISOString(),
      downloadable: true,
      publishedAt: new Date().toISOString()
    };
    
    this.snippets.set(demoSnippet1.id, demoSnippet1);
    this.snippets.set(demoSnippet2.id, demoSnippet2);
    this.snippets.set(demoSnippet3.id, demoSnippet3);
    
    // Create demo posts
    const demoPost1: Post = {
      id: this.postIdCounter++,
      title: 'Thoughts on React 18 features',
      content: 'I\'ve been using the new concurrent rendering features in React 18 and it\'s a game changer for complex UIs. The automatic batching of state updates has significantly improved performance in my app. What are your experiences with React 18?',
      userId: demoUser1.id,
      upvotes: 5,
      createdAt: new Date().toISOString(),
      type: 'discussions'
    };
    
    const demoPost2: Post = {
      id: this.postIdCounter++,
      title: 'Check out my new portfolio site!',
      content: 'I just launched my new portfolio site built with Astro and Tailwind CSS. It features a dark mode toggle, animated page transitions, and a live code editor for demonstrations. Would love to get your feedback!',
      userId: demoUser2.id,
      upvotes: 8,
      createdAt: new Date().toISOString(),
      type: 'showcases'
    };
    
    this.posts.set(demoPost1.id, demoPost1);
    this.posts.set(demoPost2.id, demoPost2);
    
    // Create demo comments
    const demoComment1: Comment = {
      id: this.commentIdCounter++,
      content: 'Great snippet! Saved me hours of work.',
      userId: demoUser2.id,
      snippetId: demoSnippet1.id,
      createdAt: new Date().toISOString()
    };
    
    const demoComment2: Comment = {
      id: this.commentIdCounter++,
      content: 'I agree, the automatic batching is incredibly useful.',
      userId: demoUser2.id,
      postId: demoPost1.id,
      createdAt: new Date().toISOString()
    };
    
    this.comments.set(demoComment1.id, demoComment1);
    this.comments.set(demoComment2.id, demoComment2);
    
    // Create demo purchases
    const demoPurchase: Purchase = {
      id: this.purchaseIdCounter++,
      snippetId: demoSnippet1.id,
      buyerId: demoUser2.id,
      price: demoSnippet1.price,
      createdAt: new Date().toISOString()
    };
    
    this.purchases.set(demoPurchase.id, demoPurchase);
  }
}

export const storage = new MemStorage();
