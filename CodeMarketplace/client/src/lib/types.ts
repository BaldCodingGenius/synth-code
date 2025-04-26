export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  reputation?: number;
  isSubscribed?: boolean;
  subscriptionTier?: string;
  subscriptionExpiry?: string;
  firebaseId?: string;
  createdAt: string;
}

export interface Snippet {
  id: number;
  title: string;
  description?: string;
  code: string;
  language: string;
  price: string;
  userId: number;
  createdAt: string;
  downloadable: boolean;
  publishedAt?: string;
  rating?: string | number;
  tags?: string[];
  bundleId?: number;
  totalDownloads?: number;
  totalSales?: number;
  // Extra fields from joins
  username?: string;
  authorReputation?: number;
  reviewCount?: number;
}

export interface Purchase {
  id: number;
  snippetId: number;
  buyerId: number;
  price: string;
  createdAt: string;
  // Extra fields from joins
  snippetTitle?: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  snippetId?: number;
  postId?: number;
  createdAt: string;
  // Extra fields from joins
  username?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  upvotes: number;
  createdAt: string;
  type: string;
  // Extra fields from joins
  username?: string;
  commentCount?: number;
  code?: string;
}

export interface Bundle {
  id: number;
  name: string;
  description?: string;
  price: string;
  userId: number;
  createdAt: string;
  coverImage?: string;
  featured: boolean;
  category?: string;
  // Extra fields from joins
  username?: string;
  snippetCount?: number;
}

export interface Review {
  id: number;
  snippetId: number;
  userId: number;
  rating: number;
  content?: string;
  createdAt: string;
  // Extra fields from joins
  username?: string;
  userAvatar?: string;
}

export interface Favorite {
  id: number;
  snippetId: number;
  userId: number;
  createdAt: string;
  // Extra fields from joins
  snippetTitle?: string;
}

export interface Share {
  id: number;
  snippetId: number;
  userId: number;
  platform: string;
  createdAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  tier: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentId?: string;
  amount: string;
}

export interface AuthorFollower {
  id: number;
  authorId: number;
  followerId: number;
  createdAt: string;
  // Extra fields from joins
  authorUsername?: string;
  authorAvatar?: string;
  followerUsername?: string;
}

export interface Recommendation {
  id: number;
  userId: number;
  snippetId: number;
  score: number;
  reason?: string;
  createdAt: string;
  // Extra fields from joins
  snippetTitle?: string;
  snippetLanguage?: string;
}
