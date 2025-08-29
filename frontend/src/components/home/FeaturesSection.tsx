// FeaturesOverview.tsx
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
  <div className="flex flex-col gap-4">
    <div className="overflow-hidden rounded-lg border border-border shadow-card p-8 bg-white">
      <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
        <Icon className="h-12 w-12 text-primary" />
      </div>
    </div>
    <div className="flex flex-col gap-2 pt-2">
      <h3 className="text-xl font-semibold text-text-dark-gray">{title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const FeaturesOverview: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col items-start text-left gap-4 max-w-3xl">
            <span className="text-sm font-semibold uppercase text-primary tracking-wider">
              AI Gateway
            </span>
            <h2 className="text-[2.5rem] leading-[1.2] font-bold tracking-tighter text-text-primary">
              A complete AI gateway solution with all the features you need.
            </h2>
            <p className="text-xl text-muted-foreground">
              Unio is packed with powerful features that enable you to seamlessly
              manage multiple LLM providers through a single, unified interface.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {FeaturesSection.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Call-to-action */}
          <div className="flex justify-center mt-4">
            <a
              href="/features"
              className="inline-flex items-center gap-2 text-base font-medium text-text-primary hover:text-primary transition-colors duration-200"
            >
              Explore more features
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;