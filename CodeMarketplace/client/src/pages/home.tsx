import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SnippetCard from "@/components/snippet-card";
import { Snippet } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const Home = () => {
  const { data: snippets = [], isLoading } = useQuery<Snippet[]>({
    queryKey: ['/api/snippets'],
  });
  const { currentUser, loading, signInWithGoogle } = useAuth();

  const featuredSnippets = snippets.slice(0, 3);

  return (
    <div className="bg-[#121212] text-[#E2E8F0]">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
        <div className="container mx-auto max-w-7xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-10 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                <span className="block">Code.</span>
                <span className="block">Publish.</span>
                <span className="bg-gradient-to-r from-[#00FFFF] to-[#9A6AFF] bg-clip-text text-transparent block">Earn.</span>
              </h1>
              <p className="mt-4 text-xl text-gray-300 max-w-lg">
                The community-driven platform where developers write, share, and monetize their code.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/editor">
                  <a className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-md px-8 py-3 text-black font-semibold inline-flex items-center justify-center">
                    <i className="fas fa-code mr-2"></i>
                    Start Coding Now
                  </a>
                </Link>
                <Link href="/marketplace">
                  <a className="border border-[#00FFFF] text-[#00FFFF] hover:bg-[#1E2A38] rounded-md px-8 py-3 font-semibold inline-flex items-center justify-center transition-colors duration-200">
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Browse Marketplace
                  </a>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#1E1E1E] p-6 rounded-xl shadow-lg font-mono text-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#E53E3E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#DD6B20]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#38A169]"></div>
                  </div>
                  <div className="text-xs text-gray-400">index.js</div>
                </div>
                <pre className="overflow-auto">
                  <code>
                    <span className="text-purple-400">const</span> <span className="text-blue-400">synth</span> = <span className="text-yellow-400">{'{'}</span>{'\n'}
                    {'  '}<span className="text-green-400">name</span>: <span className="text-orange-400">'Synth Platform'</span>,{'\n'}
                    {'  '}<span className="text-green-400">version</span>: <span className="text-orange-400">'1.0.0'</span>,{'\n'}
                    {'  '}<span className="text-green-400">createSnippet</span>: <span className="text-purple-400">function</span>(<span className="text-blue-400">code</span>, <span className="text-blue-400">language</span>) <span className="text-yellow-400">{'{'}</span>{'\n'}
                    {'    '}<span className="text-purple-400">return</span> <span className="text-yellow-400">{'{'}</span>{'\n'}
                    {'      '}<span className="text-green-400">id</span>: <span className="text-blue-400">generateId</span>(),{'\n'}
                    {'      '}<span className="text-green-400">code</span>,{'\n'}
                    {'      '}<span className="text-green-400">language</span>,{'\n'}
                    {'      '}<span className="text-green-400">price</span>: <span className="text-orange-400">2.99</span>,{'\n'}
                    {'      '}<span className="text-green-400">createdAt</span>: <span className="text-purple-400">new</span> <span className="text-blue-400">Date</span>(){'\n'}
                    {'    '}<span className="text-yellow-400">{'}'}</span>;{'\n'}
                    {'  '}<span className="text-yellow-400">{'}'}</span>{'\n'}
                    <span className="text-yellow-400">{'}'}</span>;
                  </code>
                </pre>
              </div>
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#9A6AFF] rounded-lg opacity-20 blur-xl"></div>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00FFFF] rounded-lg opacity-20 blur-xl"></div>
            </div>
          </div>
          
          {/* Featured Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mt-20">
            <div className="bg-[#1E1E1E] p-4 rounded-lg">
              <div className="text-3xl font-bold text-[#00FFFF]">5k+</div>
              <div className="text-sm text-gray-400">Developers</div>
            </div>
            <div className="bg-[#1E1E1E] p-4 rounded-lg">
              <div className="text-3xl font-bold text-[#00FFFF]">12k+</div>
              <div className="text-sm text-gray-400">Snippets</div>
            </div>
            <div className="bg-[#1E1E1E] p-4 rounded-lg">
              <div className="text-3xl font-bold text-[#00FFFF]">$250k</div>
              <div className="text-sm text-gray-400">Earned</div>
            </div>
            <div className="bg-[#1E1E1E] p-4 rounded-lg">
              <div className="text-3xl font-bold text-[#00FFFF]">8</div>
              <div className="text-sm text-gray-400">Languages</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Snippets Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#1E1E1E]">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Trending Code Snippets</h2>
            <Link href="/marketplace">
              <a className="text-[#9A6AFF] hover:text-[#00FFFF] font-medium flex items-center transition-colors duration-200">
                View All <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#121212] rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1E2A38] to-[#121212]">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start coding and earning?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of developers who are monetizing their code snippets on Synth.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!currentUser ? (
              <>
                <Button 
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-md px-8 py-3 text-black font-semibold inline-flex items-center justify-center"
                >
                  <i className="fas fa-google mr-2"></i>
                  {loading ? "Signing in..." : "Sign in with Google"}
                </Button>
                <a href="#features" className="bg-[#1E1E1E] hover:bg-[#2D3748] text-white rounded-md px-8 py-3 font-semibold inline-flex items-center justify-center transition-colors duration-200">
                  <i className="fas fa-info-circle mr-2"></i>
                  Learn More
                </a>
              </>
            ) : (
              <>
                <Link href="/editor">
                  <a className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-md px-8 py-3 text-black font-semibold inline-flex items-center justify-center">
                    <i className="fas fa-code mr-2"></i>
                    Start Coding Now
                  </a>
                </Link>
                <Link href="/dashboard">
                  <a className="bg-[#1E1E1E] hover:bg-[#2D3748] text-white rounded-md px-8 py-3 font-semibold inline-flex items-center justify-center transition-colors duration-200">
                    <i className="fas fa-tachometer-alt mr-2"></i>
                    Go to Dashboard
                  </a>
                </Link>
              </>
            )}
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl text-[#00FFFF] mb-2">
                <i className="fas fa-rocket"></i>
              </div>
              <h3 className="font-medium mb-1">Quick Start</h3>
              <p className="text-sm text-gray-400">Be up and running in minutes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#00FFFF] mb-2">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3 className="font-medium mb-1">Earn Money</h3>
              <p className="text-sm text-gray-400">Turn your code into income</p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#00FFFF] mb-2">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="font-medium mb-1">Secure Payments</h3>
              <p className="text-sm text-gray-400">Reliable payment processing</p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#00FFFF] mb-2">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="font-medium mb-1">Community</h3>
              <p className="text-sm text-gray-400">Connect with other developers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
