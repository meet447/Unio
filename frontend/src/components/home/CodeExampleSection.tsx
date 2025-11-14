import React, { useState } from "react";
import { Code, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="py-20 bg-background px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
            Drop-in replacement for OpenAI
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Use your existing code with any provider. Just change the base URL.
          </p>
        </div>

        {/* Code block */}
        <div className="bg-black rounded-xl shadow-lg overflow-hidden border border-gray-800">
          <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
            {/* Traffic lights */}
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            {/* Code language and copy button */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-300">Python</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors text-sm text-gray-300 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

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
        </div>
      </div>
    </section>
  );
};

export default CodeExampleSection;