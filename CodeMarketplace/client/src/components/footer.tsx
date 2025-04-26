import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#1E1E1E] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#2D3748]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-[#00FFFF] font-bold text-2xl flex items-center mb-4">
              <i className="fas fa-code mr-2"></i>
              <span>Synth</span>
            </div>
            <p className="text-gray-400 mb-4">The community-driven platform where developers write, share, and monetize their code.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00FFFF] transition-colors duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FFFF] transition-colors duration-200">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FFFF] transition-colors duration-200">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FFFF] transition-colors duration-200">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
              <li><Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors duration-200">Marketplace</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">Dashboard</Link></li>
              <li><Link href="/community" className="text-gray-400 hover:text-white transition-colors duration-200">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">API Reference</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Licenses</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[#2D3748] flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Synth. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <select className="bg-[#121212] text-white py-2 px-4 rounded-md border border-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#9A6AFF]">
              <option>English (US)</option>
              <option>French</option>
              <option>German</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
