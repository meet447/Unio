import {
    Terminal,
    Shield,
    Zap,
    BarChart3,
    Globe2,
    Key,
    Database
} from "lucide-react";
import { Badge } from "@/components/kibo-ui/badge";

const FeaturesSection = () => {
    const features = [
        {
            title: "Knowledge Vaults (RAG)",
            description: "Upload documents and chat with your data. Automated embeddings, vector storage, and context retrieval.",
            icon: Database,
            className: "md:col-span-3",
            color: "bg-[#c4b5fd] text-black"
        },
        {
            title: "Unified Interface",
            description: "One API format for OpenAI, Anthropic, Gemini, and more. Switch providers with a single config change.",
            icon: Terminal,
            className: "md:col-span-2",
            color: "bg-[#93c5fd] text-black"
        },
        {
            title: "Smart Caching",
            description: "Reduce costs and latency by caching identical requests at the edge.",
            icon: Zap,
            className: "md:col-span-1",
            color: "bg-[#a7f3d0] text-black"
        },
        {
            title: "Enterprise Security",
            description: "Bank-grade encryption for API keys. We never log or store your request bodies.",
            icon: Shield,
            className: "md:col-span-1",
            color: "bg-[#fed7aa] text-black"
        },
        {
            title: "Real-time Analytics",
            description: "Track usage, costs, and latency across all your providers in one dashboard.",
            icon: BarChart3,
            className: "md:col-span-2",
            color: "bg-[#93c5fd] text-black"
        },
        {
            title: "Automatic Fallbacks",
            description: "Never fail a request. If one provider is down, we instantly route to your fallback choice.",
            icon: Globe2,
            className: "md:col-span-1",
            color: "bg-[#a7f3d0] text-black"
        },
        {
            title: "Key Rotation",
            description: "Bypass rate limits by automatically rotating through a pool of API keys.",
            icon: Key,
            className: "md:col-span-2",
            color: "bg-[#fed7aa] text-black"
        }
    ];

    return (
        <section className="py-24 bg-[#030303] border-b border-[#1b1b1b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center gap-6 mb-16">
                    <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#1a1a1a] px-4 py-1.5 rounded-full font-normal">
                        Features
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Everything you need.
                    </h2>
                    <p className="text-lg text-[#888] font-light max-w-2xl">
                        A complete toolkit for building reliable, scalable AI applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative p-8 rounded-3xl bg-[#0a0a0a] border border-[#1d1d1d] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 overflow-hidden ${feature.className}`}
                            >
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[#888] leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
