import React, { useState } from "react";
import { Code, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardContent, CardHeader } from "@/components/kibo-ui/card";
import { Button } from "@/components/kibo-ui/button";
import { Badge } from "@/components/kibo-ui/badge";
import { toast } from "sonner";

const codeExample = `from openai import OpenAI

# Use Unio as a drop-in replacement
client = OpenAI(
    api_key="your-unio-token",
    base_url="https://unio.onrender.com/v1/api"
)

response = client.chat.completions.create(
    model="anthropic:claude-3-5-sonnet",
    messages=[
        {"role": "user", "content": "Hello from Unio!"}
    ]
)

print(response.choices[0].message.content)`;

const CodeExampleSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <section className="py-20 bg-[#030303] border-y border-[#1b1b1b] px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Drop-in replacement for OpenAI
          </h2>
          <p className="text-lg sm:text-xl text-[#9c9c9c] max-w-2xl mx-auto">
            Use your existing code with any provider. Just change the base URL.
          </p>
        </div>

        {/* Code block */}
        <Card className="bg-[#0a0a0a] border-[#1d1d1d] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-4 bg-[#0f0f0f] border-b border-[#1c1c1c]">
            {/* Traffic lights */}
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            {/* Code language and copy button */}
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-[#0a0a0a] border-[#1d1d1d] text-[#9c9c9c]">
                <Code className="h-3 w-3 mr-2" />
                Python
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-[#9c9c9c] hover:text-white hover:bg-[#0a0a0a]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Code content with syntax highlighting */}
            <div className="overflow-x-auto">
              <SyntaxHighlighter
                language="python"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  background: 'transparent',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
                showLineNumbers={false}
                wrapLines={true}
              >
                {codeExample}
              </SyntaxHighlighter>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CodeExampleSection;