import { Toaster } from "@/components/kibo-ui/toaster";
import { Toaster as Sonner } from "@/components/kibo-ui/sonner";
import { TooltipProvider } from "@/components/kibo-ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Dashboard from "./pages/Dashboard";
import ApiKeys from "./pages/ApiKeys";
import Logs from "./pages/Logs";
import Models from "./pages/Models";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CheckEmail from "./pages/CheckEmail";
import Security from "./pages/Security";
import OAuthCallback from "./components/OAuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="features" element={<Features />} />
              <Route path="profile" element={<Profile />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="check-email" element={<CheckEmail />} />
              <Route path="auth/callback" element={<OAuthCallback />} />
              <Route path="security" element={<Security />} />
            </Route>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="api-keys" element={<ApiKeys />} />
              <Route path="logs" element={<Logs />} />
              <Route path="models" element={<Models />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
