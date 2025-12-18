import { Badge } from "@/components/kibo-ui/badge";
import { Calendar, Tag, ChevronRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navigation from "@/components/layout/Navigation";

const changes = [
    {
        date: "December 18, 2025",
        version: "v1.2.0",
        title: "Enhanced RAG & Logging",
        description: "Introduced detailed RAG logging and improved documentation with standardized model naming.",
        items: [
            "Added RAG metadata to request logs (retrieved chunks, context previews).",
            "Launched standalone Documentation page at /docs.",
            "Standardized model naming convention to provider:model (e.g., openai:gpt-4o).",
            "Fixed payload viewer UI to prevent layout breaking on large texts.",
            "Added Knowledge Vault document listing and ID copying."
        ],
        type: "Feature"
    },
    {
        date: "December 15, 2025",
        version: "v1.1.0",
        title: "Knowledge Vaults & Providers",
        description: "Added support for Knowledge Vaults and multiple AI providers.",
        items: [
            "Implemented Knowledge Vaults for document-based RAG.",
            "Added support for OpenAI, Groq, and Anthropic providers.",
            "Added API key management and verification.",
            "Implemented request logging and basic analytics."
        ],
        type: "Feature"
    },
    {
        date: "December 10, 2025",
        version: "v1.0.0",
        title: "Initial Release",
        description: "The first version of Unio - Unified AI Gateway.",
        items: [
            "OpenAI-compatible chat completions endpoint.",
            "User authentication and dashboard.",
            "Basic model configuration."
        ],
        type: "Release"
    }
];

export default function Changelog() {
    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <Navigation />
            <div className="pt-24 pb-12 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium uppercase tracking-wider">
                            <Tag className="w-4 h-4" />
                            Updates
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Changelog</h1>
                        <p className="text-[#9d9d9d] text-lg max-w-2xl leading-relaxed">
                            Stay up to date with the latest features, improvements, and fixes added to Unio.
                        </p>
                        <a href="/dashboard" className="inline-block text-sm text-[#6f6f6f] hover:text-white transition-colors">
                            ← Back to Dashboard
                        </a>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#1b1b1b] before:to-transparent">
                        {changes.map((change, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                {/* Dot */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#1b1b1b] bg-[#0a0a0a] text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <ChevronRight className="w-5 h-5" />
                                </div>

                                {/* Content */}
                                <div className="w-[calc(100%-4rem)] md:w-[45%] bg-[#0a0a0a] p-6 rounded-2xl border border-[#1b1b1b] hover:border-[#2a2a2a] transition-all shadow-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-xs text-[#6f6f6f]">
                                            <Calendar className="w-3 h-3" />
                                            {change.date}
                                        </div>
                                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                                            {change.version}
                                        </Badge>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{change.title}</h3>
                                    <p className="text-sm text-[#9d9d9d] mb-4 leading-relaxed">
                                        {change.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {change.items.map((item, i) => (
                                            <li key={i} className="flex gap-2 text-sm text-[#b0b0b0]">
                                                <span className="text-blue-500">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-12 border-t border-[#1b1b1b] max-w-4xl mx-auto">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
