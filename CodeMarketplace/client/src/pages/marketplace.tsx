import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Snippet } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Custom premium code snippets for the marketplace
const PREMIUM_SNIPPETS = [
  {
    id: 101,
    title: "React Infinite Scroll Hook",
    description: "A custom React hook for implementing infinite scrolling with optimized performance",
    language: "javascript",
    price: "14.99",
    rating: 4.9,
    reviews: 42,
    tags: ["React", "Frontend", "Performance"]
  },
  {
    id: 102,
    title: "Node.js Authentication System",
    description: "Complete JWT authentication with refresh tokens, password reset, and email verification",
    language: "javascript",
    price: "29.99",
    rating: 4.8,
    reviews: 65,
    tags: ["Node.js", "Backend", "Security"]
  },
  {
    id: 103,
    title: "Next.js Data Fetching Patterns",
    description: "Optimized patterns for SSR, ISR, and CSR data fetching in Next.js applications",
    language: "typescript",
    price: "19.99",
    rating: 4.7,
    reviews: 38,
    tags: ["Next.js", "React", "Performance"]
  },
  {
    id: 104,
    title: "Vue 3 Composable Store",
    description: "A lightweight state management solution using Vue 3 composition API",
    language: "javascript",
    price: "12.99",
    rating: 4.5,
    reviews: 27,
    tags: ["Vue", "Frontend", "State Management"]
  },
  {
    id: 105,
    title: "CSS Grid Layout Generator",
    description: "Dynamic grid layout generator with responsive breakpoints and custom properties",
    language: "css",
    price: "9.99",
    rating: 4.6,
    reviews: 31,
    tags: ["CSS", "Frontend", "UI/UX"]
  },
  {
    id: 106,
    title: "GraphQL Pagination Resolver",
    description: "Cursor-based pagination implementation for GraphQL APIs with relay spec compliance",
    language: "javascript",
    price: "17.99",
    rating: 4.8,
    reviews: 42,
    tags: ["GraphQL", "Backend", "API"]
  },
  {
    id: 107,
    title: "Python FastAPI CRUD Generator",
    description: "Automatic CRUD endpoint generator for FastAPI with SQLAlchemy integration",
    language: "python",
    price: "24.99",
    rating: 4.9,
    reviews: 56,
    tags: ["Python", "Backend", "API"]
  },
  {
    id: 108,
    title: "React Native Animation Library",
    description: "High-performance animations for React Native with gesture handler integration",
    language: "javascript",
    price: "32.99",
    rating: 4.7,
    reviews: 45,
    tags: ["React Native", "Mobile", "Animation"]
  },
  {
    id: 109,
    title: "Serverless AWS Lambda Functions",
    description: "Collection of optimized AWS Lambda functions for common serverless patterns",
    language: "javascript",
    price: "28.99",
    rating: 4.6,
    reviews: 39,
    tags: ["AWS", "Serverless", "Backend"]
  },
  {
    id: 110,
    title: "Django ORM Query Optimizer",
    description: "Optimizes complex Django ORM queries to reduce database load and improve performance",
    language: "python",
    price: "19.99",
    rating: 4.8,
    reviews: 47,
    tags: ["Django", "Python", "Database"]
  },
  {
    id: 111,
    title: "Flutter Custom Animations",
    description: "Smooth, customizable animations for Flutter widgets with physics-based interactions",
    language: "dart",
    price: "16.99",
    rating: 4.5,
    reviews: 32,
    tags: ["Flutter", "Mobile", "Animation"]
  },
  {
    id: 112,
    title: "Svelte Store Actions",
    description: "Custom store actions for Svelte with derived states and persistence",
    language: "javascript",
    price: "11.99",
    rating: 4.7,
    reviews: 28,
    tags: ["Svelte", "Frontend", "State Management"]
  },
  {
    id: 113,
    title: "Go REST API Middleware",
    description: "Production-ready middleware collection for Go REST APIs with logging and rate limiting",
    language: "go",
    price: "22.99",
    rating: 4.8,
    reviews: 36,
    tags: ["Go", "Backend", "API"]
  },
  {
    id: 114,
    title: "Rust WebAssembly Image Processing",
    description: "High-performance image processing algorithms compiled to WebAssembly using Rust",
    language: "rust",
    price: "37.99",
    rating: 4.9,
    reviews: 41,
    tags: ["Rust", "WebAssembly", "Performance"]
  },
  {
    id: 115,
    title: "Laravel API Resource Generator",
    description: "Automatic API resource and transformer generation for Laravel applications",
    language: "php",
    price: "18.99",
    rating: 4.6,
    reviews: 33,
    tags: ["Laravel", "PHP", "Backend"]
  },
  {
    id: 116,
    title: "Angular Performance Directives",
    description: "Custom directives for Angular to optimize rendering and change detection",
    language: "typescript",
    price: "15.99",
    rating: 4.7,
    reviews: 29,
    tags: ["Angular", "Frontend", "Performance"]
  },
  {
    id: 117,
    title: "Three.js 3D Particle System",
    description: "GPU-accelerated particle system for Three.js with configurable physics",
    language: "javascript",
    price: "26.99",
    rating: 4.8,
    reviews: 37,
    tags: ["Three.js", "WebGL", "3D Graphics"]
  },
  {
    id: 118,
    title: "Spring Boot Security Configuration",
    description: "Comprehensive security configuration for Spring Boot applications with OAuth2",
    language: "java",
    price: "31.99",
    rating: 4.9,
    reviews: 48,
    tags: ["Spring", "Java", "Security"]
  },
  {
    id: 119,
    title: "TensorFlow.js Image Classification",
    description: "Browser-based image classification using TensorFlow.js with pre-trained models",
    language: "javascript",
    price: "24.99",
    rating: 4.7,
    reviews: 35,
    tags: ["Machine Learning", "TensorFlow", "Frontend"]
  },
  {
    id: 120,
    title: "Ruby on Rails API Caching",
    description: "Advanced caching strategies for Ruby on Rails APIs with Redis integration",
    language: "ruby",
    price: "21.99",
    rating: 4.6,
    reviews: 30,
    tags: ["Ruby", "Rails", "Performance"]
  }
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortOption, setSortOption] = useState("popular");
  const [previewSnippet, setPreviewSnippet] = useState<null | any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 50]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  
  // Get real snippets from API
  const { data: apiSnippets = [], isLoading: isLoadingApi } = useQuery<Snippet[]>({
    queryKey: ['/api/snippets'],
  });

  // Function to view snippet preview
  const handlePreview = (snippet: any) => {
    setPreviewSnippet(snippet);
  };

  // Combine API snippets with premium ones for demo
  const allSnippets = [...apiSnippets, ...PREMIUM_SNIPPETS.map(s => ({
    ...s,
    code: `// Example code for ${s.title}\n\n// This is a preview of the premium snippet\n// Purchase to get the full implementation\n\nfunction example() {\n  console.log("Premium code snippet");\n  // More code would be available after purchase\n}`,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    userId: 0,
    downloadable: false,
  }))];

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (snippetId: number) => {
      const snippet = allSnippets.find(s => s.id === snippetId);
      if (!snippet) throw new Error('Snippet not found');
      
      const userId = currentUser?.uid || 1; // Use firebase ID if available
      
      const response = await apiRequest('POST', '/api/purchases', {
        snippetId,
        buyerId: userId,
        price: snippet.price
      });
      
      return response.json();
    },
    onSuccess: () => {
      const userId = currentUser?.uid || 1;
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/purchases`] });
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

  const handlePurchase = (snippetId: number) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase snippets",
        variant: "destructive"
      });
      return;
    }
    purchaseMutation.mutate(snippetId);
  };

  // Get all available languages and tags from snippets
  const allLanguages = ["All", ...new Set(allSnippets.map(s => s.language))];
  const allTags = ["All", ...new Set(allSnippets.flatMap(s => s.tags || []))];
  
  // Filter and sort snippets
  const filteredSnippets = allSnippets
    .filter(snippet => {
      // Search query filter
      const matchesSearch = searchQuery === "" || 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (snippet.description && snippet.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Language filter
      const matchesLanguage = selectedLanguage === "All" || 
        snippet.language === selectedLanguage.toLowerCase();
      
      // Tag filter (if available)
      const matchesTag = selectedTag === "All" ||
        (snippet.tags && snippet.tags.includes(selectedTag));
      
      // Price range filter
      const price = Number(snippet.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      return matchesSearch && matchesLanguage && matchesTag && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === "popular") {
        // Sort by rating and number of reviews
        const aPopularity = (a.rating || 4.5) * (a.reviews || 10);
        const bPopularity = (b.rating || 4.5) * (b.reviews || 10);
        return bPopularity - aPopularity;
      } else if (sortOption === "price-asc") {
        return Number(a.price) - Number(b.price);
      } else { // price-desc
        return Number(b.price) - Number(a.price);
      }
    });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#121212] min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-transparent bg-clip-text">
            Code Marketplace
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse and buy premium code snippets from our global community of developers. 
            From UI components to algorithm implementations, find the code you need.
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 mb-8 shadow-xl border border-[#2D3748]">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#121212] border-[#2D3748] h-12 pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-[#121212] border-[#2D3748] w-[140px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-[#2D3748]">
                  {allLanguages.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="bg-[#121212] border-[#2D3748] w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-[#2D3748]">
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="bg-[#121212] border-[#2D3748] w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-[#2D3748]">
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2 pl-4 border-l border-[#2D3748]">
                <Button 
                  variant="outline" 
                  size="icon"
                  className={`${viewMode === 'grid' ? 'bg-[#2D3748]' : 'bg-transparent'} border-[#2D3748]`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fas fa-th-large"></i>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={`${viewMode === 'list' ? 'bg-[#2D3748]' : 'bg-transparent'} border-[#2D3748]`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fas fa-list"></i>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 mb-2">
            {filteredSnippets.length} snippets found
          </div>
        </div>
        
        {/* Snippet Grid */}
        {isLoadingApi ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#1E1E1E] rounded-lg h-[280px] animate-pulse"></div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <Card 
                key={snippet.id} 
                className="bg-[#1E1E1E] border-[#2D3748] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#9A6AFF]/10"
              >
                <div className="bg-[#121212] p-4 h-28 overflow-hidden font-mono text-xs relative">
                  <pre className="overflow-hidden">
                    <code className="text-gray-300">{snippet.code.substring(0, 200)}...</code>
                  </pre>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] pointer-events-none"></div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{snippet.title}</h3>
                    <Badge variant="outline" className="bg-[#2D3748] text-white border-none">
                      {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-400 h-10 overflow-hidden">{snippet.description}</p>
                  
                  {snippet.tags && (
                    <div className="flex flex-wrap gap-1 mt-3 mb-2">
                      {snippet.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-[#2D3748]/50 text-gray-300 hover:bg-[#2D3748] cursor-pointer transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-star text-yellow-400 text-xs"></i>
                      <span className="text-white">{snippet.rating || 4.5}</span>
                      <span className="text-gray-400 text-xs">({snippet.reviews || 10})</span>
                    </div>
                    <span className="text-[#00FFFF] font-semibold">${Number(snippet.price).toFixed(2)}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#2D3748] hover:bg-[#2D3748]"
                    onClick={() => handlePreview(snippet)}
                  >
                    Preview
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black hover:shadow-lg"
                    onClick={() => handlePurchase(snippet.id)}
                    disabled={purchaseMutation.isPending}
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSnippets.map((snippet) => (
              <div 
                key={snippet.id} 
                className="bg-[#1E1E1E] border border-[#2D3748] rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:bg-[#1E1E1E]/80 transition-colors"
              >
                <div className="md:w-1/4">
                  <h3 className="font-semibold text-white text-lg mb-2">{snippet.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge className="bg-[#2D3748] text-white">
                      {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)}
                    </Badge>
                    {snippet.tags && snippet.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-[#2D3748]/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    <i className="fas fa-star text-yellow-400"></i>
                    <span className="text-white">{snippet.rating || 4.5}</span>
                    <span className="text-gray-400 text-xs">({snippet.reviews || 10})</span>
                  </div>
                  <div className="text-[#00FFFF] font-semibold text-lg">${Number(snippet.price).toFixed(2)}</div>
                </div>
                
                <div className="md:w-2/4">
                  <p className="text-gray-400 mb-3">{snippet.description}</p>
                  <div className="bg-[#121212] p-3 rounded font-mono text-xs mb-2 max-h-20 overflow-hidden relative">
                    <pre>
                      <code className="text-gray-300">{snippet.code.substring(0, 100)}...</code>
                    </pre>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="md:w-1/4 flex flex-col justify-center gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#2D3748] hover:bg-[#2D3748]"
                    onClick={() => handlePreview(snippet)}
                  >
                    <i className="fas fa-eye mr-2"></i> Preview
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black hover:shadow-lg"
                    onClick={() => handlePurchase(snippet.id)}
                    disabled={purchaseMutation.isPending}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i> Buy Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Load More */}
        {filteredSnippets.length > 0 && (
          <div className="mt-10 text-center">
            <Button variant="outline" className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#1E2A38]">
              Load More Snippets
            </Button>
          </div>
        )}
        
        {filteredSnippets.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4"><i className="fas fa-search text-gray-600"></i></div>
            <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
            <p className="text-gray-400">Try adjusting your filters or search for something else</p>
          </div>
        )}
      </div>
      
      {/* Snippet Preview Dialog */}
      {previewSnippet && (
        <Dialog open={!!previewSnippet} onOpenChange={() => setPreviewSnippet(null)}>
          <DialogContent className="bg-[#1E1E1E] border-[#2D3748] text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center justify-between">
                {previewSnippet.title}
                <Badge className="bg-[#2D3748] ml-2">
                  {previewSnippet.language.charAt(0).toUpperCase() + previewSnippet.language.slice(1)}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {previewSnippet.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-[#121212] rounded-md p-4 font-mono text-sm overflow-auto max-h-[400px]">
              <pre className="text-gray-300">
                <code>{previewSnippet.code}</code>
              </pre>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                <span>{previewSnippet.rating || 4.5}</span>
                <span className="text-gray-400 text-sm ml-1">({previewSnippet.reviews || 10} reviews)</span>
              </div>
              <span className="text-[#00FFFF] font-semibold text-xl">${Number(previewSnippet.price).toFixed(2)}</span>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="text-gray-400 space-y-1">
                <li><i className="fas fa-check text-green-400 mr-2"></i> Full source code with documentation</li>
                <li><i className="fas fa-check text-green-400 mr-2"></i> Multiple usage examples</li>
                <li><i className="fas fa-check text-green-400 mr-2"></i> Compatible with latest frameworks</li>
                <li><i className="fas fa-check text-green-400 mr-2"></i> Free updates for 1 year</li>
              </ul>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewSnippet(null)} className="border-[#2D3748]">
                Close
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black"
                onClick={() => {
                  handlePurchase(previewSnippet.id);
                  setPreviewSnippet(null);
                }}
              >
                Buy Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default Marketplace;