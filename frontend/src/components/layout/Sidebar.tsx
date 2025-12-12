import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Key, 
  Zap, 
  User, 
  Heart,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/dashboard/api-keys", label: "API Keys", icon: Key },
    { path: "/dashboard/logs", label: "Logs", icon: FileText },
    { path: "/dashboard/models", label: "Models", icon: Zap },
  ];

  const bottomNavItems = [
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      <style>{`
        .dashboard-sidebar a,
        .dashboard-sidebar a:link,
        .dashboard-sidebar a:visited,
        .dashboard-sidebar a:hover,
        .dashboard-sidebar a:active,
        .dashboard-sidebar a:focus {
          color: inherit !important;
          text-decoration: none !important;
        }
      `}</style>
      <aside className="dashboard-sidebar fixed left-0 top-16 bottom-0 w-64 bg-[#0a0a0a]/50 backdrop-blur-md overflow-y-auto">
        <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#1b1b1b]">
          <Link to="/" className="flex items-center gap-2">
            <svg 
              className="w-6 h-6 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-xl font-semibold text-white">Unio</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === "/dashboard" && location.pathname.startsWith("/dashboard") && !location.pathname.includes("/api-keys") && !location.pathname.includes("/models") && !location.pathname.includes("/logs") && !location.pathname.includes("/credits"));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-0 ${
                  isActive
                    ? 'bg-[#0f0f0f] text-white'
                    : 'text-[#a9a9a9] hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="border-t border-[#181818] mx-4" />

        {/* Bottom Navigation */}
        <nav className="p-4 space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-0 ${
                  isActive
                    ? 'bg-[#0f0f0f] text-white'
                    : 'text-[#a9a9a9] hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

