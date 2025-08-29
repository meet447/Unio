import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Gauge, CheckCircle, Users, TrendingUp, Code, Globe } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight leading-tight">
            The modern API platform
            <br className="hidden sm:block" />
            <span className="text-gray-500">for effortless LLM access.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Unio makes it easy to connect, manage, and scale your AI integrations — so you can focus on{" "}
            <span className="text-gray-900 font-semibold">building</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-md touch-manipulation min-h-[48px]"
            >
              <Link to="/register" className="flex items-center justify-center gap-2">
                Get started
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-gray-300 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-md touch-manipulation min-h-[48px]"
            >
              <Link to="/docs">View docs</Link>
            </Button>
          </div>
          
          {/* Hero Visual */}
          <div className="relative mt-8 sm:mt-12 lg:mt-16">
            <div className="bg-gray-50 rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 mx-auto max-w-5xl border border-gray-200">
              <div className="bg-white rounded-md sm:rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-mono truncate px-2">unio.dev/dashboard</div>
                  <div className="w-8 sm:w-20"></div>
                </div>
                
                {/* Dashboard Screenshot */}
                <div className="relative">
                  <img 
                    src="/dashboard.png" 
                    alt="Unio Dashboard - API Analytics and Management" 
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  {/* Optional overlay for better presentation */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How it works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Three simple steps to unified LLM access
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-lg sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Add Your Keys
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Upload API keys from OpenAI, Anthropic, Google, and other providers to your secure vault
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-lg sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Make Requests
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Use our unified endpoint to access any LLM. We handle routing, fallbacks, and rate limiting
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-lg sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Monitor & Scale
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Track usage, costs, and performance in real-time. Scale without worrying about limits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Drop-in replacement for OpenAI
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Use your existing code with any provider. Just change the base URL.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-400">Python</span>
              </div>
            </div>
            <pre className="text-xs sm:text-sm text-gray-300 overflow-x-auto">
              <code>{`from openai import OpenAI

# Use Unio as a drop-in replacement
client = OpenAI(
    api_key="your-unio-token",
    base_url="https://unio.onrender.com/v1/api"
)

response = client.chat.completions.create(
    model="anthropic:claude-3-5-sonnet",
    messages=[
        {"role": "user", "content": "Hello from Unio!"}
    ]
)

print(response.choices[0].message.content)`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              A complete API solution with all the features you need.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Unio is packed with amazing features that enable you to better understand your AI usage.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Feature 1 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Bring Your Own Keys
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Use your existing API keys across all providers. Secure AES-256 encryption with usage tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Automatic Key Rotation
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Intelligent load balancing and failover with automatic key rotation and rate limit handling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Smart Fallback System
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Automatic provider switching on failures. Never face downtime with intelligent redundancy.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Gauge className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                OpenAI SDK Compatible
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Drop-in replacement for existing OpenAI integrations. Use the same code with any provider.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Track usage, costs, and performance across providers with real-time metrics and insights.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Semantic Caching
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Coming soon: Reduce costs with intelligent caching that understands context and meaning.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              asChild
              variant="outline" 
              className="border-gray-300 px-6 py-2 text-gray-700 touch-manipulation min-h-[44px]"
            >
              <Link to="/features">Explore all features →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Trusted by developers worldwide
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Join thousands building the future of AI with reliable infrastructure
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-base sm:text-lg text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">&lt;100ms</div>
              <div className="text-base sm:text-lg text-gray-600">Latency</div>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-base sm:text-lg text-gray-600">Developers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Projects powered by Unio
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              See what developers are building with our unified AI platform
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Axiom
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    An open-source AI search engine like Perplexity AI, powered by multiple LLM providers through Unio.
                  </p>
                  <a 
                    href="https://axiom-ivory.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Visit Axiom →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Chipling
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    An open-source AI rabbithole research tool that helps users dive deep into topics using AI.
                  </p>
                  <a 
                    href="https://chipling.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Visit Chipling →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to get started?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 sm:mb-12">
            Join thousands of developers already using Unio to power their AI applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              asChild
              className="bg-white text-blue-600 hover:bg-gray-50 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-md touch-manipulation min-h-[48px]"
            >
              <Link to="/register" className="flex items-center justify-center gap-2">
                Get started for free
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-md touch-manipulation min-h-[48px]"
            >
              <Link to="/docs">View documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;