import React from 'react';
import { TrendingUp, Zap, Users, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/kibo-ui/card';

const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: '10M+',
      label: 'API Requests',
      description: 'Processed daily',
    },
    {
      icon: Zap,
      value: '<100ms',
      label: 'Average Latency',
      description: 'Global edge network',
    },
    {
      icon: Users,
      value: '10K+',
      label: 'Active Developers',
      description: 'Building with Unio',
    },
    {
      icon: Globe,
      value: '99.9%',
      label: 'Uptime SLA',
      description: 'Enterprise reliability',
    },
  ];

  return (
    <section className="py-24 bg-[#030303] border-y border-[#1b1b1b]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Trusted by developers worldwide
          </h2>
          <p className="text-xl text-[#9c9c9c] max-w-2xl mx-auto">
            Join thousands of teams building the next generation of AI applications
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="bg-[#0a0a0a] border-[#1d1d1d] hover:border-[#2a2a2a] transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="inline-flex p-3 rounded-lg bg-[#0f0f0f] border border-[#1c1c1c] mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-[#7d7d7d]">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
