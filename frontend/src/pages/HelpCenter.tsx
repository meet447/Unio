import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  MessageSquare, 
  Book, 
  Mail,
  ExternalLink,
  ChevronRight
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "What is Unio and how does it work?",
      answer: "Unio is an AI provider integration platform that simplifies managing multiple AI provider API keys through a unified interface. It abstracts away provider-specific authentication and request formatting, allowing you to integrate various LLMs (OpenAI, Anthropic, Google, Groq, Together, OpenRouter) through a consistent API."
    },
    {
      question: "How do I add API keys for different AI providers?",
      answer: "Go to your Dashboard and click 'Add API Key'. Select your AI provider (OpenAI, Anthropic, Google, etc.), enter your API key, and optionally add a description. Your keys are encrypted with AES-256 and securely stored. You can manage multiple keys per provider for redundancy."
    },
    {
      question: "What happens if my API key hits a rate limit?",
      answer: "Unio automatically handles rate limiting with a fallback mechanism. If one API key reaches its rate limit, the system automatically tries the next available key for the same provider. This ensures your applications continue running without interruption."
    },
    {
      question: "Which AI providers does Unio support?",
      answer: "Unio currently supports OpenAI, Anthropic (Claude), Google (Gemini), Groq, Together AI, and OpenRouter. The system is designed to be extensible, so new providers can be added easily. Each provider maintains its own client implementation while using a unified interface."
    },
    {
      question: "How secure are my API keys in Unio?",
      answer: "Your API keys are protected with enterprise-grade AES-256 encryption both at rest and in transit. Keys are encrypted before storage in the database, and the system follows security best practices. We never log or store your actual API responses, only usage metadata for analytics."
    },
    {
      question: "Can I track usage and analytics for my API keys?",
      answer: "Yes, Unio provides comprehensive usage tracking and analytics. You can monitor request counts, success rates, rate limit hits, and performance metrics for each API key. The dashboard shows real-time statistics and historical usage patterns."
    },
    {
      question: "How do I integrate Unio with my existing applications?",
      answer: "Unio provides a REST API that you can integrate into any application. Simply make requests to Unio's chat completions endpoint with your desired model, and Unio handles the routing to the appropriate provider. This allows you to switch between providers without changing your application code."
    },
    {
      question: "Can I use streaming responses with Unio?",
      answer: "Yes, Unio supports streaming responses for real-time applications like chatbots. The streaming implementation maintains compatibility with OpenAI's streaming format while working across all supported providers, ensuring consistent behavior regardless of the underlying AI service."
    },
    {
      question: "How does Unio handle different model formats across providers?",
      answer: "Unio normalizes responses from different providers into a consistent format. You can request models using provider-specific names (e.g., 'gpt-4', 'claude-3-opus', 'gemini-pro') and Unio automatically routes to the correct provider while standardizing the response format."
    },
    {
      question: "What should I do if I encounter authentication errors?",
      answer: "First, verify that your API key is correctly entered and still valid with the provider. Check that the key has the necessary permissions for the operations you're trying to perform. If issues persist, you can update or re-add the key in your dashboard, and Unio will re-encrypt and store the new credentials."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-2">
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-4 text-base border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-black"
          />
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link to="/docs" className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
              <Book className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              Documentation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
              Comprehensive API guides and code examples
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
              View Docs
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              Live Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
              Get instant help from our support team
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
              Start Chat
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              Email Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
              Send us a detailed message
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
              Send Email
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-2"
              >
                <AccordionTrigger className="text-left font-medium text-black dark:text-white hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 font-light pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-black dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                No results found for "{searchQuery}". Try a different search term or contact support.
              </p>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-black dark:text-white mb-2">
              Still Need Help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Can't find what you're looking for? Send us a message and we'll get back to you.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Name
                </label>
                <Input 
                  placeholder="Your name" 
                  className="border-gray-300 dark:border-gray-700 rounded-xl py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Email
                </label>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="border-gray-300 dark:border-gray-700 rounded-xl py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Subject
              </label>
              <Input 
                placeholder="How can we help?" 
                className="border-gray-300 dark:border-gray-700 rounded-xl py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Message
              </label>
              <Textarea 
                placeholder="Describe your issue or question in detail..."
                rows={5}
                className="border-gray-300 dark:border-gray-700 rounded-xl resize-none"
              />
            </div>

            <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-8 py-3 font-medium">
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;