import { Badge } from "@/components/kibo-ui/badge";
import { Button } from "@/components/kibo-ui/button";
import { Clock3, Shield, Wallet } from "lucide-react";

const Billing = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white p-6 lg:p-10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <Badge variant="secondary" className="bg-[#101010] text-[#f5f5f5] border-0 tracking-wide">
            Billing & Usage
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight">
            Unified billing arrives soon
          </h1>
          <p className="text-[#9d9d9d] text-lg max-w-3xl mx-auto">
            We’re launching detailed usage-based billing with per-provider cost tracking, spending caps,
            and automated alerts. Until then, continue using your own provider billing while Unio handles routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: Wallet,
              title: "Per-provider visibility",
              body: "Track spend and requests across every upstream vendor in real time.",
            },
            {
              icon: Shield,
              title: "Safe-guards & alerts",
              body: "Set limits, receive anomaly alerts, and export detailed CSV breakdowns.",
            },
            {
              icon: Clock3,
              title: "Predictive forecasting",
              body: "Projected costs based on rolling 7-day usage with seasonal adjustments.",
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 space-y-3">
              <feature.icon className="w-6 h-6 text-[#b7b7b7]" />
              <h3 className="text-xl font-medium">{feature.title}</h3>
              <p className="text-sm text-[#9d9d9d]">{feature.body}</p>
            </div>
          ))}
        </div>

        <div className="border border-[#1a1a1a] bg-[#050505] rounded-3xl p-8 space-y-4">
          <h2 className="text-2xl font-semibold">Want early access?</h2>
          <p className="text-[#b0b0b0]">
            We’re onboarding teams to the new billing experience. Join the waitlist and we’ll migrate your
            workspace with priority support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-white text-black hover:bg-[#efefef]">
              Join waitlist
            </Button>
            <Button variant="outline" className="border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#0f0f0f]">
              View roadmap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;

