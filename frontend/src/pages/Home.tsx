import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Zap, Shield, Activity, BarChart3 } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-0 relative">
        {/* Background Doodles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating circles */}
          <div className="absolute top-20 left-2 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 border-2 border-gray-200 dark:border-gray-800 rounded-full opacity-30"></div>
          <div className="absolute top-40 right-4 sm:right-20 w-12 sm:w-20 h-12 sm:h-20 border-2 border-gray-200 dark:border-gray-800 rounded-full opacity-20"></div>
          <div className="absolute bottom-32 left-1/4 w-8 sm:w-16 h-8 sm:h-16 border-2 border-gray-200 dark:border-gray-800 rounded-full opacity-25"></div>

          {/* Stars */}
          <div className="absolute top-1/4 left-1/3 text-gray-200 dark:text-gray-800 opacity-40">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="sm:w-4 sm:h-4">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
          <div className="absolute bottom-1/3 right-1/3 text-gray-200 dark:text-gray-800 opacity-30">
            <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" className="sm:w-3 sm:h-3">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
          <div className="absolute top-1/2 right-1/4 text-gray-200 dark:text-gray-800 opacity-35">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="sm:w-3 sm:h-3">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6 sm:mb-8">
            <div className="inline-block p-2 border border-gray-200 dark:border-gray-800 rounded-full mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-3 sm:px-4 py-1">✨ LLM API Management</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-medium text-black dark:text-white mb-6 sm:mb-8 tracking-tight leading-none">
            One API for
            <br />
            <span className="text-gray-400">All LLMs</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Stop juggling multiple API keys. Intelligent routing,
            automatic fallbacks, comprehensive monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-medium">
              <Link to="/register">
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-gray-300 dark:border-gray-700 rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-medium">
              <Link to="/login">Documentation</Link>
            </Button>
          </div>

        </div>
      </section>

      {/* Providers Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-0 bg-gray-50 dark:bg-gray-950 relative">
        {/* Background Doodles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-4 sm:left-20 w-12 sm:w-24 h-12 sm:h-24 border-2 border-gray-300 dark:border-gray-700 rounded-full opacity-20"></div>
          <div className="absolute bottom-1/3 left-1/4 w-10 sm:w-20 h-10 sm:h-20 border-2 border-gray-300 dark:border-gray-700 rounded-lg opacity-30"></div>
          <div className="absolute top-20 right-1/4 text-gray-300 dark:text-gray-700 opacity-40">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="sm:w-5 sm:h-5">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
          <div className="absolute bottom-20 right-1/3 text-gray-300 dark:text-gray-700 opacity-30">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="sm:w-4 sm:h-4">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-8 sm:mb-12 uppercase tracking-wider">
              Unified access to
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-8 mb-12 sm:mb-16">
              {["OpenAI", "Anthropic", "Google AI", "Cohere", "Replicate"].map((provider, index) => (
                <div key={index} className="p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <span className="text-base sm:text-xl font-medium text-black dark:text-white">
                    {provider}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-4 sm:mb-6">
              All your favorite AI providers
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Access every major LLM through one simple, unified interface
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-0 relative">
        {/* Background Doodles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-1/4 left-2 sm:left-10 w-20 sm:w-40 h-20 sm:h-40 border-2 border-gray-200 dark:border-gray-800 rounded-full opacity-20"></div>
          <div className="absolute top-1/3 left-1/4 text-gray-200 dark:text-gray-800 opacity-40">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="sm:w-6 sm:h-6">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
          <div className="absolute top-20 right-1/3 w-8 sm:w-16 h-8 sm:h-16 border-2 border-gray-200 dark:border-gray-800 rounded-lg opacity-30"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl font-medium text-black dark:text-white mb-4 sm:mb-6">
              How it works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light">
              Three simple steps to unified LLM access
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <span className="text-2xl sm:text-3xl font-bold text-white dark:text-black">1</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-black dark:text-white mb-3 sm:mb-4">
                Add Your Keys
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light text-sm sm:text-base">
                Upload API keys from OpenAI, Anthropic, Google, and other providers to your secure vault
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <span className="text-2xl sm:text-3xl font-bold text-white dark:text-black">2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-black dark:text-white mb-3 sm:mb-4">
                Make Requests
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light text-sm sm:text-base">
                Use our unified endpoint to access any LLM. We handle routing, fallbacks, and rate limiting
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <span className="text-2xl sm:text-3xl font-bold text-white dark:text-black">3</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-black dark:text-white mb-3 sm:mb-4">
                Monitor & Scale
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light text-sm sm:text-base">
                Track usage, costs, and performance in real-time. Scale without worrying about limits
              </p>
            </div>
          </div>

          <div className="text-center mt-12 sm:mt-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Ready in under 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-0 bg-gray-50 dark:bg-gray-950 relative">
        {/* Background Doodles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-1/4 w-14 sm:w-28 h-14 sm:h-28 border-2 border-gray-300 dark:border-gray-700 rounded-full opacity-20"></div>
          <div className="absolute bottom-1/4 left-4 sm:left-20 w-12 sm:w-24 h-12 sm:h-24 border-2 border-gray-300 dark:border-gray-700 opacity-30" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute top-1/3 left-1/4 text-gray-300 dark:text-gray-700 opacity-40">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="sm:w-6 sm:h-6">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl font-medium text-black dark:text-white mb-4 sm:mb-6">
              Built for reliability
            </h2>
            <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
              Everything you need for production LLM applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Zap, title: "Smart Rate Limiting", description: "Automatic key switching when limits are reached" },
              { icon: Shield, title: "Auto Fallback", description: "Never face downtime with intelligent provider switching" },
              { icon: Activity, title: "Real-time Logs", description: "Monitor every request with detailed analytics" },
              { icon: BarChart3, title: "Usage Analytics", description: "Comprehensive insights into costs and performance" }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-3xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-black" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-black dark:text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-light text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-0 relative">
        {/* Background Doodles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-20 sm:w-40 h-20 sm:h-40 border-2 border-gray-200 dark:border-gray-800 rounded-full opacity-20"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 sm:w-32 h-16 sm:h-32 border-2 border-gray-200 dark:border-gray-800 opacity-20" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute top-1/3 right-1/3 text-gray-200 dark:text-gray-800 opacity-35">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="sm:w-4 sm:h-4">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl font-medium text-black dark:text-white mb-4 sm:mb-6">
              Trusted by developers
            </h2>
            <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400 font-light">
              Join thousands building the future of AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-16">
            <div className="p-6 sm:p-8">
              <div className="text-5xl sm:text-7xl font-medium text-black dark:text-white mb-2 sm:mb-4">99.9%</div>
              <div className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light">Uptime</div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="text-5xl sm:text-7xl font-medium text-black dark:text-white mb-2 sm:mb-4">&lt;100ms</div>
              <div className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light">Latency</div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="text-5xl sm:text-7xl font-medium text-black dark:text-white mb-2 sm:mb-4">10K+</div>
              <div className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light">Developers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-0 bg-gray-50 dark:bg-gray-950 relative">
        {/* Background Doodles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-4 sm:right-20 w-18 sm:w-36 h-18 sm:h-36 border-2 border-gray-300 dark:border-gray-700 rounded-full opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/4 w-14 sm:w-28 h-14 sm:h-28 border-2 border-gray-300 dark:border-gray-700 rounded-lg opacity-30"></div>
          <div className="absolute top-20 left-1/3 text-gray-300 dark:text-gray-700 opacity-40">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" className="sm:w-7 sm:h-7">
              <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5L8 0z" />
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-medium text-black dark:text-white mb-6 sm:mb-8">
            Start building today
          </h2>
          <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 sm:mb-16 max-w-3xl mx-auto font-light leading-relaxed">
            Free tier includes 10,000 requests per month. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button asChild className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-10 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-medium">
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-gray-300 dark:border-gray-700 rounded-full px-10 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-medium">
              <Link to="/help">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Read Docs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;