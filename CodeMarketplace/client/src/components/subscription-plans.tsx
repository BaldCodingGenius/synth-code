import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Subscription plans with features and pricing
const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for solo developers or hobbyists",
    price: 9.99,
    billingPeriod: "monthly",
    features: [
      "Download up to 5 snippets/month",
      "Access to basic snippets",
      "Community support"
    ],
    color: "#9A6AFF"
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for professional developers",
    price: 19.99,
    billingPeriod: "monthly",
    featured: true,
    features: [
      "Download up to 20 snippets/month",
      "Access to all snippets",
      "Priority support",
      "No ads",
      "AI-powered code recommendations"
    ],
    color: "#00FFFF"
  },
  {
    id: "premium",
    name: "Premium",
    description: "For teams and serious developers",
    price: 49.99,
    billingPeriod: "monthly",
    features: [
      "Unlimited downloads",
      "Access to all snippets and bundles",
      "24/7 priority support",
      "Custom code requests",
      "Team sharing capabilities",
      "Advanced analytics"
    ],
    color: "#FF6B8B"
  }
];

// Yearly subscription plans with discount
const YEARLY_PLANS = SUBSCRIPTION_PLANS.map(plan => ({
  ...plan,
  price: Math.floor(plan.price * 10) / 10, // 10% discount rounded
  billingPeriod: "yearly",
  yearlyPrice: Math.floor(plan.price * 12 * 0.8 * 10) / 10 // 20% yearly discount
}));

interface SubscriptionPlansProps {
  onSubscribe?: (tier: string) => void;
}

export const SubscriptionPlans = ({ onSubscribe }: SubscriptionPlansProps) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  
  const plans = billingPeriod === "monthly" ? SUBSCRIPTION_PLANS : YEARLY_PLANS;
  
  const subscribeMutation = useMutation({
    mutationFn: async (subscriptionData: { tier: string; billingPeriod: string }) => {
      if (!currentUser) throw new Error("You must be logged in to subscribe");
      
      const response = await apiRequest("POST", "/api/subscriptions", {
        tier: subscriptionData.tier,
        billingPeriod: subscriptionData.billingPeriod,
        userId: currentUser.uid
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/current"] });
      toast({
        title: "Subscription successful!",
        description: `You are now subscribed to the ${selectedPlan.name} plan.`,
      });
      if (onSubscribe) onSubscribe(selectedPlan.id);
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleSubscribe = (plan: any) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe",
        variant: "destructive"
      });
      return;
    }
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };
  
  const confirmSubscription = () => {
    subscribeMutation.mutate({
      tier: selectedPlan.id,
      billingPeriod: billingPeriod
    });
  };
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-[#121212] min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-transparent bg-clip-text">
            Subscription Plans
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock unlimited access to premium code snippets and exclusive features. 
            Choose the plan that best fits your needs.
          </p>
          
          <div className="mt-8 inline-flex items-center p-1 bg-[#1E1E1E] rounded-lg">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "outline"}
              className={`${billingPeriod === "monthly" ? "bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black" : "bg-transparent text-white"}`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === "yearly" ? "default" : "outline"}
              className={`${billingPeriod === "yearly" ? "bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black" : "bg-transparent text-white"}`}
              onClick={() => setBillingPeriod("yearly")}
            >
              Yearly <Badge className="ml-2 bg-[#FF6B8B] text-white">Save 20%</Badge>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={`${plan.id}-${billingPeriod}`}
              className={`bg-[#1E1E1E] border ${plan.featured ? 'border-[#00FFFF] ring-2 ring-[#00FFFF]/20' : 'border-[#2D3748]'} relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#00FFFF] text-black text-xs font-bold py-1 px-3 rotate-45 translate-x-3 -translate-y-3 shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  <span style={{ color: plan.color }}>{plan.name}</span>
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${billingPeriod === "yearly" ? plan.yearlyPrice : plan.price}</span>
                  <span className="text-gray-400 ml-2">/{billingPeriod === "yearly" ? "year" : "month"}</span>
                  
                  {billingPeriod === "yearly" && (
                    <div className="mt-2 text-sm text-[#FF6B8B]">
                      Save ${Math.round((plan.price * 12) - plan.yearlyPrice)} per year
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-[#00FFFF] mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${plan.featured ? 'bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-black hover:shadow-lg hover:shadow-[#00FFFF]/20' : 'bg-[#2D3748] hover:bg-[#3D4758] text-white'}`}
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? 'Processing...' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Subscription FAQs */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          
          <Tabs defaultValue="what" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="what">What's Included</TabsTrigger>
              <TabsTrigger value="how">How It Works</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="what" className="bg-[#1E1E1E] p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-4">What's included in my subscription?</h4>
              <p className="text-gray-400 mb-4">
                Your subscription gives you access to our entire library of code snippets based on your plan tier.
                Pro and Premium plans include additional features such as AI-powered recommendations, priority support,
                and team sharing capabilities.
              </p>
              <p className="text-gray-400">
                All snippets are vetted by our quality team and come with full documentation.
                Premium subscribers also get access to exclusive bundle packages.
              </p>
            </TabsContent>
            
            <TabsContent value="how" className="bg-[#1E1E1E] p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-4">How does the subscription work?</h4>
              <p className="text-gray-400 mb-4">
                After subscribing, you'll immediately gain access to all features included in your plan.
                You can download snippets, access premium content, and use all available features right away.
              </p>
              <p className="text-gray-400">
                Your subscription will automatically renew at the end of your billing period.
                You can cancel or change your plan at any time from your account settings.
              </p>
            </TabsContent>
            
            <TabsContent value="billing" className="bg-[#1E1E1E] p-6 rounded-lg">
              <h4 className="text-lg font-medium mb-4">Billing and cancellation</h4>
              <p className="text-gray-400 mb-4">
                We offer both monthly and yearly billing options. Yearly subscriptions come with a 20% discount.
                You'll be billed automatically at the beginning of each billing period.
              </p>
              <p className="text-gray-400">
                You can cancel your subscription at any time. After cancellation, you'll still have access to your plan
                until the end of the current billing period.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1E1E1E] border-[#2D3748] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription className="text-gray-400">
              You are about to subscribe to the {selectedPlan?.name} plan.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">{selectedPlan.name} Plan ({billingPeriod})</span>
                <span className="font-bold">
                  ${billingPeriod === "yearly" ? selectedPlan.yearlyPrice : selectedPlan.price}
                  /{billingPeriod === "yearly" ? "year" : "month"}
                </span>
              </div>
              
              <div className="bg-[#121212] p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">Includes:</h4>
                <ul className="space-y-2 text-sm">
                  {selectedPlan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-[#00FFFF] mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                You'll be charged ${billingPeriod === "yearly" ? selectedPlan.yearlyPrice : selectedPlan.price} for your {billingPeriod} subscription.
                Your subscription will automatically renew at the end of the {billingPeriod === "yearly" ? "year" : "month"}.
              </p>
            </div>
          )}
          
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
              onClick={confirmSubscription}
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};