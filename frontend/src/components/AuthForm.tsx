import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Mail, Lock, User } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-1">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center mx-auto mb-2">
            <Key className="w-5 h-5 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">{isRegister ? "Create account" : "Sign in"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {isRegister ? "Get started with Unio" : "Enter your credentials to access your account"}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="name" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName?.(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isRegister ? "Creating account..." : "Signing in...") : (isRegister ? "Create Account" : "Sign In")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
