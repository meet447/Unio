import React from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/kibo-ui/button';
import { Badge } from '@/components/kibo-ui/badge';

const CTASection = () => {
  return (
    <div className="bg-[#030303] px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8 border-t border-[#1b1b1b]">
      <section className="relative py-24 sm:py-32 overflow-hidden bg-[#0a0a0a] border border-[#1b1b1b] rounded-[3rem] shadow-2xl">
        {/* Background Textures & Pastels */}
        <div className="absolute inset-0 bg-[#0a0a0a]">
          {/* Pastel Orbs - Different from Hero */}
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#c4b5fd]/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
          <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[#fca5a5]/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6ee7b7]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="bg-[#c4b5fd]/20 border-[#c4b5fd]/30 text-[#c4b5fd] hover:bg-[#c4b5fd]/30 px-4 py-1.5 rounded-full font-medium mb-8 backdrop-blur-sm shadow-md">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Ready to scale?
            </Badge>

            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
              Start building with
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e9d5ff] to-white">
                Unio today.
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-[#b0b0b0] mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Join thousands of developers unifying their AI infrastructure.
              Bring your keys, we handle the rest.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button asChild size="lg" className="h-12 px-8 bg-white text-black hover:bg-[#f0f0f0] rounded-full font-semibold text-base transition-all hover:scale-105 border-0 shadow-lg">
                <Link to="/register" className="inline-flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-[#888]">
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
    </div>
  );
};

export default CTASection;
