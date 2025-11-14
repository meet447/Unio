import {
  HeroSection,
  HowItWorksSection,
  CodeExampleSection,
  FeaturesSection,
  StatsSection,
  ProjectShowcaseSection,
  CTASection
} from "@/components/home";

const Home = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <HowItWorksSection />
      <CodeExampleSection />
      <FeaturesSection />
      <StatsSection />
      <ProjectShowcaseSection />
      <CTASection />
    </div>
  );
};

export default Home;