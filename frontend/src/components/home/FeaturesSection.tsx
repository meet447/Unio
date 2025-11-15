import React from "react";
import {
  ArrowRight,
  Key,
  RotateCcw,
  BarChart3,
  Plug,
  Zap,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/kibo-ui/card";
import { Button } from "@/components/kibo-ui/button";
import { Badge } from "@/components/kibo-ui/badge";
import { Link } from "react-router-dom";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  alt: string;
}

const FeaturesSection: Feature[] = [
  {
    title: "Bring Your Own Keys",
    description:
      "Use your existing API keys across all providers. Secure storage with AES-256 encryption and intelligent key organization.",
    icon: Key,
    alt: "API key management feature",
  },
  {
    title: "Automatic Key Rotation",
    description:
      "Intelligent load balancing and failover across your API keys. Never worry about rate limits or key failures again.",
    icon: RotateCcw,
    alt: "Automatic key rotation feature",
  },
  {
    title: "Advanced Analytics",
    description:
      "Track usage, costs, and performance across all providers. Real-time metrics and comprehensive logging for insights.",
    icon: BarChart3,
    alt: "Advanced analytics feature",
  },
  {
    title: "OpenAI SDK Compatible",
    description:
      "Drop-in replacement for existing OpenAI integrations. No code changes needed - just update your base URL and API key.",
    icon: Plug,
    alt: "OpenAI SDK compatibility feature",
  },
  {
    title: "Smart Fallback System",
    description:
      "Automatic provider switching on failures. Configure fallback chains to ensure your applications never go down.",
    icon: Zap,
    alt: "Smart fallback system feature",
  },
  {
    title: "Semantic Caching",
    description:
      "Coming soon: Reduce costs with intelligent response caching. Save money by avoiding duplicate requests across providers.",
    icon: Database,
    alt: "Semantic caching feature",
  },
];

interface FeatureCardProps extends Feature {}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
}) => (
  <Card className="bg-[#0a0a0a] border-[#1d1d1d] hover:border-[#2a2a2a] transition-colors h-full">
    <CardHeader>
      <div className="w-12 h-12 rounded-lg bg-[#0f0f0f] border border-[#1c1c1c] flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <CardTitle className="text-white text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-[#9c9c9c] leading-relaxed">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

const FeaturesOverview: React.FC = () => {
  return (
    <section className="py-20 bg-[#030303] border-y border-[#1b1b1b]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col items-start text-left gap-4 max-w-3xl">
            <Badge variant="secondary" className="bg-[#0a0a0a] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#0f0f0f]">
              AI Gateway
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.2] font-bold tracking-tight text-white">
              A complete AI gateway solution with all the features you need.
            </h2>
            <p className="text-lg sm:text-xl text-[#9c9c9c] leading-relaxed">
              Unio is packed with powerful features that enable you to seamlessly
              manage multiple LLM providers through a single, unified interface.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FeaturesSection.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Call-to-action */}
          <div className="flex justify-center mt-4">
            <Button asChild variant="outline" className="border-[#1f1f1f] text-white hover:bg-[#0a0a0a]">
              <Link to="/features" className="inline-flex items-center gap-2">
                Explore more features
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;