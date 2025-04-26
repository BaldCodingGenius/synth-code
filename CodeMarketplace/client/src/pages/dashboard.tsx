import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Snippet, Purchase, User } from "@/lib/types";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("myCode");
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  
  // Mock user ID until authentication is implemented
  const mockUserId = 1;

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${mockUserId}`],
  });

  const { data: snippets = [] } = useQuery<Snippet[]>({
    queryKey: [`/api/users/${mockUserId}/snippets`],
  });

  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: [`/api/users/${mockUserId}/purchases`],
  });

  const { data: sales = [] } = useQuery<any>({
    queryKey: [`/api/users/${mockUserId}/sales`],
  });

  // Calculate total earnings
  const totalEarnings = sales?.reduce((sum: number, sale: any) => sum + Number(sale.price), 0) || 0;
  
  // Get active snippets count
  const activeSnippets = snippets.filter(snippet => snippet.publishedAt).length;
  
  // Get total downloads/sales
  const totalSales = sales?.length || 0;

  return (
    <section id="dashboard" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#121212]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Track Your Progress</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Monitor your code submissions, sales, and earnings all in one place.</p>
        </div>
        
        <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="bg-[#121212] p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-[#2D3748]">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : "JD"}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{user?.username || "John Doe"}</h3>
                  <p className="text-sm text-gray-400">Full-stack Developer</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button 
                  className={`flex items-center px-4 py-3 rounded-md w-full text-left ${
                    activeView === "myCode" 
                      ? "text-[#00FFFF] bg-[#1E2A38]" 
                      : "text-white hover:bg-[#1E2A38]"
                  }`}
                  onClick={() => setActiveView("myCode")}
                >
                  <i className="fas fa-code-branch w-5 h-5 mr-3"></i>
                  <span>My Code</span>
                </button>
                <button 
                  className={`flex items-center px-4 py-3 rounded-md w-full text-left ${
                    activeView === "salesEarnings" 
                      ? "text-[#00FFFF] bg-[#1E2A38]" 
                      : "text-white hover:bg-[#1E2A38]"
                  }`}
                  onClick={() => setActiveView("salesEarnings")}
                >
                  <i className="fas fa-chart-line w-5 h-5 mr-3"></i>
                  <span>Sales & Earnings</span>
                </button>
                <button 
                  className={`flex items-center px-4 py-3 rounded-md w-full text-left ${
                    activeView === "purchaseHistory" 
                      ? "text-[#00FFFF] bg-[#1E2A38]" 
                      : "text-white hover:bg-[#1E2A38]"
                  }`}
                  onClick={() => setActiveView("purchaseHistory")}
                >
                  <i className="fas fa-shopping-bag w-5 h-5 mr-3"></i>
                  <span>Purchase History</span>
                </button>
                <button 
                  className={`flex items-center px-4 py-3 rounded-md w-full text-left ${
                    activeView === "settings" 
                      ? "text-[#00FFFF] bg-[#1E2A38]" 
                      : "text-white hover:bg-[#1E2A38]"
                  }`}
                  onClick={() => setActiveView("settings")}
                >
                  <i className="fas fa-cog w-5 h-5 mr-3"></i>
                  <span>Settings</span>
                </button>
              </nav>
            </div>
            
            {/* Main Dashboard Content */}
            <div className="col-span-3 p-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#121212] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Total Earnings</div>
                  <div className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)} AUD</div>
                  <div className="text-xs text-[#00FFFF] mt-2">
                    <i className="fas fa-arrow-up mr-1"></i> 12% from last month
                  </div>
                </div>
                <div className="bg-[#121212] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Active Snippets</div>
                  <div className="text-2xl font-bold text-white">{activeSnippets}</div>
                  <div className="text-xs text-[#00FFFF] mt-2">
                    <i className="fas fa-plus mr-1"></i> {snippets.length - activeSnippets} drafts
                  </div>
                </div>
                <div className="bg-[#121212] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Total Downloads</div>
                  <div className="text-2xl font-bold text-white">{totalSales}</div>
                  <div className="text-xs text-[#00FFFF] mt-2">
                    <i className="fas fa-arrow-up mr-1"></i> 24% from last month
                  </div>
                </div>
              </div>
              
              {activeView === "myCode" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">My Snippets</h3>
                    <button className="text-[#9A6AFF] text-sm hover:text-[#00FFFF]">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {snippets.length > 0 ? (
                      snippets.map((snippet) => (
                        <div key={snippet.id} className="bg-[#121212] p-4 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-[#1E1E1E] p-2 rounded mr-4">
                              <i className="fas fa-code text-[#00FFFF]"></i>
                            </div>
                            <div>
                              <h4 className="font-medium">{snippet.title}</h4>
                              <div className="text-xs text-gray-400">
                                Uploaded {new Date(snippet.createdAt).toLocaleDateString()} • {snippet.language}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              ${Number(snippet.price).toFixed(2)} AUD
                            </div>
                            <div className="text-xs text-gray-400">
                              {snippet.publishedAt ? "Published" : "Draft"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No snippets found. Start writing code in the editor!
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeView === "salesEarnings" && (
                <>
                  {/* Sales Chart */}
                  <div className="bg-[#121212] p-4 rounded-lg mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Sales Over Time</h3>
                      <select 
                        className="bg-[#1E1E1E] text-white text-sm py-1 px-2 rounded border border-[#2D3748]"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                    <div className="h-64 flex items-end space-x-2">
                      {/* Chart Bars */}
                      <div className="w-full flex items-end space-x-1 px-2">
                        {Array(12).fill(0).map((_, i) => {
                          const height = 10 + Math.random() * 40;
                          return (
                            <div 
                              key={i} 
                              className={`h-[${height}%] bg-[#9A6AFF]/20 hover:bg-[#9A6AFF]/40 flex-grow rounded-t transition-all duration-200`}
                              style={{ height: `${height}%` }}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-4 text-xs text-gray-400">
                      <div>Week 1</div>
                      <div>Week 2</div>
                      <div>Week 3</div>
                      <div>Week 4</div>
                    </div>
                  </div>
                  
                  {/* Recent Sales */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Recent Sales</h3>
                      <button className="text-[#9A6AFF] text-sm hover:text-[#00FFFF]">View All</button>
                    </div>
                    
                    <div className="space-y-4">
                      {sales && sales.length > 0 ? (
                        sales.slice(0, 5).map((sale: any) => (
                          <div key={sale.id} className="bg-[#121212] p-4 rounded-lg flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-[#1E1E1E] p-2 rounded mr-4">
                                <i className="fas fa-file-code text-[#00FFFF]"></i>
                              </div>
                              <div>
                                <h4 className="font-medium">{sale.snippetTitle || "Code Snippet"}</h4>
                                <div className="text-xs text-gray-400">
                                  Sold on {new Date(sale.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">${Number(sale.price).toFixed(2)} AUD</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          No sales yet. Publish your first snippet to start earning!
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {activeView === "purchaseHistory" && (
                <div>
                  <h3 className="font-semibold mb-4">Your Purchases</h3>
                  
                  <div className="space-y-4">
                    {purchases.length > 0 ? (
                      purchases.map((purchase) => (
                        <div key={purchase.id} className="bg-[#121212] p-4 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-[#1E1E1E] p-2 rounded mr-4">
                              <i className="fas fa-file-download text-[#00FFFF]"></i>
                            </div>
                            <div>
                              <h4 className="font-medium">Snippet #{purchase.snippetId}</h4>
                              <div className="text-xs text-gray-400">
                                Purchased on {new Date(purchase.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">${Number(purchase.price).toFixed(2)} AUD</div>
                            </div>
                            <button className="bg-[#1E1E1E] hover:bg-[#1E2A38] px-3 py-1 rounded text-white text-sm">
                              Download
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No purchases yet. Browse the marketplace to find useful code snippets!
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeView === "settings" && (
                <div>
                  <h3 className="font-semibold mb-6">Account Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Username</label>
                          <input 
                            type="text" 
                            className="w-full bg-[#121212] text-white py-2 px-3 rounded-md border border-[#2D3748]"
                            value={user?.username || ""}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Email</label>
                          <input 
                            type="email" 
                            className="w-full bg-[#121212] text-white py-2 px-3 rounded-md border border-[#2D3748]"
                            value={user?.email || ""}
                            disabled
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm mb-1">Bio</label>
                          <textarea 
                            className="w-full bg-[#121212] text-white py-2 px-3 rounded-md border border-[#2D3748]"
                            rows={3}
                            value={user?.bio || ""}
                            disabled
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Payment Settings</h4>
                      <div className="bg-[#121212] p-4 rounded-md border border-[#2D3748]">
                        <p className="text-gray-400 mb-4">Connect your payment method to receive earnings from your sold snippets.</p>
                        <button className="bg-[#9A6AFF] hover:bg-[#9A6AFF]/90 text-white px-4 py-2 rounded-md text-sm">
                          Connect Payment Method
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Notification Preferences</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Email notifications for sales</span>
                          <div className="h-6 w-10 bg-[#9A6AFF] rounded-full relative cursor-pointer">
                            <div className="h-4 w-4 bg-white rounded-full absolute top-1 right-1"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Email notifications for comments</span>
                          <div className="h-6 w-10 bg-[#1E1E1E] rounded-full relative cursor-pointer">
                            <div className="h-4 w-4 bg-white rounded-full absolute top-1 left-1"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Marketing emails</span>
                          <div className="h-6 w-10 bg-[#1E1E1E] rounded-full relative cursor-pointer">
                            <div className="h-4 w-4 bg-white rounded-full absolute top-1 left-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
