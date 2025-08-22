import { useState } from "react";
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
      question: "How do I add a new API key?",
      answer: "To add a new API key, go to your Dashboard and click the 'Add API Key' button. Select your provider, enter your key details, and configure your preferences. Your key will be encrypted and securely stored."
    },
    {
      question: "What happens when I reach my rate limit?",
      answer: "When you approach your rate limit, Unio will automatically rotate to your backup keys (if available) and send you notifications. You can configure fallback behavior and alerts in your key settings."
    },
    {
      question: "How often should I rotate my API keys?",
      answer: "We recommend rotating API keys every 30-90 days for security best practices. Unio can remind you when it's time to rotate and can automate the process for supported providers."
    },
    {
      question: "Is my data secure with Unio?",
      answer: "Yes, we use bank-level encryption (AES-256) to protect your API keys. Keys are encrypted at rest and in transit. We never log or store your actual API responses, only usage metadata."
    },
    {
      question: "Can I use Unio with any API provider?",
      answer: "Unio supports most popular API providers including OpenRouter, OpenAI, Google Cloud, AWS, and many more. If your provider isn't listed, you can still add custom API keys."
    },
    {
      question: "How does automatic key rotation work?",
      answer: "For supported providers, Unio can automatically generate new keys and update your applications seamlessly. For others, we'll guide you through the manual rotation process with notifications and documentation."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes up to 5 API keys, basic rate limiting, and standard support. Paid plans offer unlimited keys, advanced rotation features, team collaboration, and priority support."
    },
    {
      question: "How do I set up rate limit notifications?",
      answer: "Go to your Profile settings and enable 'Rate Limit Alerts'. You can customize thresholds (e.g., notify at 80% usage) and choose your notification method (email, webhook, or dashboard)."
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
          <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
              <Book className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              Documentation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
              Comprehensive guides and API reference
            </p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
              View Docs
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

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