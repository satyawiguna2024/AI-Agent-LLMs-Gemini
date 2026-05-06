import "dotenv/config";
import { createReactAgent } from "@langchain/langgraph/prebuilt" // AI-AGENT
import { MemorySaver } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// ---tool tentang cuaca---
const weatherTool = tool(async ({ query }) => {
  return "Cuaca di Tokyo cerah";
}, {
  name: "cuaca",
  description: "Mengetahui cuaca di lokasi tertentu",
  schema: z.object({
    query: z.string().describe("Untuk digunakan dalam pencarian")
  })
});

// ---tools tentang code---
const jsExecutor = tool(
  async ({ code }) => {
    const response = await fetch(process.env.EXECUTOR_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    return await response.json();
  },
  {
    name: 'run_javascript_code_tool',
    description: `
      Run general purpose javascript code. 
      This can be used to access Internet or do any computation that you need. 
      The output will be composed of the stdout and stderr. 
      It has the following API Keys as environment variables:
      The code should be written in a way that it can be executed with javascript eval in node environment.
    `,
    schema: z.object({
      code: z.string().describe('The code to run'),
    }),
  }
);

// ---llm model gemini---
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

// ---memory AI---
const checkpointSaver = new MemorySaver();

// ---agent ReAct (Reasoning lalu Action)---
export const agent = createReactAgent({
  llm,
  tools: [weatherTool, jsExecutor],
  checkpointSaver,
  maxIterations: 5
});

