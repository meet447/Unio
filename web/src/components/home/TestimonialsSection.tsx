import { Badge } from '@/components/kibo-ui/badge';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Alex Rivera",
            role: "Senior Engineer at TechFlow",
            content: "Unio solved our rate limiting headaches overnight. The key rotation logic is flawless, and the unified API prevented a massive refactor.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        },
        {
            name: "Sarah Chen",
            role: "Indie Developer",
            content: "I use Unio for all my AI wrappers. Being able to switch between Claude and GPT-4 with a single config change is a game changer.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        },
        {
            name: "Marcus Johnson",
            role: "CTO at StartUp Inc",
            content: "The observability logs are incredible. We finally have visibility into exactly how much each feature is costing us across different providers.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        }
    ];

    return (
        <section className="py-24 bg-[#030303] border-b border-[#1b1b1b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center gap-6 mb-16">
                    <Badge variant="secondary" className="bg-[#0f0f0f] border-[#1d1d1d] text-[#9c9c9c] hover:bg-[#1a1a1a] px-4 py-1.5 rounded-full font-normal">
                        Testimonials
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Loved by developers.
                    </h2>
                    <p className="text-lg text-[#888] font-light max-w-2xl">
                        Don't just take our word for it. Here's what the community is saying.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-[#1d1d1d] flex flex-col gap-6 hover:border-[#333] transition-colors">
                            <Quote className="absolute top-8 right-8 w-8 h-8 text-[#1a1a1a]" />

                            <div className="flex gap-1 text-[#eab308]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>

                            <p className="text-lg text-[#ccc] font-light leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            <div className="mt-auto flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full bg-[#1a1a1a]"
                                />
                                <div>
                                    <div className="text-white font-medium text-sm">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-[#666] text-xs">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
