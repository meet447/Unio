import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    
    <div
      className="flex flex-col items-center gap-6 rounded-lg bg-muted py-20 px-6 text-center bg-cover bg-center"
      style={{
        backgroundColor: "#f7f7f7",
      }}
    >
      <h2 className="text-[32px] font-bold text-foreground leading-[1.3]">
        Are you ready to unify your llms?
      </h2>
      <a
        href="/register"
        data-umami-event="get-started-banner-button"
        className="inline-flex h-auto items-center justify-center rounded-md bg-primary py-3 px-6 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Get Started
      </a>
    </div>
  );
};

export default CTASection;