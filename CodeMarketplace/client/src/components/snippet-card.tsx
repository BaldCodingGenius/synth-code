import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Snippet } from "@/lib/types";

interface SnippetCardProps {
  snippet: Snippet;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock user ID until authentication is implemented
  const mockUserId = 1;

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/purchases', {
        snippetId: snippet.id,
        buyerId: mockUserId,
        price: snippet.price
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${mockUserId}/purchases`] });
      toast({
        title: "Purchase Successful",
        description: "You can now download the snippet from your dashboard.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handlePurchase = () => {
    purchaseMutation.mutate();
  };

  // Helper function to get language display name
  const getLanguageDisplay = (language: string): string => {
    switch (language.toLowerCase()) {
      case 'js':
      case 'javascript':
        return 'JavaScript';
      case 'py':
      case 'python':
        return 'Python';
      case 'html':
        return 'HTML/CSS';
      default:
        return language.charAt(0).toUpperCase() + language.slice(1);
    }
  };

  return (
    <div className="bg-[#121212] rounded-lg overflow-hidden border border-[#2D3748] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-[#9A6AFF]/10">
      <div className="p-4 h-36 overflow-hidden bg-[#1E1E1E] font-mono text-xs">
        <pre className="overflow-hidden">
          <code>{snippet.code.substring(0, 400)}...</code>
        </pre>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{snippet.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{snippet.description}</p>
          </div>
          <span className="bg-[#2D3748] px-2 py-1 rounded text-xs font-medium">
            {getLanguageDisplay(snippet.language)}
          </span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-[#2D3748] flex items-center justify-center text-xs">
              {snippet.username ? snippet.username.substring(0, 2).toUpperCase() : "JS"}
            </div>
            <span className="text-gray-400 text-xs ml-2">by {snippet.username || "jsmaster"}</span>
          </div>
          <span className="text-[#00FFFF] font-semibold">${Number(snippet.price).toFixed(2)}</span>
        </div>
        <div className="mt-4">
          <button 
            className="w-full bg-[#2D3748] hover:bg-[#1E2A38] text-white rounded-md py-2 font-medium transition-colors duration-200"
            onClick={handlePurchase}
            disabled={purchaseMutation.isPending}
          >
            {purchaseMutation.isPending ? "Processing..." : "Buy & Download"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;
