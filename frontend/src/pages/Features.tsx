import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Key, 
  RotateCcw, 
  BarChart3, 
  Zap, 
  Shield, 
  RefreshCw,
  ArrowRight,
  CheckCircle,
  Gauge,
  Database,
  Globe,
  Lock,
  TrendingUp,
  Server,
  Clock,
  AlertTriangle
} from "lucide-react";

const Features = () => {
  const coreFeatures = [
    {
      icon: <Key className="h-8 w-8 text-blue-600" />,
      title: "Bring Your Own Keys",
      description: "Use your existing API keys across all providers. Secure AES-256 encryption with per-provider organization and usage tracking.",
      benefits: ["Secure storage", "Usage tracking", "Key health monitoring", "Per-provider organization"]
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-green-600" />,
      title: "Automatic Key Rotation",
      description: "Intelligent load balancing and failover with automatic key rotation within providers and smart rate limit handling.",
      benefits: ["Load balancing", "High availability", "Rate limit handling", "Automatic failover"]
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-purple-600" />,
      title: "Smart Fallback System", 
      description: "Automatic provider switching on failures. Never face downtime with intelligent multi-provider redundancy.",
      benefits: ["Provider switching", "Zero downtime", "Multi-provider redundancy", "Intelligent routing"]
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: "OpenAI SDK Compatibility",
      description: "Drop-in replacement for existing OpenAI integrations. Use the same code with any provider through our unified interface.",
      benefits: ["Drop-in replacement", "Unified interface", "Easy migration", "Standard SDK support"]
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-red-600" />,
      title: "Advanced Analytics",
      description: "Track usage, costs, and performance across providers with real-time metrics and comprehensive insights.",
      benefits: ["Real-time metrics", "Cost tracking", "Performance analytics", "Error monitoring"]
    },
    {
      icon: <Database className="h-8 w-8 text-teal-600" />,
      title: "Semantic Caching",
      description: "Coming soon: Reduce costs with intelligent caching that understands context and meaning.",
      benefits: ["Cost reduction", "Intelligent caching", "Context awareness", "Performance boost"],
      comingSoon: true
    }
  ];

  const providers = [
    { name: "OpenAI", models: "GPT-4, GPT-3.5", streaming: true, functions: true },
    { name: "Anthropic", models: "Claude 3.5, Claude 3", streaming: true, functions: true },
    { name: "Google", models: "Gemini Pro, Flash", streaming: true, functions: true },
    { name: "Groq", models: "Llama 3, Mixtral", streaming: true, functions: false },
    { name: "Together", models: "Llama 3, Qwen", streaming: true, functions: false },
    { name: "OpenRouter", models: "100+ models", streaming: true, functions: true }
  ];

  const analyticsFeatures = [
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      title: "Real-time Usage Metrics",
      description: "Monitor API calls, tokens, and costs as they happen"
    },
    {
      icon: <Gauge className="h-6 w-6 text-green-600" />,
      title: "Performance Analytics", 
      description: "Track response times, success rates, and error patterns"
    },
    {
      icon: <Server className="h-6 w-6 text-purple-600" />,
      title: "Provider Insights",
      description: "Compare performance and costs across different AI providers"
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      title: "Historical Data",
      description: "Analyze trends and patterns over time for optimization"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Everything you need for
            <br />
            <span className="text-blue-600">AI integration</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Unio provides a complete platform for managing multiple AI providers with intelligent 
            routing, comprehensive analytics, and enterprise-grade security.
          </p>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-md"
          >
            <Link to="/register" className="flex items-center gap-2">
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600">
              Built for developers who need reliable, scalable AI infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 relative">
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                    Coming Soon
                  </div>
                )}
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Providers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Supported Providers
            </h2>
            <p className="text-xl text-gray-600">
              Connect to all major AI providers through one unified interface
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Models</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Streaming</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Function Calling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {providers.map((provider, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{provider.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{provider.models}</td>
                    <td className="px-6 py-4 text-center">
                      {provider.streaming ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {provider.functions ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Analytics Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Advanced Analytics
            </h2>
            <p className="text-xl text-gray-600">
              Get insights into your AI usage with comprehensive analytics and monitoring
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Reliability */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Security & Reliability
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Enterprise-grade security with comprehensive error handling and monitoring.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">AES-256 Encryption</h3>
                    <p className="text-gray-600 text-sm">All API keys stored with military-grade encryption</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Error Handling</h3>
                    <p className="text-gray-600 text-sm">Comprehensive error handling with automatic recovery</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">High Availability</h3>
                    <p className="text-gray-600 text-sm">99.9% uptime with automatic failover systems</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Reliability Stats</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-semibold text-gray-900">99.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "99.9%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-semibold text-gray-900">&lt;100ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm font-semibold text-gray-900">99.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "99.5%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to unify your AI stack?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of developers building with Unio's unified AI platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-medium rounded-md"
            >
              <Link to="/register" className="flex items-center gap-2">
                Start building free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-medium rounded-md"
            >
              <Link to="/docs">View documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;