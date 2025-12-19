import { Zap } from "lucide-react";

const providers = [
    "OpenAI",
    "Anthropic",
    "Google Gemini",
    "Mistral AI",
    "Groq",
    "Perplexity",
    "Together AI",
    "Cohere",
    "DeepMind",
    "Meta Llama"
];

const ProviderLogoMarquee = () => {
    return (
        <section className="w-full py-12 border-y border-[#1b1b1b] bg-[#050505]/50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                <p className="text-sm font-medium text-[#666] uppercase tracking-[0.2em]">
                    Trusted by developers building with
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-12 sm:gap-24 px-12 sm:px-24">
                    {/* First set of logos */}
                    {providers.map((provider, index) => (
                        <div
                            key={`p1-${index}`}
                            className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-[#444] hover:text-white transition-colors duration-300"
                        >
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 opacity-50" />
                            <span>{provider}</span>
                        </div>
                    ))}

                    {/* Duplicate set for seamless scrolling */}
                    {providers.map((provider, index) => (
                        <div
                            key={`p2-${index}`}
                            className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-[#444] hover:text-white transition-colors duration-300"
                        >
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 opacity-50" />
                            <span>{provider}</span>
                        </div>
                    ))}
                </div>

                {/* Gradient fades for smooth edges */}
                <div className="absolute top-0 left-0 w-24 sm:w-40 h-full bg-gradient-to-r from-[#030303] to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-24 sm:w-40 h-full bg-gradient-to-l from-[#030303] to-transparent z-10"></div>
            </div>
        </section>
    );
};

export default ProviderLogoMarquee;
