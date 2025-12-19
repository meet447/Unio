import React from 'react';
import { TrendingUp, Zap, Users, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: '10M+',
      label: 'Requests',
      description: 'Processed daily',
      color: 'text-[#93c5fd]',
    },
    {
      icon: Zap,
      value: '<100ms',
      label: 'Latency',
      description: 'Edge network overhead',
      color: 'text-[#a7f3d0]',
    },
    {
      icon: Users,
      value: '10K+',
      label: 'Developers',
      description: 'Building with Unio',
      color: 'text-[#fed7aa]',
    },
    {
      icon: Globe,
      value: '99.99%',
      label: 'Uptime',
      description: 'Enterprise SLA',
      color: 'text-[#e9d5ff]',
    },
  ];

  return (
    <section className="py-24 bg-[#030303] border-b border-[#1b1b1b]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div className={`mb-6 p-4 rounded-2xl bg-[#0a0a0a] border border-[#1d1d1d] group-hover:border-[#333] transition-colors`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-lg font-medium text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-[#888]">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
