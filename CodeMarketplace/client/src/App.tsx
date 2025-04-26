import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Editor from "@/pages/editor";
import Marketplace from "@/pages/marketplace";
import Dashboard from "@/pages/dashboard";
import Community from "@/pages/community";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/editor" component={Editor} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/community" component={Community} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Set the body background color to match our dark theme
  useEffect(() => {
    document.body.classList.add("bg-[#121212]", "text-[#E2E8F0]");
    return () => {
      document.body.classList.remove("bg-[#121212]", "text-[#E2E8F0]");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
