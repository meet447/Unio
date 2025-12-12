import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/kibo-ui/button";
import { Badge } from "@/components/kibo-ui/badge";

interface Step {
  number: string;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Sign up & Add Keys",
    description:
      "Create your account and securely vault your existing API keys from OpenAI, Anthropic, Google, and more.",
    color: "bg-[#93c5fd] text-black",
  },
  {
    number: "02",
    title: "Get Unio Token",
    description:
      "Generate a single Unio API token. This gives you instant access to all your connected providers.",
    color: "bg-[#a7f3d0] text-black",
  },
  {
    number: "03",
    title: "Start Building",
    description:
      "Swap your base URL and start coding. Automatic key rotation and failover work instantly.",
    color: "bg-[#fed7aa] text-black",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#030303]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl">
            <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#1a1a1a] px-4 py-1.5 rounded-full font-normal">
              Quick Start
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Up and running in minutes.
            </h2>
            <p className="text-lg sm:text-xl text-[#888] font-light max-w-2xl">
              Unio abstracts the complexity of multiple providers into a single, reliable workflow.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative flex flex-col gap-6 p-8 rounded-3xl border border-[#1d1d1d] bg-[#050505] hover:border-[#333] transition-colors"
              >
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-lg font-bold shadow-[0_0_30px_-10px_rgba(255,255,255,0.2)]`}>
                  {step.number}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-[#888] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call-to-action button */}
          <div className="pt-8">
            <Button asChild size="lg" className="h-12 px-8 bg-white text-black hover:bg-[#e1e1e1] rounded-full font-medium text-base transition-all hover:scale-105">
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;