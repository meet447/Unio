import { Button } from "@/components/kibo-ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/kibo-ui/card";
import { Input } from "@/components/kibo-ui/input";
import { Label } from "@/components/kibo-ui/label";
import { Key, Mail, Lock, User, Github, Zap, BarChart3 } from "lucide-react";
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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-[#030303]">
      {/* Left Column: Auth Form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="mb-10">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity w-fit">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mr-2">
                <span className="text-black font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">unio</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {isRegister ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-[#888] text-base">
              {isRegister ? "Start building your AI infrastructure today." : "Enter your credentials to access your account."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {isRegister && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName?.(e.target.value)}
                    className="pl-10 h-11 bg-[#0f0f0f] border-[#222] text-white placeholder:text-gray-600 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/20 rounded-xl transition-all hover:bg-[#141414]"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-[#0f0f0f] border-[#222] text-white placeholder:text-gray-600 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/20 rounded-xl transition-all hover:bg-[#141414]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                {!isRegister && (
                  <Link to="#" className="text-xs text-[#888] hover:text-white transition-colors">Forgot password?</Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-[#0f0f0f] border-[#222] text-white placeholder:text-gray-600 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/20 rounded-xl transition-all hover:bg-[#141414]"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl bg-white hover:bg-gray-200 text-black font-semibold text-base transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]" disabled={loading}>
              {loading ? (isRegister ? "Creating account..." : "Signing in...") : (isRegister ? "Create Account" : "Sign In")}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#222]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#030303] px-2 text-[#666] font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full h-11 rounded-xl border-[#222] bg-[#0f0f0f] hover:bg-[#1a1a1a] text-white font-medium transition-all"
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
                className="w-full h-11 rounded-xl border-[#222] bg-[#0f0f0f] hover:bg-[#1a1a1a] text-white font-medium transition-all"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-[#888] font-medium">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                {" "}
                <Link
                  to={isRegister ? "/login" : "/register"}
                  className="text-white font-bold hover:underline transition-all"
                >
                  {isRegister ? "Sign in" : "Sign up"}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Feature Showcase */}
      <div className="hidden lg:flex flex-col justify-center bg-[#0a0a0a] p-12 lg:p-16 border-l border-[#1b1b1b]">
        <div className="max-w-md mx-auto space-y-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Join the next generation of AI infrastructure.</h2>
            <p className="text-lg text-[#888]">Thousands of developers trust Unio to manage their LLM deployments.</p>
          </div>

          <div className="space-y-6">
            {/* Feature Card 1 */}
            <div className="rounded-3xl p-6 bg-[#93c5fd] text-black transform hover:scale-[1.02] transition-transform duration-300 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Smart Model Fallback</h3>
                  <p className="text-sm text-black/80 font-medium leading-relaxed">Ensure 99.99% uptime with automatic provider switching on failure.</p>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="rounded-3xl p-6 bg-[#a7f3d0] text-black transform hover:scale-[1.02] transition-transform duration-300 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Built-in Analytics</h3>
                  <p className="text-sm text-black/80 font-medium leading-relaxed">Track usage, costs, and latency in real-time with deep insights.</p>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="rounded-3xl p-6 bg-[#e9d5ff] text-black transform hover:scale-[1.02] transition-transform duration-300 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Bring Your Own Keys</h3>
                  <p className="text-sm text-black/80 font-medium leading-relaxed">Securely store your credentials. We never fingerprint your usage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
