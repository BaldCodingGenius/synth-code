import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  reputation: integer("reputation").default(0),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionTier: text("subscription_tier").default("free"),
  subscriptionExpiry: timestamp("subscription_expiry"),
  firebaseId: text("firebase_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bundles = pgTable("bundles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 6, scale: 2 }).default("9.99").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  coverImage: text("cover_image"),
  featured: boolean("featured").default(false),
  category: text("category"),
});

export const snippets = pgTable("snippets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  code: text("code").notNull(),
  language: text("language").notNull(),
  price: decimal("price", { precision: 6, scale: 2 }).default("2.99").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  downloadable: boolean("downloadable").default(false),
  publishedAt: timestamp("published_at"),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("4.0"),
  tags: text("tags").array(),
  bundleId: integer("bundle_id").references(() => bundles.id),
  totalDownloads: integer("total_downloads").default(0),
  totalSales: integer("total_sales").default(0),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  snippetId: integer("snippet_id").references(() => snippets.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  price: decimal("price", { precision: 6, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  snippetId: integer("snippet_id").references(() => snippets.id),
  postId: integer("post_id").references(() => posts.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  type: text("type").default("discussion").notNull(), // discussion, showcase, question, job
});

// New tables for enhanced features
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  snippetId: integer("snippet_id").references(() => snippets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  snippetId: integer("snippet_id").references(() => snippets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  snippetId: integer("snippet_id").references(() => snippets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(), // twitter, facebook, linkedin, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tier: text("tier").notNull(), // basic, pro, premium
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active").notNull(), // active, cancelled, expired
  paymentId: text("payment_id"),
  amount: decimal("amount", { precision: 6, scale: 2 }).notNull(),
});

export const authorFollowers = pgTable("author_followers", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  followerId: integer("follower_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  snippetId: integer("snippet_id").references(() => snippets.id).notNull(),
  score: decimal("score", { precision: 4, scale: 3 }).notNull(), // AI recommendation score
  reason: text("reason"), // Why it was recommended
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playgroundSessions = pgTable("playground_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  snippetId: integer("snippet_id").references(() => snippets.id),
  code: text("code").notNull(),
  language: text("language").notNull(),
  input: text("input"),
  output: text("output"),
  isPublic: boolean("is_public").default(false),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatar: true,
  bio: true,
});

export const insertSnippetSchema = createInsertSchema(snippets).pick({
  title: true,
  description: true,
  code: true,
  language: true,
  price: true,
  userId: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).pick({
  snippetId: true,
  buyerId: true,
  price: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  content: true,
  userId: true,
  snippetId: true,
  postId: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  title: true,
  content: true,
  userId: true,
  type: true,
});

// Add new schemas for new tables
export const insertBundleSchema = createInsertSchema(bundles).pick({
  name: true,
  description: true,
  price: true,
  userId: true,
  coverImage: true,
  category: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  snippetId: true,
  userId: true,
  rating: true,
  content: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  snippetId: true,
  userId: true,
});

export const insertShareSchema = createInsertSchema(shares).pick({
  snippetId: true,
  userId: true,
  platform: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  tier: true,
  endDate: true,
  status: true,
  paymentId: true,
  amount: true,
});

export const insertAuthorFollowerSchema = createInsertSchema(authorFollowers).pick({
  authorId: true,
  followerId: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).pick({
  userId: true,
  snippetId: true,
  score: true,
  reason: true,
});

export const insertPlaygroundSessionSchema = createInsertSchema(playgroundSessions).pick({
  userId: true,
  snippetId: true,
  code: true,
  language: true,
  input: true,
  output: true,
  isPublic: true,
  sessionId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Bundle = typeof bundles.$inferSelect;
export type InsertBundle = z.infer<typeof insertBundleSchema>;

export type Snippet = typeof snippets.$inferSelect;
export type InsertSnippet = z.infer<typeof insertSnippetSchema>;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Share = typeof shares.$inferSelect;
export type InsertShare = z.infer<typeof insertShareSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type AuthorFollower = typeof authorFollowers.$inferSelect;
export type InsertAuthorFollower = z.infer<typeof insertAuthorFollowerSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type PlaygroundSession = typeof playgroundSessions.$inferSelect;
export type InsertPlaygroundSession = z.infer<typeof insertPlaygroundSessionSchema>;
