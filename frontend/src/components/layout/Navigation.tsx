import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BarChart, User, HelpCircle, LogOut, BookOpen, Github, Star, Sparkles } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const publicNavItems = [
    { path: "/features", label: "Features" },
    { path: "/docs", label: "Docs" },
    { path: "/help", label: "Contact" },
  ];

  const publicNavItemsWithPlayground = [
    { path: "/playground", label: "Playground", icon: <Sparkles className="h-4 w-4" /> },
    ...publicNavItems,
  ];

  const userNavItems = [
    { path: "/playground", label: "Playground", icon: <Sparkles className="h-5 w-5" /> },
    { path: "/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="h-5 w-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { path: "/docs", label: "Documentation", icon: <BookOpen className="h-5 w-5" /> },
  ];

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black dark:bg-white rounded-sm flex items-center justify-center mr-2">
              <span className="text-white dark:text-black font-bold text-sm sm:text-lg">U</span>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-black dark:text-white">unio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {!user && publicNavItemsWithPlayground.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white flex items-center gap-1.5 ${
                  location.pathname === item.path ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
                } ${item.path === '/playground' ? 'font-semibold' : ''}`}
              >
                {'icon' in item && item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors hidden sm:block"
                >
                  Log in
                </Link>
                <Button
                  asChild
                  className="bg-black hover:bg-gray-800 text-white px-3 sm:px-4 py-2 text-sm font-medium rounded-md touch-manipulation min-h-[40px] sm:min-h-[44px]"
                >
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
            
            {/* Mobile menu button for public navigation */}
            {!user && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden p-2 touch-manipulation">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 sm:w-80 bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col space-y-4 mt-6">
                    {/* Mobile GitHub stats */}

                    
                    {/* Mobile navigation links */}
                    {publicNavItemsWithPlayground.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`text-base font-medium transition-colors p-2 rounded-md flex items-center gap-2 ${
                          location.pathname === item.path 
                            ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                        } ${item.path === '/playground' ? 'font-semibold' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {'icon' in item && item.icon}
                        {item.label}
                      </Link>
                    ))}
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <Link
                        to="/login"
                        className="block text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 p-2 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            {/* User menu for authenticated users */}
            {user && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 touch-manipulation">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 sm:w-80 bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col space-y-3 mt-6">
                    {userNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 text-base font-medium transition-colors p-3 rounded-md ${
                          location.pathname === item.path
                            ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800'
                            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <Button
                        variant="ghost"
                        onClick={signOut}
                        className="flex items-center space-x-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 w-full justify-start p-3 rounded-md"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
