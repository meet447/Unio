import { Button } from "@/components/kibo-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/kibo-ui/card";
import { Input } from "@/components/kibo-ui/input";
import { Label } from "@/components/kibo-ui/label";
import { Key, Mail, Lock, User, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
  const { signInWithGoogle, signInWithGitHub } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleGitHubSignIn = async () => {
    await signInWithGitHub();
  };
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
            
            {/* OAuth Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-black px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
            
            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path 
                    fill="currentColor" 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path 
                    fill="currentColor" 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path 
                    fill="currentColor" 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path 
                    fill="currentColor" 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGitHubSignIn}
                className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
            
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
