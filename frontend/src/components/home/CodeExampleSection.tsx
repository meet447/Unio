import React from 'react';
import { Code } from 'lucide-react';

const CodeExampleSection = () => {
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

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Drop-in replacement for OpenAI
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">
            Use your existing code with any provider. Just change the base URL.
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4 text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-400">Python</span>
            </div>
          </div>
          <pre className="text-xs sm:text-sm text-gray-300 overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default CodeExampleSection;