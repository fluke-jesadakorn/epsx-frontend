export interface ChatRequest {
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
}

export interface ChatResponse {
  role: string;
  content: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: string;
  content: string;
  timestamp: string;
  user_id?: string;
  conversation_id?: string;
  created_at?: string;
  updated_at?: string;
}
