import React from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/kibo-ui/button';
import { Badge } from '@/components/kibo-ui/badge';

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-[#030303] border-t border-[#1b1b1b]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-[#111] via-[#030303] to-[#030303]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#141414] mb-8 px-4 py-1.5 rounded-full font-normal">
            <Sparkles className="h-3.5 w-3.5 mr-2 text-[#e2e2e2]" />
            Ready to scale?
          </Badge>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
            Start building with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-[#666]">
              Unio today.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[#888] mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Join thousands of developers unifying their AI infrastructure. 
            Bring your keys, we handle the rest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="h-12 px-8 bg-white text-black hover:bg-[#e1e1e1] rounded-full font-medium text-base transition-all hover:scale-105">
              <Link to="/register" className="inline-flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 border-[#1f1f1f] bg-transparent text-white hover:bg-[#0a0a0a] rounded-full font-medium text-base hover:border-[#333]">
              <Link to="/playground" className="inline-flex items-center gap-2">
                Try Playground
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-[#666]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#a7f3d0]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#a7f3d0]" />
              <span>Free tier available</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#a7f3d0]" />
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
