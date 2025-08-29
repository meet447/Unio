import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      value: "99.9%",
      label: "Uptime"
    },
    {
      value: "<100ms",
      label: "Latency"
    },
    {
      value: "10K+",
      label: "Developers"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Trusted by developers worldwide
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">
            Join thousands building the future of AI with reliable infrastructure
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-base sm:text-lg text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;