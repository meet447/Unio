import React from "react";
import {
  ArrowRight,
  Key,
  RotateCcw,
  BarChart3,
  Plug,
  Zap,
  Database,
  ShieldCheck,
  Activity,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/kibo-ui/button";
import { Badge } from "@/components/kibo-ui/badge";

const FeaturesOverview: React.FC = () => {
  return (
    <section className="py-24 bg-[#030303] border-y border-[#1b1b1b]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#1a1a1a] px-4 py-1.5 rounded-full font-normal">
              Power Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Everything you need to scale.
            </h2>
            <p className="text-lg sm:text-xl text-[#888] font-light max-w-2xl">
              Powerful tools designed to give you complete control over your LLM infrastructure.
            </p>
          </div>

          {/* Bento Grid Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            
            {/* Feature 1: Smart Fallback (Large, Pastel Blue) */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-[#93c5fd] text-black flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Smart Model Fallback</h3>
                <p className="text-lg text-black/80 font-medium max-w-md">
                  Ensure 99.99% uptime with automatic provider switching. Configure fallback chains that trigger instantly on failures or rate limits.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-center">
                 {/* Decorative mock UI element */}
                 <div className="w-full h-32 bg-white/30 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Activity className="h-12 w-12 text-black/50" />
                 </div>
              </div>
            </div>

            {/* Feature 2: Analytics (Standard, Pastel Mint) */}
            <div className="rounded-3xl p-8 bg-[#a7f3d0] text-black flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300">
               <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Built-in Analytics</h3>
                <p className="text-base text-black/80 font-medium">
                   Track usage, costs, and latency in real-time. Gain deep insights into your AI traffic.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <BarChart3 className="h-24 w-24 text-black/10 -mb-4 -mr-4" />
              </div>
            </div>

            {/* Feature 3: BYOK (Standard, Pastel Purple) */}
            <div className="rounded-3xl p-8 bg-[#e9d5ff] text-black flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                  <Key className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Bring Your Own Keys</h3>
                <p className="text-sm text-black/80 leading-relaxed">
                  Your keys, your control. We securely encrypt and store your credentials.
                </p>
              </div>
            </div>

            {/* Feature 4: OpenAI Compatible (Standard, Pastel Blue) */}
            <div className="rounded-3xl p-8 bg-[#c7d2fe] text-black flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                  <Plug className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Drop-in Compatible</h3>
                <p className="text-sm text-black/80 leading-relaxed">
                  Works with the OpenAI SDK. Just change two lines of code to switch.
                </p>
              </div>
            </div>

            {/* Feature 5: Key Rotation (Standard, Pastel Peach) */}
             <div className="rounded-3xl p-8 bg-[#fed7aa] text-black flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300">
               <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                  <RotateCcw className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Automatic Key Rotation</h3>
                <p className="text-sm text-black/80 leading-relaxed">
                  Distribute load intelligently across multiple keys to bypass rate limits.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;