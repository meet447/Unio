import { Toaster } from "@/components/kibo-ui/toaster";
import { Toaster as Sonner } from "@/components/kibo-ui/sonner";
import { TooltipProvider } from "@/components/kibo-ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { Suspense, lazy } from "react";

// Lazy load layouts
const Layout = lazy(() => import("./components/layout/Layout"));
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ApiKeys = lazy(() => import("./pages/ApiKeys"));
const Logs = lazy(() => import("./pages/Logs"));
const Models = lazy(() => import("./pages/Models"));
const Profile = lazy(() => import("./pages/Profile"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Vaults = lazy(() => import("./pages/Vaults"));
const Docs = lazy(() => import("./pages/Docs"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OAuthCallback = lazy(() => import("./components/OAuthCallback"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="auth/callback" element={<OAuthCallback />} />
              </Route>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="api-keys" element={<ApiKeys />} />
                <Route path="logs" element={<Logs />} />
                <Route path="models" element={<Models />} />
                <Route path="vaults" element={<Vaults />} />
              </Route>
              <Route path="/docs" element={<Docs />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
