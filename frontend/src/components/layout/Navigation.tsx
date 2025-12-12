import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/kibo-ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/kibo-ui/sheet";
import { Menu, BarChart, User, LogOut, BookOpen, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/kibo-ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const publicNavItems: Array<{ path: string; label: string }> = [
    { path: "/features", label: "Models" },
  ];

  const userNavItems: Array<{ path: string; label: string; icon: React.ReactNode }> = [
    { path: "/dashboard", label: "Dashboard", icon: <BarChart className="h-4 w-4" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart className="h-4 w-4" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-[#1b1b1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-black" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Unio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {!user && publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path 
                    ? 'text-white' 
                    : 'text-[#888] hover:text-white'
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
                  className="hidden sm:block text-sm font-medium text-[#888] hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Button
                  asChild
                  className="bg-white text-black hover:bg-[#e1e1e1] px-5 py-2 text-sm font-medium rounded-full transition-all hover:scale-105"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="text-[#888] hover:text-white hover:bg-[#111]">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                </div>
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-[#888] hover:text-white hover:bg-[#111] gap-2 rounded-full px-3">
                      <div className="w-5 h-5 rounded-full bg-[#333] flex items-center justify-center text-[10px] text-white">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="hidden sm:inline text-sm font-normal">{user.email?.split('@')[0] || 'User'}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border-[#1d1d1d] text-[#888]">
                    <DropdownMenuItem asChild className="hover:bg-[#111] hover:text-white focus:bg-[#111] focus:text-white">
                      <Link to="/profile" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-[#111] focus:bg-[#111] focus:text-red-300">
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
                <Button variant="ghost" size="sm" className="lg:hidden p-2 text-[#888] hover:text-white hover:bg-[#111]">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-[#0a0a0a] border-[#1d1d1d] p-6">
                <div className="flex flex-col space-y-2 mt-8">
                  {(!user ? publicNavItems : userNavItems).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                        location.pathname === item.path
                          ? 'text-black bg-white'
                          : 'text-[#888] hover:text-white hover:bg-[#111]'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  {user && (
                    <div className="border-t border-[#1d1d1d] pt-4 mt-4">
                      <Button
                        variant="ghost"
                        onClick={signOut}
                        className="flex items-center gap-3 w-full justify-start px-4 py-3 text-base font-medium text-red-400 hover:text-red-300 hover:bg-[#111]"
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
