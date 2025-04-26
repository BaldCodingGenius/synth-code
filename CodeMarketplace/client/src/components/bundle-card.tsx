import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Bundle, Snippet } from "@/lib/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { AuthorProfile } from "@/components/author-profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Code, 
  ArrowRight, 
  FileCode, 
  LayoutGrid, 
  Tag,
  Star 
} from "lucide-react";
import { Link } from "wouter";

interface BundleCardProps {
  bundle: Bundle;
  detailed?: boolean;
  snippets?: Snippet[];
}

export const BundleCard = ({ bundle, detailed = false, snippets }: BundleCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("You must be logged in to make a purchase");
      
      const response = await apiRequest("POST", "/api/purchases/bundle", {
        bundleId: bundle.id,
        buyerId: parseInt(currentUser.uid),
        price: bundle.price
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/current/purchases"] });
      toast({
        title: "Purchase successful!",
        description: `You now have access to all snippets in the "${bundle.name}" bundle.`,
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handlePurchase = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase this bundle",
        variant: "destructive"
      });
      return;
    }
    setIsDialogOpen(true);
  };
  
  const confirmPurchase = () => {
    purchaseMutation.mutate();
  };
  
  // Basic version (for grid/list views)
  if (!detailed) {
    return (
      <Card className="bg-[#1E1E1E] border-[#2D3748] hover:border-[#9A6AFF] transition-all hover:-translate-y-1 overflow-hidden h-full flex flex-col">
        {bundle.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={bundle.coverImage} 
              alt={bundle.name}
              className="object-cover w-full h-full"
            />
            {bundle.featured && (
              <Badge className="absolute top-2 right-2 bg-[#9A6AFF]">
                Featured
              </Badge>
            )}
          </div>
        )}
        
        <CardHeader className={bundle.coverImage ? "pb-2" : "pt-6 pb-2"}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-[#00FFFF]" />
            <Badge className="bg-[#2D3748]">{bundle.snippetCount || 0} snippets</Badge>
            {bundle.category && (
              <Badge variant="outline" className="border-[#9A6AFF] text-[#9A6AFF]">
                {bundle.category}
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl">{bundle.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {bundle.description || "A collection of useful code snippets"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="flex items-center justify-between mb-4">
            <AuthorProfile userId={bundle.userId} minimal />
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>4.5</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-0">
          <span className="text-xl font-bold">${bundle.price}</span>
          <Link href={`/bundles/${bundle.id}`}>
            <Button className="bg-[#2D3748] hover:bg-[#3D4758]">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }
  
  // Detailed version (for bundle detail page)
  return (
    <div className="space-y-8">
      <Card className="bg-[#1E1E1E] border-[#2D3748] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {bundle.coverImage && (
            <div className="md:w-1/3 relative">
              <img 
                src={bundle.coverImage} 
                alt={bundle.name}
                className="object-cover w-full h-full min-h-[300px]"
              />
              {bundle.featured && (
                <Badge className="absolute top-4 right-4 bg-[#9A6AFF]">
                  Featured
                </Badge>
              )}
            </div>
          )}
          
          <div className={`md:${bundle.coverImage ? 'w-2/3' : 'w-full'} p-8`}>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-[#00FFFF]" />
              <Badge className="bg-[#2D3748]">{bundle.snippetCount || 0} snippets</Badge>
              {bundle.category && (
                <Badge variant="outline" className="border-[#9A6AFF] text-[#9A6AFF]">
                  {bundle.category}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{bundle.name}</h1>
            <p className="text-gray-400 mb-6">
              {bundle.description || "A comprehensive collection of code snippets to help you build faster and better."}
            </p>
            
            <div className="flex items-center justify-between mb-8">
              <AuthorProfile userId={bundle.userId} minimal />
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="text-lg">4.5</span>
                <span className="text-gray-400 text-sm ml-1">(23 reviews)</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-400 text-sm">Bundle Price</span>
                <div className="flex items-center">
                  <span className="text-3xl font-bold mr-2">${bundle.price}</span>
                  <Badge className="bg-[#00FFFF] text-black">
                    Save 40%
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">
                  Includes all {bundle.snippetCount || "featured"} snippets
                </p>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black text-lg py-6 px-8"
                onClick={handlePurchase}
                disabled={purchaseMutation.isPending}
              >
                {purchaseMutation.isPending ? 'Processing...' : 'Purchase Bundle'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Bundle Contents */}
      <Card className="bg-[#1E1E1E] border-[#2D3748]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <FileCode className="mr-2 h-5 w-5 text-[#00FFFF]" />
            Bundle Contents
          </CardTitle>
          <CardDescription>
            This bundle includes {bundle.snippetCount || 0} carefully curated code snippets
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {snippets && snippets.length > 0 ? (
            <div className="space-y-4">
              {snippets.map((snippet, index) => (
                <div 
                  key={snippet.id}
                  className="flex justify-between items-center p-4 bg-[#121212] rounded-md hover:bg-[#1A1A1A] transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 w-6">{index + 1}.</span>
                    <div>
                      <h3 className="font-medium">{snippet.title}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <Code className="h-4 w-4 mr-1" />
                        <span>{snippet.language}</span>
                        {snippet.tags && snippet.tags.length > 0 && (
                          <div className="flex items-center ml-3">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>
                              {snippet.tags.slice(0, 2).join(', ')}
                              {snippet.tags.length > 2 && '...'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Individual price</div>
                    <div>${snippet.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <LayoutGrid className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Snippet details will be available after purchase</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Purchase Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] border-[#2D3748] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription className="text-gray-400">
              You are about to purchase the "{bundle.name}" bundle.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-4 border-b border-[#2D3748] pb-4">
              <span className="font-medium">{bundle.name}</span>
              <span className="font-bold">${bundle.price}</span>
            </div>
            
            <div className="text-sm text-gray-400 mb-6">
              <p>This bundle includes:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{bundle.snippetCount || 0} code snippets</li>
                <li>Instant access to all bundle contents</li>
                <li>Lifetime access and updates</li>
                <li>Full documentation</li>
              </ul>
            </div>
            
            <div className="bg-[#121212] p-4 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span className="font-bold">${bundle.price}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-[#2D3748]"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black"
              onClick={confirmPurchase}
              disabled={purchaseMutation.isPending}
            >
              {purchaseMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};