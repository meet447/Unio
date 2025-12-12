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
    <footer className="border-t border-[#1b1b1b] bg-[#030303]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Company Info */}
          <div className="col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Unio</h3>
            <p className="text-sm text-[#888] font-light leading-relaxed">
              Unified AI provider integration platform for developers.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  apiStatus === "online"
                    ? "bg-[#82f2a6] shadow-[0_0_8px_rgba(130,242,166,0.5)]"
                    : apiStatus === "offline"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-xs text-[#888] font-medium uppercase tracking-wider">
                {apiStatus === "online"
                  ? "Systems Operational"
                  : apiStatus === "offline"
                  ? "API Offline"
                  : "Checking Status"}
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Product</h4>
            <div className="space-y-4">
              <Link to="/features" className="block text-sm text-[#888] hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/security" className="block text-sm text-[#888] hover:text-white transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1b1b1b] pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-xs text-[#666] font-light">
              © {currentYear} Unio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
