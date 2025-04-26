import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Post, Comment } from "@/lib/types";

const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock user ID until authentication is implemented
  const mockUserId = 1;

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!newPost.trim()) {
        throw new Error("Post content cannot be empty");
      }
      
      const response = await apiRequest('POST', '/api/posts', {
        title: newPost.substring(0, 50),
        content: newPost,
        userId: mockUserId,
        type: activeTab
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setNewPost("");
      toast({
        title: "Success",
        description: "Your post has been published!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const upvotePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest('PATCH', `/api/posts/${postId}/upvote`, {
        userId: mockUserId
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handlePost = () => {
    createPostMutation.mutate();
  };

  const handleUpvote = (postId: number) => {
    upvotePostMutation.mutate(postId);
  };

  // Filter posts by the active tab
  const filteredPosts = posts.filter(post => post.type === activeTab);

  return (
    <section id="community" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#1E1E1E]">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Connect with developers, share your work, and participate in discussions.</p>
        </div>
        
        {/* Community Tabs */}
        <div className="bg-[#121212] rounded-t-xl overflow-hidden mb-8">
          <div className="flex border-b border-[#2D3748] overflow-x-auto">
            <button 
              className={`px-6 py-4 ${activeTab === "discussions" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-gray-400 hover:text-white"} font-medium`}
              onClick={() => setActiveTab("discussions")}
            >
              Discussions
            </button>
            <button 
              className={`px-6 py-4 ${activeTab === "showcases" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-gray-400 hover:text-white"} font-medium`}
              onClick={() => setActiveTab("showcases")}
            >
              Showcases
            </button>
            <button 
              className={`px-6 py-4 ${activeTab === "questions" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-gray-400 hover:text-white"} font-medium`}
              onClick={() => setActiveTab("questions")}
            >
              Questions
            </button>
            <button 
              className={`px-6 py-4 ${activeTab === "jobs" ? "text-[#00FFFF] border-b-2 border-[#00FFFF]" : "text-gray-400 hover:text-white"} font-medium`}
              onClick={() => setActiveTab("jobs")}
            >
              Jobs
            </button>
          </div>
        </div>
        
        {/* New Post Form */}
        <div className="bg-[#121212] p-4 rounded-xl mb-8">
          <div className="flex space-x-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-medium text-sm">JD</span>
            </div>
            <div className="flex-grow">
              <textarea 
                className="w-full bg-[#1E1E1E] border border-[#2D3748] rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#9A6AFF]" 
                placeholder={`Start a ${activeTab.slice(0, -1)} or share your code...`}
                rows={3}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              ></textarea>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white">
                    <i className="fas fa-code"></i>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <i className="fas fa-image"></i>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <i className="fas fa-link"></i>
                  </button>
                </div>
                <button 
                  className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 px-4 py-2 rounded-md text-black font-medium"
                  onClick={handlePost}
                  disabled={createPostMutation.isPending}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Posts */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="h-40 bg-[#121212] animate-pulse rounded-xl"></div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-[#121212] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#2D3748]">
                  <div className="flex justify-between">
                    <div className="flex space-x-3">
                      <div className="h-10 w-10 rounded-full bg-[#2D3748] flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <span className="text-white font-medium text-sm">
                          {post.username ? post.username.substring(0, 2).toUpperCase() : ""}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{post.username || "User"}</h3>
                        <p className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">{post.title}</h4>
                    <p className="text-gray-300">{post.content}</p>
                  </div>
                  {post.code && (
                    <div className="mt-4">
                      <div className="bg-[#1E1E1E] rounded-lg p-4 font-mono">
                        <pre className="text-xs overflow-auto">
                          <code>{post.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-[#1E1E1E]">
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <button 
                        className="flex items-center space-x-1 text-gray-400 hover:text-[#00FFFF] transition-colors duration-200"
                        onClick={() => handleUpvote(post.id)}
                      >
                        <i className="fas fa-arrow-up"></i>
                        <span>{post.upvotes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200">
                        <i className="far fa-comment"></i>
                        <span>{post.commentCount || 0}</span>
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors duration-200">
                      <i className="far fa-bookmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              No {activeTab} yet. Be the first to start a conversation!
            </div>
          )}
        </div>
        
        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="mt-8 text-center">
            <button className="border border-[#00FFFF] text-[#00FFFF] hover:bg-[#1E2A38] px-6 py-2 rounded-md font-medium transition-colors duration-200">
              Load More Discussions
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Community;
