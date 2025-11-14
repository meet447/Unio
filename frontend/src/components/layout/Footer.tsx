import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [apiStatus, setApiStatus] = useState<string>("checking");

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("https://unio.onrender.com/health");
        if (response.ok) {
          setApiStatus("online");
        } else {
          setApiStatus("offline");
        }
      } catch (error) {
        setApiStatus("offline");
      }
    };

    checkApiStatus();
  }, []);

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">Unio</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-4">
              Unified AI provider integration platform for developers.
            </p>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  apiStatus === "online"
                    ? "bg-green-500"
                    : apiStatus === "offline"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {apiStatus === "online"
                  ? "All Systems Operational"
                  : apiStatus === "offline"
                  ? "API Offline"
                  : "Checking Status"}
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-black dark:text-white mb-4">Product</h4>
            <div className="space-y-3">
              <Link to="/features" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/docs" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Documentation
              </Link>
              <Link to="/security" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Security
              </Link>
            </div>
          </div>

          {/* Support Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-black dark:text-white mb-4">Support</h4>
            <div className="space-y-3">
              <Link to="/help" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Help Center
              </Link>
              <a href="mailto:support" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Contact Support
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-medium text-black dark:text-white mb-4">Legal</h4>
            <div className="space-y-3">
              <Link to="/privacy" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
              © {currentYear} Unio. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
