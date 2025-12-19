import { Badge } from '@/components/kibo-ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/kibo-ui/accordion";

const FAQSection = () => {
    const faqs = [
        {
            question: "Is Unio free to use?",
            answer: "Yes, Unio is completely open-source and free to self-host. We also offer a managed cloud version with a generous free tier for developers."
        },
        {
            question: "Which AI providers do you support?",
            answer: "We support all major AI providers including OpenAI, Anthropic, Google Gemini, Mistral, and any OpenAI-compatible API endpoint."
        },
        {
            question: "Does using Unio add latency?",
            answer: "Unio is built on high-performance edge infrastructure, adding negligible latency (typically <100ms) to your requests while providing crucial features like caching and failover."
        },
        {
            question: "How does key rotation work?",
            answer: "You can add multiple API keys for a single provider. Unio will automatically rotate through them, handling rate limits by switching to the next available key seamlessly."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We do not store your request data. API keys are encrypted at rest using industry-standard AES-256 encryption."
        }
    ];

    return (
        <section className="py-24 bg-[#030303] border-b border-[#1b1b1b]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center gap-6 mb-16">
                    <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#1a1a1a] px-4 py-1.5 rounded-full font-normal">
                        FAQ
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Common questions.
                    </h2>
                    <p className="text-lg text-[#888] font-light">
                        Everything you need to know about Unio.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border border-[#1d1d1d] rounded-2xl bg-[#0a0a0a] px-6 py-2 data-[state=open]:border-[#333] transition-colors">
                            <AccordionTrigger className="text-white hover:text-[#ccc] text-lg font-medium py-4">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[#888] text-base font-light pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FAQSection;
