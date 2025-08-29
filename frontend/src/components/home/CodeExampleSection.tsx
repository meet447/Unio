import React from "react";
import { Code } from "lucide-react";

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
        <div className="bg-black rounded-xl p-6 lg:p-8 shadow-lg overflow-x-auto border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            {/* Traffic lights */}
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="w-3 h-3 bg-gray-500 rounded-full" />
              <span className="w-3 h-3 bg-gray-600 rounded-full" />
            </div>

            {/* Code language */}
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-300">Python</span>
            </div>
          </div>

          {/* Code content */}
          <pre className="text-sm text-gray-100 whitespace-pre overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default CodeExampleSection;