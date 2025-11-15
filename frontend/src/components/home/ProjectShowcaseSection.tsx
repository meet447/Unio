import React from 'react';
import { Globe, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/kibo-ui/card';
import { Badge } from '@/components/kibo-ui/badge';

const ProjectShowcaseSection = () => {
  const projects = [
    {
      icon: Globe,
      name: "Axiom",
      description: "An open-source AI search engine like Perplexity AI, powered by multiple LLM providers through Unio.",
      url: "https://axiom-ivory.vercel.app/",
    },
    {
      icon: TrendingUp,
      name: "Chipling",
      description: "An open-source AI rabbithole research tool that helps users dive deep into topics using AI.",
      url: "https://chipling.xyz",
    }
  ];

  return (
    <section className="py-24 bg-[#030303] border-y border-[#1b1b1b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Projects powered by Unio
          </h2>
          <p className="text-lg sm:text-xl text-[#9c9c9c] max-w-2xl mx-auto">
            See what developers are building with our unified AI platform
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project) => {
            const IconComponent = project.icon;
            return (
              <a
                key={project.name}
                href={project.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block"
              >
                <Card className="bg-[#0a0a0a] border-[#1d1d1d] hover:border-[#2a2a2a] transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-[#0f0f0f] border border-[#1c1c1c] flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                          <IconComponent className="h-7 w-7 text-white group-hover:text-black transition-colors duration-300" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <CardTitle className="text-white group-hover:text-[#9c9c9c] transition-colors">
                            {project.name}
                          </CardTitle>
                          <ArrowUpRight className="h-5 w-5 text-[#7d7d7d] group-hover:text-white transition-colors flex-shrink-0 mt-1" />
                        </div>
                        <CardDescription className="text-[#9c9c9c] leading-relaxed mb-4">
                          {project.description}
                        </CardDescription>
                        <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1c1c1c] text-[#9c9c9c] hover:bg-[#141414]">
                          <span>Visit project</span>
                          <ArrowUpRight className="h-3 w-3 ml-2" />
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcaseSection;
