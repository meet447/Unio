import React from 'react';
import { Globe, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/kibo-ui/badge';

const ProjectShowcaseSection = () => {
  const projects = [
    {
      icon: Globe,
      name: "Axiom",
      description: "An open-source AI search engine like Perplexity AI, powered by multiple LLM providers through Unio.",
      url: "https://axiom-ivory.vercel.app/",
      color: "bg-[#93c5fd]",
    },
    {
      icon: TrendingUp,
      name: "Chipling",
      description: "An open-source AI rabbithole research tool that helps users dive deep into topics using AI.",
      url: "https://chipling.xyz",
      color: "bg-[#a7f3d0]",
    }
  ];

  return (
    <section className="py-24 bg-[#030303] border-b border-[#1b1b1b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#1a1a1a] px-4 py-1.5 rounded-full font-normal">
            Showcase
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Built with Unio.
          </h2>
          <p className="text-lg sm:text-xl text-[#888] max-w-2xl mx-auto font-light">
            See what developers are creating with our unified platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {projects.map((project) => {
            const IconComponent = project.icon;
            return (
              <a
                key={project.name}
                href={project.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block p-8 rounded-3xl bg-[#0a0a0a] border border-[#1d1d1d] hover:border-[#333] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${project.color} flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-black" />
                  </div>
                  <div className="p-2 rounded-full bg-[#111] text-[#666] group-hover:bg-white group-hover:text-black transition-colors">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#ccc] transition-colors">
                  {project.name}
                </h3>
                <p className="text-[#888] leading-relaxed text-lg">
                  {project.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcaseSection;
