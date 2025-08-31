import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthFormProps {
  isRegister?: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFullName?: (fullName: string) => void;
  email?: string;
  password?: string;
  fullName?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isRegister = false,
  onSubmit,
  loading,
  setEmail,
  setPassword,
  setFullName,
  email,
  password,
  fullName,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black">
      {/* Logo/Brand Link */}
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 bg-black dark:bg-white rounded-sm flex items-center justify-center mr-2">
            <span className="text-white dark:text-black font-bold text-sm">U</span>
          </div>
          <span className="text-lg font-semibold text-black dark:text-white">unio</span>
        </Link>
      </div>
      
      <Card className="w-full max-w-sm bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="text-center space-y-1">
          <div className="w-10 h-10 bg-black dark:bg-white rounded flex items-center justify-center mx-auto mb-2">
            <Key className="w-5 h-5 text-white dark:text-black" />
          </div>
          <CardTitle className="text-xl text-black dark:text-white">{isRegister ? "Create account" : "Sign in"}</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRegister ? "Get started with Unio" : "Enter your credentials to access your account"}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <Label htmlFor="name" className="text-black dark:text-white">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                  <Input 
                    id="name" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName?.(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="password" className="text-black dark:text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black" disabled={loading}>
              {loading ? (isRegister ? "Creating account..." : "Signing in...") : (isRegister ? "Create Account" : "Sign In")}
            </Button>
            
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                {" "}
                <Link 
                  to={isRegister ? "/login" : "/register"} 
                  className="text-black dark:text-white font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {isRegister ? "Sign in" : "Sign up"}
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
