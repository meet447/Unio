import { useEffect, useState } from "react";

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
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
            © {currentYear} Unio. All rights reserved.
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
      </div>
    </footer>
  );
};

export default Footer;
