import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-background pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-text-primary md:text-7xl md:leading-[1.1]">
            The modern API platform
            <br />
            for effortless LLM access.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
            Unio makes it easy to connect, manage, and scale your AI integrations — so you can focus on{" "}
            <strong className="font-semibold text-gray-800">building</strong>
          </p>
          <div className="mt-8 flex flex-row justify-center gap-4">
            <a
              href="/dashboard"
              className="inline-flex h-auto items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Get started
            </a>
            <a
              href="/docs"
              className="inline-flex h-auto items-center justify-center rounded-md bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View docs
            </a>
          </div>

          <div className="mt-16 w-full [perspective:2000px]">
            <img
              src="/dashboard.png"
              alt="Unio Analytics Dashboard Screenshot"
              width={900}
              height={556}
              className="mx-auto w-full max-w-[900px] rounded-lg shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] [transform:rotateX(15deg)_rotateZ(-3deg)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;