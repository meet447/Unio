import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/kibo-ui/card";
import { Button } from "@/components/kibo-ui/button";
import { Badge } from "@/components/kibo-ui/badge";
import { Link } from "react-router-dom";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "1",
    title: "Sign up & Add API Keys",
    description:
      "Create your Unio account and securely store your existing API keys from OpenAI, Anthropic, Google, Groq, Together, and OpenRouter.",
  },
  {
    number: "2",
    title: "Get Your Unio Token",
    description:
      "Generate your Unio API token. This single token gives you access to all your providers through one unified endpoint.",
  },
  {
    number: "3",
    title: "Start Building",
    description:
      "Use the OpenAI SDK with your Unio token. Automatic key rotation, failover, and analytics work behind the scenes.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#030303] border-y border-[#1b1b1b]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 max-w-2xl">
            <Badge variant="secondary" className="bg-[#0a0a0a] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#0f0f0f]">
              Quick Start
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.2] font-bold tracking-tight text-white">
              Get up and running in minutes
            </h2>
            <p className="text-lg sm:text-xl text-[#9c9c9c] leading-relaxed">
              Unio makes it incredibly easy to unify all your AI providers.
              Start using the power of multiple LLMs through one simple, OpenAI-compatible API.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="bg-[#0a0a0a] border-[#1d1d1d] hover:border-[#2a2a2a] transition-colors"
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <CardTitle className="text-white text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#9c9c9c] leading-relaxed text-center">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call-to-action button */}
          <div className="mt-8">
            <Button asChild size="lg" className="bg-white text-black hover:bg-[#e1e1e1]">
              <Link to="/register">Get started for free</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;