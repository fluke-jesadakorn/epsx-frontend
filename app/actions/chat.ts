"use server";

import { ChatRequest, ChatResponse } from "@/types/chat";

export async function chatQuery(request: ChatRequest): Promise<ChatResponse> {
  try {
    // TODO: Implement your actual API call here
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/ai-service/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data as ChatResponse;
  } catch (error) {
    console.error("Server chat query failed:", error);
    throw error;
  }
}

// TODO: Future features
// 1. Add rate limiting
// 2. Add user authentication check
// 3. Add request validation
// 4. Add response caching
// 5. Add streaming support
// 6. Add conversation history persistence
// 7. Add analytics tracking
