import React from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/kibo-ui/button';
import { Card, CardContent } from '@/components/kibo-ui/card';
import { Badge } from '@/components/kibo-ui/badge';

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-[#030303] border-t border-[#1b1b1b]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#050505] to-[#030303]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#0a0a0a] border-[#1d1d1d] shadow-2xl">
            <CardContent className="p-8 sm:p-12 text-center">
              <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1c1c1c] text-[#9c9c9c] hover:bg-[#141414] mb-6">
                <Sparkles className="h-3 w-3 mr-2" />
                Ready to get started?
              </Badge>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Start building with
                <br />
                <span className="text-[#9c9c9c]">
                  Unio today
                </span>
              </h2>

              <p className="text-lg sm:text-xl text-[#9c9c9c] mb-10 max-w-2xl mx-auto leading-relaxed">
                Unify all your AI providers through one API. Bring your own keys, get automatic failover, 
                intelligent routing, and comprehensive analytics. Get started in minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
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

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#7d7d7d] pt-6 border-t border-[#1c1c1c]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#82f2a6]" />
                  <span>No credit card required</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#1c1c1c]" />
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#82f2a6]" />
                  <span>Free tier available</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#1c1c1c]" />
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#82f2a6]" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
