import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/kibo-ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/kibo-ui/sheet";
import { Menu, BarChart, User, HelpCircle, LogOut, BookOpen, Sparkles, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/kibo-ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const publicNavItems: Array<{ path: string; label: string; icon?: React.ReactNode }> = [
    { path: "/features", label: "Models" },
    { path: "/help", label: "Support" },
    { path: "/docs", label: "Docs" },
  ];

  const userNavItems: Array<{ path: string; label: string; icon: React.ReactNode }> = [
    { path: "/playground", label: "Playground", icon: <Sparkles className="h-5 w-5" /> },
    { path: "/dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="h-5 w-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { path: "/docs", label: "Documentation", icon: <BookOpen className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <svg 
              className="w-6 h-6 text-white transition-transform group-hover:scale-110" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-xl font-semibold text-white tracking-tight">Unio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {!user && publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Button
                  asChild
                  className="bg-white text-black hover:bg-gray-100 px-4 py-2 text-sm font-medium rounded-lg transition-all"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <BarChart className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/playground">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Playground
                    </Button>
                  </Link>
                </div>
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white mr-2">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="hidden sm:inline text-sm">{user.email?.split('@')[0] || 'User'}</span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <BarChart className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2 text-gray-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-gray-900 border-gray-800">
                <div className="flex flex-col space-y-1 mt-8">
                  {(!user ? publicNavItems : userNavItems).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  {user && (
                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <Button
                        variant="ghost"
                        onClick={signOut}
                        className="flex items-center gap-3 w-full justify-start px-4 py-3 text-base font-medium text-red-400 hover:text-red-300 hover:bg-gray-800"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
