import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Favorite } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Heart, 
  Share2, 
  Copy, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Link as LinkIcon,
  Check
} from "lucide-react";
import { SiDiscord, SiGithub, SiReddit } from "react-icons/si";

interface SocialActionsProps {
  snippetId: number;
  snippetTitle: string;
  minimal?: boolean;
}

export const SocialActions = ({ snippetId, snippetTitle, minimal = false }: SocialActionsProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  
  // Check if user has favorited this snippet
  const { data: favorites } = useQuery<Favorite[]>({
    queryKey: ["/api/users/current/favorites"],
    enabled: !!currentUser
  });
  
  const isFavorited = favorites?.some(fav => fav.snippetId === snippetId);
  
  // Toggle favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("You must be logged in to favorite snippets");
      
      if (isFavorited) {
        // Remove favorite
        return apiRequest("DELETE", `/api/favorites`, {
          userId: parseInt(currentUser.uid),
          snippetId
        });
      } else {
        // Add favorite
        return apiRequest("POST", `/api/favorites`, {
          userId: parseInt(currentUser.uid),
          snippetId
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/current/favorites"] });
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited 
          ? `"${snippetTitle}" removed from your favorites` 
          : `"${snippetTitle}" added to your favorites`,
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
  
  // Share mutation
  const shareMutation = useMutation({
    mutationFn: async (platform: string) => {
      if (!currentUser) return; // Anonymous sharing is allowed, but we'll track if logged in
      
      return apiRequest("POST", `/api/shares`, {
        userId: parseInt(currentUser.uid),
        snippetId,
        platform
      });
    },
    onSuccess: () => {
      // No need to invalidate anything
    },
    onError: (error: Error) => {
      console.error("Failed to record share:", error);
      // We don't show errors for share tracking to users
    }
  });
  
  const handleFavoriteToggle = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to favorite snippets",
        variant: "destructive"
      });
      return;
    }
    favoriteMutation.mutate();
  };
  
  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/snippets/${snippetId}`;
    const text = `Check out this code snippet: ${snippetTitle}`;
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(`Code Snippet: ${snippetTitle}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
      case "discord":
        // No direct sharing URL for Discord, users have to copy the link
        navigator.clipboard.writeText(`${text}\n${url}`);
        toast({
          title: "Copied to clipboard",
          description: "Now you can paste it in Discord",
        });
        break;
      case "github":
        // No direct sharing URL for GitHub, users have to copy the link
        navigator.clipboard.writeText(`${text}\n${url}`);
        toast({
          title: "Copied to clipboard",
          description: "Now you can paste it in GitHub",
        });
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
        toast({
          title: "Link copied",
          description: "Link copied to clipboard",
        });
        break;
    }
    
    // Record the share
    shareMutation.mutate(platform);
    
    // Open new window for sharing (except for copy and email)
    if (platform !== 'copy' && platform !== 'email' && platform !== 'discord' && platform !== 'github') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } else if (platform === 'email') {
      window.location.href = shareUrl;
    }
    
    // Close dialog after sharing
    if (platform !== 'copy') {
      setIsShareDialogOpen(false);
    }
  };
  
  // Minimal version for cards
  if (minimal) {
    return (
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`p-0 h-8 w-8 rounded-full ${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={handleFavoriteToggle}
                disabled={favoriteMutation.isPending}
              >
                <Heart className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} />
                <span className="sr-only">{isFavorited ? 'Remove from favorites' : 'Add to favorites'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFavorited ? 'Remove from favorites' : 'Add to favorites'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-8 w-8 rounded-full text-gray-400 hover:text-gray-300"
                onClick={() => setIsShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share this snippet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Share Dialog */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="bg-[#1E1E1E] border-[#2D3748] text-white">
            <DialogHeader>
              <DialogTitle>Share this snippet</DialogTitle>
              <DialogDescription className="text-gray-400">
                Share "{snippetTitle}" with others
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-4 gap-3 py-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 border-[#2D3748] hover:bg-[#2D3748] hover:text-[#00FFFF]"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-6 w-6 mb-1" />
                <span className="text-xs">Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 border-[#2D3748] hover:bg-[#2D3748] hover:text-[#00FFFF]"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-6 w-6 mb-1" />
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 border-[#2D3748] hover:bg-[#2D3748] hover:text-[#00FFFF]"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-6 w-6 mb-1" />
                <span className="text-xs">LinkedIn</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 border-[#2D3748] hover:bg-[#2D3748] hover:text-[#00FFFF]"
                onClick={() => handleShare('reddit')}
              >
                <SiReddit className="h-6 w-6 mb-1" />
                <span className="text-xs">Reddit</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 border-[#2D3748] hover:bg-[#2D3748] hover:text-[#00FFFF]"
                onClick={() => handleShare('discord')}
              >
                <SiDiscord className="h-6 w-6 mb-1" />
                <span className="text-xs">Discord</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 border-[#2D3748] hover:bg-[#2D3748] hover:text-[#00FFFF]"
                onClick={() => handleShare('github')}
              >
                <SiGithub className="h-6 w-6 mb-1" />
                <span className="text-xs">GitHub</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 border-[#2D3748] hover:bg-[#2D3748] hover:text-[#00FFFF]"
                onClick={() => handleShare('email')}
              >
                <Mail className="h-6 w-6 mb-1" />
                <span className="text-xs">Email</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 border-[#2D3748] hover:bg-[#2D3748] hover:text-[#00FFFF]"
                onClick={() => handleShare('copy')}
              >
                {linkCopied ? (
                  <Check className="h-6 w-6 mb-1 text-green-500" />
                ) : (
                  <LinkIcon className="h-6 w-6 mb-1" />
                )}
                <span className="text-xs">{linkCopied ? 'Copied!' : 'Copy Link'}</span>
              </Button>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsShareDialogOpen(false)}
                className="border-[#2D3748]"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  // Full version
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        className={`flex items-center space-x-2 border-[#2D3748] ${
          isFavorited ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400' : 'hover:bg-[#2D3748] hover:text-white'
        }`}
        onClick={handleFavoriteToggle}
        disabled={favoriteMutation.isPending}
      >
        <Heart className="h-5 w-5 mr-1.5" fill={isFavorited ? "currentColor" : "none"} />
        <span>{isFavorited ? 'Favorited' : 'Add to Favorites'}</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-[#2D3748] hover:bg-[#2D3748] hover:text-white">
            <Share2 className="h-5 w-5 mr-1.5" />
            <span>Share</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#1E1E1E] border-[#2D3748] text-white">
          <DropdownMenuItem 
            className="flex items-center cursor-pointer hover:bg-[#2D3748]"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
            <span>Twitter</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center cursor-pointer hover:bg-[#2D3748]"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-4 w-4 mr-2 text-[#4267B2]" />
            <span>Facebook</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center cursor-pointer hover:bg-[#2D3748]"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="h-4 w-4 mr-2 text-[#0077B5]" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center cursor-pointer hover:bg-[#2D3748]"
            onClick={() => handleShare('reddit')}
          >
            <SiReddit className="h-4 w-4 mr-2 text-[#FF4500]" />
            <span>Reddit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center cursor-pointer hover:bg-[#2D3748]"
            onClick={() => handleShare('discord')}
          >
            <SiDiscord className="h-4 w-4 mr-2 text-[#5865F2]" />
            <span>Discord</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center cursor-pointer hover:bg-[#2D3748]"
            onClick={() => handleShare('email')}
          >
            <Mail className="h-4 w-4 mr-2 text-[#00FFFF]" />
            <span>Email</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center cursor-pointer hover:bg-[#2D3748]"
            onClick={() => handleShare('copy')}
          >
            {linkCopied ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-2 text-[#9A6AFF]" />
            )}
            <span>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};