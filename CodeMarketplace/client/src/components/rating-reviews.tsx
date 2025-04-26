import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Review } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AuthorProfile } from "@/components/author-profile";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarHalf, Calendar, AlertCircle } from "lucide-react";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(10, "Review must be at least 10 characters").max(500, "Review cannot exceed 500 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface RatingReviewsProps {
  snippetId: number;
}

export const RatingReviews = ({ snippetId }: RatingReviewsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  
  // Get reviews for this snippet
  const { 
    data: reviews, 
    isLoading: reviewsLoading, 
    isError: reviewsError 
  } = useQuery<Review[]>({
    queryKey: [`/api/snippets/${snippetId}/reviews`],
    enabled: !!snippetId
  });
  
  // Calculate average rating
  const averageRating = reviews?.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;
  
  // Group reviews by rating
  const reviewCounts = reviews?.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>) || {};
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: "",
    },
  });
  
  const reviewMutation = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      if (!currentUser) throw new Error("You must be logged in to submit a review");
      
      const response = await apiRequest("POST", `/api/snippets/${snippetId}/reviews`, {
        userId: parseInt(currentUser.uid),
        snippetId,
        rating: values.rating,
        content: values.content,
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/snippets/${snippetId}/reviews`] });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setIsDialogOpen(false);
      form.reset();
      setSelectedRating(0);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };
  
  const onSubmit = (values: ReviewFormValues) => {
    reviewMutation.mutate(values);
  };
  
  // Check if user has already submitted a review
  const hasSubmittedReview = reviews?.some(
    review => currentUser && review.userId === parseInt(currentUser.uid)
  );
  
  // Rating stars component
  const RatingStars = ({ rating, size = "medium", interactive = false }: { rating: number, size?: "small" | "medium" | "large", interactive?: boolean }) => {
    const starSizes = {
      small: "w-4 h-4",
      medium: "w-5 h-5",
      large: "w-6 h-6",
    };
    
    const sizeClass = starSizes[size];
    const displayRating = interactive ? (hoverRating || selectedRating) : rating;
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`${interactive ? "cursor-pointer" : ""} text-yellow-500`}
            onClick={interactive ? () => handleStarClick(i) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          >
            {i <= Math.floor(displayRating) ? (
              <Star className={sizeClass} />
            ) : i - 0.5 <= displayRating ? (
              <StarHalf className={sizeClass} />
            ) : (
              <Star className={`${sizeClass} text-gray-600`} />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-8">
      <Card className="bg-[#1E1E1E] border-[#2D3748]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Ratings & Reviews
          </CardTitle>
          <CardDescription>
            See what other developers think about this code snippet
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {reviewsLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-12 w-12 rounded-full border-4 border-t-[#9A6AFF] border-r-[#9A6AFF] border-b-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-gray-400">Loading reviews...</p>
            </div>
          ) : reviewsError ? (
            <div className="flex flex-col items-center justify-center py-8 text-red-500">
              <AlertCircle className="h-12 w-12 mb-2" />
              <p>Failed to load reviews</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Summary */}
              <div className="col-span-1 flex flex-col items-center justify-center bg-[#121212] p-6 rounded-lg">
                <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                <RatingStars rating={averageRating} size="large" />
                <p className="text-gray-400 mt-2">Based on {reviews?.length || 0} reviews</p>
                
                <div className="w-full mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => {
                    const count = reviewCounts[stars] || 0;
                    const percentage = reviews?.length 
                      ? Math.round((count / reviews.length) * 100) 
                      : 0;
                    
                    return (
                      <div key={stars} className="flex items-center">
                        <span className="text-sm w-8">{stars}</span>
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <div className="flex-1 bg-[#2D3748] h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-400 ml-2 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 w-full">
                  <Button 
                    className="w-full bg-[#9A6AFF]"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={!currentUser || hasSubmittedReview}
                  >
                    {!currentUser 
                      ? "Sign in to Review" 
                      : hasSubmittedReview 
                        ? "You've Already Reviewed" 
                        : "Write a Review"
                    }
                  </Button>
                  
                  {hasSubmittedReview && (
                    <p className="text-xs text-center text-gray-400 mt-2">
                      You can only submit one review per snippet
                    </p>
                  )}
                </div>
              </div>
              
              {/* Reviews List */}
              <div className="col-span-2 space-y-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map(review => (
                    <Card key={review.id} className="bg-[#121212] border-[#2D3748]">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={review.userAvatar} alt={review.username || "User"} />
                              <AvatarFallback className="bg-[#2D3748]">
                                {review.username?.substring(0, 2).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.username || "Anonymous"}</p>
                              <div className="flex items-center text-sm text-gray-400">
                                <RatingStars rating={review.rating} size="small" />
                                <span className="mx-2">•</span>
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>
                                  {new Date(review.createdAt).toLocaleDateString(undefined, { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300">
                          {review.content || "No comment provided."}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-[#121212] rounded-lg">
                    <Star className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg">No reviews yet</p>
                    <p className="text-sm mt-2">Be the first to review this snippet!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Review Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] border-[#2D3748] text-white">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share your thoughts about this code snippet
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-1">
                        <RatingStars 
                          rating={selectedRating} 
                          size="large" 
                          interactive 
                        />
                        {selectedRating > 0 && (
                          <span className="ml-2 text-gray-400">
                            {selectedRating === 1 ? "Poor" : 
                             selectedRating === 2 ? "Fair" : 
                             selectedRating === 3 ? "Good" : 
                             selectedRating === 4 ? "Very Good" : "Excellent"}
                          </span>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Click on a star to rate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What did you think about this code snippet? How did it help you?"
                        className="min-h-[120px] bg-[#121212] border-[#2D3748]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 10 characters, maximum 500
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-[#2D3748]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#9A6AFF]"
                  disabled={reviewMutation.isPending || selectedRating === 0}
                >
                  {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};