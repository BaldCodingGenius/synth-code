import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, loading, signInWithGoogle, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-[#1E1E1E] border-b border-[#2D3748] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <a className="text-[#00FFFF] font-bold text-2xl flex items-center">
                <i className="fas fa-code mr-2"></i>
                <span>Synth</span>
              </a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/" 
                  ? "text-white border-b-2 border-[#00FFFF]" 
                  : "text-gray-300 hover:text-[#00FFFF]"
              }`}>
                Home
              </a>
            </Link>
            <Link href="/editor">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/editor" 
                  ? "text-white border-b-2 border-[#00FFFF]" 
                  : "text-gray-300 hover:text-[#00FFFF]"
              }`}>
                Editor
              </a>
            </Link>
            <Link href="/marketplace">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/marketplace" 
                  ? "text-white border-b-2 border-[#00FFFF]" 
                  : "text-gray-300 hover:text-[#00FFFF]"
              }`}>
                Marketplace
              </a>
            </Link>
            <Link href="/community">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/community" 
                  ? "text-white border-b-2 border-[#00FFFF]" 
                  : "text-gray-300 hover:text-[#00FFFF]"
              }`}>
                Community
              </a>
            </Link>
            <Link href="/dashboard">
              <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === "/dashboard" 
                  ? "text-white border-b-2 border-[#00FFFF]" 
                  : "text-gray-300 hover:text-[#00FFFF]"
              }`}>
                Dashboard
              </a>
            </Link>
          </nav>
          
          {/* User Profile Menu */}
          <div className="flex items-center space-x-4">
            <button className="bg-[#2D3748] hover:bg-[#1E2A38] p-2 rounded-md text-sm transition-colors duration-200">
              <i className="fas fa-search text-gray-400"></i>
            </button>
            
            {!currentUser ? (
              <Button 
                onClick={signInWithGoogle}
                disabled={loading}
                className="bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-white hover:from-[#8A5AEF] hover:to-[#00E0E0]"
              >
                {loading ? "Signing in..." : "Sign in with Google"}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9A6AFF]">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt={currentUser.displayName || "User"} 
                          className="h-8 w-8 rounded-full" 
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {currentUser.displayName ? currentUser.displayName.charAt(0) : "U"}
                        </span>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2D3748] border-[#1E1E1E] text-white min-w-[200px]">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.displayName}</p>
                      <p className="text-xs leading-none text-gray-400">{currentUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#4A5568]" />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-[#1E2A38]"
                    onClick={() => window.location.href = "/dashboard"}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-[#1E2A38]"
                    onClick={() => window.location.href = "/editor"}
                  >
                    Code Editor
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#4A5568]" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-400 hover:bg-[#1E2A38] hover:text-red-300"
                    onClick={logout}
                    disabled={loading}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                type="button" 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#2D3748] transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/" 
                    ? "text-white bg-[#1E2A38]" 
                    : "text-gray-300 hover:text-white hover:bg-[#2D3748]"
                }`}>
                  Home
                </a>
              </Link>
              <Link href="/editor">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/editor" 
                    ? "text-white bg-[#1E2A38]" 
                    : "text-gray-300 hover:text-white hover:bg-[#2D3748]"
                }`}>
                  Editor
                </a>
              </Link>
              <Link href="/marketplace">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/marketplace" 
                    ? "text-white bg-[#1E2A38]" 
                    : "text-gray-300 hover:text-white hover:bg-[#2D3748]"
                }`}>
                  Marketplace
                </a>
              </Link>
              <Link href="/community">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/community" 
                    ? "text-white bg-[#1E2A38]" 
                    : "text-gray-300 hover:text-white hover:bg-[#2D3748]"
                }`}>
                  Community
                </a>
              </Link>
              <Link href="/dashboard">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/dashboard" 
                    ? "text-white bg-[#1E2A38]" 
                    : "text-gray-300 hover:text-white hover:bg-[#2D3748]"
                }`}>
                  Dashboard
                </a>
              </Link>
              {!currentUser && (
                <Button 
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-[#9A6AFF] to-[#00FFFF] text-white hover:from-[#8A5AEF] hover:to-[#00E0E0]"
                >
                  {loading ? "Signing in..." : "Sign in with Google"}
                </Button>
              )}
              {currentUser && (
                <Button 
                  onClick={logout}
                  disabled={loading}
                  className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white"
                >
                  Sign out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
