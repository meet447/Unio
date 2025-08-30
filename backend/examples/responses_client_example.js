/**
 * Example usage of the Unio Responses API - Node.js/JavaScript version
 * 
 * This demonstrates how to use the new responses API in a format similar 
 * to the OpenAI client library, but working with all supported providers.
 */

// You can use any HTTP client - here's an example with fetch (Node.js 18+ or with node-fetch)
class UnioClient {
    constructor(options = {}) {
        this.apiKey = options.apiKey || process.env.UNIO_API_KEY;
        this.baseURL = options.baseURL || "http://localhost:8000/v1/api";
        
        if (!this.apiKey) {
            throw new Error("API key is required. Set UNIO_API_KEY environment variable or pass apiKey in options.");
        }
    }
    
    get responses() {
        return {
            create: async (params) => {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                };
                
                // Add fallback model header if specified
                if (params.fallback_model) {
                    headers['X-Fallback-Model'] = params.fallback_model;
                    delete params.fallback_model; // Remove from body
                }
                
                const response = await fetch(`${this.baseURL}/responses`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(params)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
                }
                
                return await response.json();
            }
        };
    }
}

// Example 1: Basic usage (matching the original request format)
async function exampleBasicUsage() {
    console.log("Example 1: Basic Usage");
    console.log("-".repeat(40));
    
    const client = new UnioClient({
        apiKey: process.env.UNIO_API_KEY, // or your API key
        baseURL: "http://localhost:8000/v1/api", // your Unio instance
    });

    try {
        const response = await client.responses.create({
            model: "openai/gpt-4o-mini", // or any other supported model
            input: "Tell me a fun fact about the moon in one sentence.",
        });

        console.log("Response:", response.output_text);
        console.log("Model used:", response.model);
        console.log("Tokens:", response.usage);
    } catch (error) {
        console.error("Error:", error.message);
    }
    
    console.log();
}

// Example 2: Using Groq (like in the original example)
async function exampleGroqUsage() {
    console.log("Example 2: Groq Provider");
    console.log("-".repeat(40));
    
    const client = new UnioClient({
        apiKey: process.env.UNIO_API_KEY,
        baseURL: "http://localhost:8000/v1/api",
    });

    try {
        const response = await client.responses.create({
            model: "groq/llama-3.1-8b-instant", // Groq model
            input: "Tell me a fun fact about the moon in one sentence.",
        });

        console.log("Response:", response.output_text);
        console.log("Key used:", response.key_name);
    } catch (error) {
        console.error("Error:", error.message);
    }
    
    console.log();
}

// Example 3: With conversation context
async function exampleConversationContext() {
    console.log("Example 3: Conversation Context");
    console.log("-".repeat(40));
    
    const client = new UnioClient({
        apiKey: process.env.UNIO_API_KEY,
        baseURL: "http://localhost:8000/v1/api",
    });

    try {
        const response = await client.responses.create({
            model: "anthropic/claude-3-haiku-20240307",
            input: [
                { role: "user", content: "What's the capital of France?" },
                { role: "assistant", content: "The capital of France is Paris." },
                { role: "user", content: "What's its population?" }
            ],
            temperature: 0.7
        });

        console.log("Response:", response.output_text);
    } catch (error) {
        console.error("Error:", error.message);
    }
    
    console.log();
}

// Example 4: Tool calling
async function exampleToolCalling() {
    console.log("Example 4: Tool Calling");
    console.log("-".repeat(40));
    
    const client = new UnioClient({
        apiKey: process.env.UNIO_API_KEY,
        baseURL: "http://localhost:8000/v1/api",
    });

    try {
        const response = await client.responses.create({
            model: "openai/gpt-4o-mini",
            input: "What's the weather like in San Francisco?",
            tools: [
                {
                    type: "function",
                    function: {
                        name: "get_weather",
                        description: "Get current weather for a location",
                        parameters: {
                            type: "object",
                            properties: {
                                location: {
                                    type: "string",
                                    description: "City and state, e.g. San Francisco, CA"
                                }
                            },
                            required: ["location"]
                        }
                    }
                }
            ],
            tool_choice: "auto"
        });

        console.log("Response:", response.output_text);
        if (response.tool_calls) {
            console.log("Tool calls:", JSON.stringify(response.tool_calls, null, 2));
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
    
    console.log();
}

// Example 5: Fallback mechanism
async function exampleFallback() {
    console.log("Example 5: Fallback Mechanism");
    console.log("-".repeat(40));
    
    const client = new UnioClient({
        apiKey: process.env.UNIO_API_KEY,
        baseURL: "http://localhost:8000/v1/api",
    });

    try {
        const response = await client.responses.create({
            model: "openai/gpt-4o-mini",
            input: "Write a creative story in 50 words.",
            fallback_model: "anthropic/claude-3-haiku-20240307", // Fallback if primary fails
            temperature: 0.8
        });

        console.log("Response:", response.output_text);
        console.log("Key used:", response.key_name);
        
        if (response.key_name.includes("fallback:")) {
            console.log("🔄 Fallback model was used!");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
    
    console.log();
}

// Example 6: Multiple providers test
async function exampleMultipleProviders() {
    console.log("Example 6: Testing Multiple Providers");
    console.log("-".repeat(40));
    
    const client = new UnioClient({
        apiKey: process.env.UNIO_API_KEY,
        baseURL: "http://localhost:8000/v1/api",
    });

    const providers = [
        "openai/gpt-4o-mini",
        "anthropic/claude-3-haiku-20240307",
        "google/gemini-1.5-flash",
        "groq/llama-3.1-8b-instant"
    ];

    const prompt = "Explain AI in one sentence.";

    for (const model of providers) {
        try {
            console.log(`Testing ${model}:`);
            const response = await client.responses.create({
                model,
                input: prompt,
                temperature: 0.7
            });
            
            console.log(`  Response: ${response.output_text.substring(0, 100)}...`);
            console.log(`  Tokens: ${response.usage?.total_tokens || 'N/A'}`);
        } catch (error) {
            console.log(`  Error: ${error.message}`);
        }
        console.log();
    }
}

// Main function to run all examples
async function main() {
    console.log("Unio Responses API Examples (JavaScript/Node.js)");
    console.log("=".repeat(60));
    console.log();
    
    // Check if API key is available
    if (!process.env.UNIO_API_KEY) {
        console.log("❌ Please set your UNIO_API_KEY environment variable");
        console.log("   export UNIO_API_KEY='your_api_key_here'");
        return;
    }
    
    try {
        await exampleBasicUsage();
        await exampleGroqUsage();
        await exampleConversationContext();
        await exampleToolCalling();
        await exampleFallback();
        await exampleMultipleProviders();
        
        console.log("✅ All examples completed successfully!");
        console.log("\nNext steps:");
        console.log("- Customize the examples for your use case");
        console.log("- Try different models and providers");
        console.log("- Implement error handling for production use");
        console.log("- Set up fallback strategies for critical applications");
        
    } catch (error) {
        console.error("❌ Examples failed:", error);
    }
}

// Run the examples if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { UnioClient };