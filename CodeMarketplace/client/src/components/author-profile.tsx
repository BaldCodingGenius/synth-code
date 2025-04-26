import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { User, Snippet, AuthorFollower } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Award, 
  TrendingUp, 
  Users, 
  BookOpen,
  Code,
  ThumbsUp,
  Heart,
  Package
} from "lucide-react";

interface AuthorProfileProps {
  userId: number;
  minimal?: boolean;
}

export const AuthorProfile = ({ userId, minimal = false }: AuthorProfileProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("snippets");
  
  // Get author data
  const { data: author, isLoading: authorLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId
  });
  
  // Get author's snippets
  const { data: snippets, isLoading: snippetsLoading } = useQuery<Snippet[]>({
    queryKey: [`/api/users/${userId}/snippets`],
    enabled: !!userId && activeTab === "snippets"
  });
  
  // Get followers
  const { data: followers, isLoading: followersLoading } = useQuery<AuthorFollower[]>({
    queryKey: [`/api/users/${userId}/followers`],
    enabled: !!userId && !minimal && activeTab === "followers"
  });
  
  // Check if current user is following this author
  const isFollowing = () => {
    if (!currentUser || !followers) return false;
    return followers.some(f => f.followerId === parseInt(currentUser.uid));
  };
  
  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("You must be logged in to follow authors");
      
      if (isFollowing()) {
        // Unfollow
        return apiRequest("DELETE", `/api/followers`, {
          followerId: parseInt(currentUser.uid),
          authorId: userId
        });
      } else {
        // Follow
        return apiRequest("POST", `/api/followers`, {
          followerId: parseInt(currentUser.uid),
          authorId: userId
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/followers`] });
      toast({
        title: isFollowing() ? "Unfollowed" : "Following",
        description: isFollowing() 
          ? `You are no longer following ${author?.username}` 
          : `You are now following ${author?.username}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleFollowToggle = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to follow authors",
        variant: "destructive"
      });
      return;
    }
    followMutation.mutate();
  };
  
  // Get reputation level
  const getReputationLevel = (rep: number = 0) => {
    if (rep >= 1000) return { level: "Expert", color: "#FFD700" }; // Gold
    if (rep >= 500) return { level: "Advanced", color: "#C0C0C0" }; // Silver
    if (rep >= 100) return { level: "Intermediate", color: "#CD7F32" }; // Bronze
    return { level: "Beginner", color: "#9A6AFF" };
  };
  
  // Loading state
  if (authorLoading || !author) {
    return minimal ? (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-gray-700"></div>
        <div className="h-4 w-24 bg-gray-700 rounded"></div>
      </div>
    ) : (
      <Card className="bg-[#1E1E1E] border-[#2D3748]">
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-gray-700 mb-4 animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }
  
  const reputation = author.reputation || 0;
  const { level, color } = getReputationLevel(reputation);
  
  // Minimal version (for cards, comments, etc.)
  if (minimal) {
    return (
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={author.avatar} alt={author.username} />
          <AvatarFallback className="bg-[#1E1E1E]">
            {author.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{author.username}</span>
          <div className="flex items-center">
            <Star className="h-3 w-3 mr-1" style={{ color }} />
            <span className="text-xs text-gray-400">{level}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Full profile
  return (
    <Card className="bg-[#1E1E1E] border-[#2D3748] overflow-hidden">
      {/* Header/Banner */}
      <div className="h-32 bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] relative">
        <div className="absolute -bottom-16 left-8">
          <Avatar className="h-32 w-32 border-4 border-[#1E1E1E]">
            <AvatarImage src={author.avatar} alt={author.username} />
            <AvatarFallback className="text-2xl bg-[#2D3748]">
              {author.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Profile Info */}
      <CardContent className="pt-20 pb-6 px-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{author.username}</h2>
            <p className="text-gray-400 mt-1">{author.bio || "No bio available"}</p>
            
            <div className="flex items-center mt-3 space-x-4">
              <Badge 
                className="flex items-center px-2 py-1"
                style={{ backgroundColor: color, color: "#000" }}
              >
                <Award className="mr-1 h-4 w-4" />
                {level}
              </Badge>
              
              <div className="flex items-center text-gray-400 text-sm">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>{reputation} reputation points</span>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm">
                <Users className="mr-1 h-4 w-4" />
                <span>{followers?.length || 0} followers</span>
              </div>
            </div>
          </div>
          
          {currentUser && parseInt(currentUser.uid) !== userId && (
            <Button 
              variant={isFollowing() ? "outline" : "default"}
              className={isFollowing() ? "border-[#9A6AFF] text-[#9A6AFF]" : "bg-[#9A6AFF]"}
              onClick={handleFollowToggle}
              disabled={followMutation.isPending}
            >
              {followMutation.isPending 
                ? "Processing..." 
                : isFollowing() ? "Unfollow" : "Follow"
              }
            </Button>
          )}
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#121212] border-[#2D3748]">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-gray-400 text-sm">Snippets</p>
                <p className="text-xl font-bold">{snippets?.length || 0}</p>
              </div>
              <Code className="h-8 w-8 text-[#9A6AFF]" />
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#2D3748]">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-gray-400 text-sm">Average Rating</p>
                <p className="text-xl font-bold">4.8</p>
              </div>
              <Star className="h-8 w-8 text-[#00FFFF]" />
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#2D3748]">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-gray-400 text-sm">Sales</p>
                <p className="text-xl font-bold">142</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-[#00FFFF]" />
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#2D3748]">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-gray-400 text-sm">Bundles</p>
                <p className="text-xl font-bold">5</p>
              </div>
              <Package className="h-8 w-8 text-[#9A6AFF]" />
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="snippets" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 bg-[#121212]">
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="snippets" className="mt-0">
            {snippetsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="bg-[#121212] border-[#2D3748] animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 w-3/4 bg-gray-700 rounded mb-4"></div>
                      <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : snippets && snippets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {snippets.map(snippet => (
                  <Card key={snippet.id} className="bg-[#121212] border-[#2D3748] hover:border-[#9A6AFF] transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{snippet.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {snippet.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-[#2D3748]">{snippet.language}</Badge>
                        <span className="font-bold">${snippet.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No snippets available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bundles" className="mt-0">
            <div className="text-center py-8 text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Bundle information coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="followers" className="mt-0">
            {followersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="bg-[#121212] border-[#2D3748] animate-pulse">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
                        <div className="h-3 w-1/3 bg-gray-700 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : followers && followers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {followers.map(follower => (
                  <Card key={follower.id} className="bg-[#121212] border-[#2D3748]">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={follower.followerAvatar} alt={follower.followerUsername} />
                        <AvatarFallback className="bg-[#2D3748]">
                          {follower.followerUsername?.substring(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{follower.followerUsername}</p>
                        <p className="text-sm text-gray-400">Follower since {new Date(follower.createdAt).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No followers yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};