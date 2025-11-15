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
    <div className="bg-[#030303]">
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