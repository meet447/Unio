import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/kibo-ui/button';
import { Card, CardContent } from '@/components/kibo-ui/card';
import { Badge } from '@/components/kibo-ui/badge';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#030303] border-b border-[#1b1b1b]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#050505] to-[#030303]" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Headline */}
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-[#0a0a0a] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#0f0f0f]">
                <Sparkles className="w-3 h-3 mr-2" />
                Universal AI Gateway
              </Badge>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1]">
                One API.
                <br />
                <span className="text-[#9c9c9c]">Every Model.</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#9c9c9c] leading-relaxed max-w-xl">
                Unify all your AI providers through a single, OpenAI-compatible API. Bring your own keys, we handle the complexity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-white text-black hover:bg-[#e1e1e1]">
                  <Link to="/register" className="inline-flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-[#1f1f1f] text-white hover:bg-[#0a0a0a]">
                  <Link to="/playground" className="inline-flex items-center gap-2">
                    Try Playground
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Feature Card */}
            <div className="hidden lg:block">
              <Card className="bg-[#0a0a0a] border-[#1d1d1d] shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#7d7d7d] uppercase tracking-wider">Supported Providers</span>
                      <Badge variant="secondary" className="bg-[#132315] text-[#82f2a6] border-0">10+</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['OpenAI', 'Anthropic', 'Google', 'Groq', 'Together', 'More'].map((provider, i) => (
                        <div key={i} className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-lg p-3 text-center">
                          <span className="text-sm text-white font-medium">{provider}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#1c1c1c]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#7d7d7d]">OpenAI Compatible</span>
                      <span className="text-white font-semibold">✓</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-[#7d7d7d]">Zero Code Changes</span>
                      <span className="text-white font-semibold">✓</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-[#7d7d7d]">Automatic Failover</span>
                      <span className="text-white font-semibold">✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
