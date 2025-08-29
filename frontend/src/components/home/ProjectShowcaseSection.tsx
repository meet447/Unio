import React from 'react';
import { Globe, TrendingUp } from 'lucide-react';

const ProjectShowcaseSection = () => {
  const projects = [
    {
      icon: Globe,
      name: "Axiom",
      description: "An open-source AI search engine like Perplexity AI, powered by multiple LLM providers through Unio.",
      url: "https://axiom-ivory.vercel.app/",
      iconColor: "text-black",
      bgColor: "bg-gray-100"
    },
    {
      icon: TrendingUp,
      name: "Chipling",
      description: "An open-source AI rabbithole research tool that helps users dive deep into topics using AI.",
      url: "https://chipling.xyz",
      iconColor: "text-black",
      bgColor: "bg-gray-100"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Projects powered by Unio
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">
            See what developers are building with our unified AI platform
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project) => {
            const IconComponent = project.icon;
            return (
              <div key={project.name} className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${project.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${project.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3">
                      {project.description}
                    </p>
                    <a 
                      href={project.url}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-700 text-sm font-medium"
                    >
                      Visit {project.name} →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcaseSection;