import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/kibo-ui/button';
import { Badge } from '@/components/kibo-ui/badge';

const HeroSection = () => {
  return (
    <div className="bg-[#030303] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a] border border-[#1b1b1b] rounded-[3rem] shadow-2xl">
        {/* Background Textures & Pastels */}
        <div className="absolute inset-0 bg-[#0a0a0a]">
          {/* Pastel Orbs - Increased opacity for brightness */}
          <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#93c5fd]/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#fed7aa]/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a7f3d0]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-[#93c5fd]/20 border-[#93c5fd]/30 text-[#93c5fd] hover:bg-[#93c5fd]/30 px-4 py-1.5 text-sm font-medium rounded-full transition-colors backdrop-blur-sm shadow-md">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Universal AI Gateway
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[1.1]">
              One API.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#bbf2f7] to-white">Every Model.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#b0b0b0] leading-relaxed max-w-2xl mx-auto font-light">
              Unify all your AI providers through a single, OpenAI-compatible API.
              Bring your own keys, we handle the complexity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
              <Button asChild size="lg" className="h-12 px-8 bg-white text-black hover:bg-[#f0f0f0] rounded-full font-semibold text-base transition-all hover:scale-105 border-0 shadow-lg">
                <Link to="/register" className="inline-flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 bg-black/50 text-white border-[#333] hover:bg-[#151515] hover:text-white rounded-full font-semibold text-base transition-all hover:scale-105 backdrop-blur-sm">
                <Link to="/docs" className="inline-flex items-center gap-2">
                  Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
