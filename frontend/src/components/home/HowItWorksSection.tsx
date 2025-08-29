import React from "react";


interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "1",
    title: "Sign up",
    description:
      "Create your Unio account and get access to the unified AI gateway dashboard.",
  },
  {
    number: "2",
    title: "Add your API keys",
    description:
      "Securely store your existing API keys from OpenAI, Anthropic, Google, Groq, and other providers.",
  },
  {
    number: "3",
    title: "Get your Unio token",
    description:
      "Generate your Unio API token and start making requests through our unified endpoint.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-12">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 max-w-2xl">
            <span className="text-sm font-semibold uppercase text-primary tracking-wider">
              Quick Start
            </span>
            <h2 className="text-[2.5rem] leading-[1.2] font-bold tracking-tighter text-text-primary">
              Get up and running in minutes
            </h2>
            <p className="text-xl text-muted-foreground">
              Unio makes it incredibly easy to unify all your AI providers.
              Start using the power of multiple LLMs through one simple API.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                  {step.number}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call-to-action button */}
          <div className="mt-8">
            <a
              href="/register"
              className="inline-flex h-auto items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Get started for free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;