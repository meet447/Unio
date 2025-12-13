import {
  HeroSection,
  ProviderLogoMarquee,
  FeaturesSection,
  HowItWorksSection,
  CodeExampleSection,
  StatsSection,
  ProjectShowcaseSection,
  CTASection,
  FAQSection,
  TestimonialsSection
} from "@/components/home";

const Home = () => {
  return (
    <div className="bg-[#030303]">
      <HeroSection />
      <ProviderLogoMarquee />
      <FeaturesSection />
      <HowItWorksSection />
      <CodeExampleSection />
      <StatsSection />
      <ProjectShowcaseSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Home;