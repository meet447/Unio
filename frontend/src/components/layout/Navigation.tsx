import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BarChart, User, HelpCircle, LogOut, BookOpen } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="h-5 w-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { path: "/docs", label: "Documentation", icon: <BookOpen className="h-5 w-5" /> },
    { path: "/help", label: "Help Center", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-medium text-black dark:text-white">Unio</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Button
                      variant="ghost"
                      onClick={signOut}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6 text-sm font-medium"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
