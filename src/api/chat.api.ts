// src/api/chat.api.ts
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SendMessageRequest {
  message: string;
  userId: string;
  sessionId: string;
}

export interface ChatResponse {
  output: string;
  sessionId: string;
}

export const sendMessage = async (
  message: string,
  userId: string,
  sessionId: string
): Promise<ChatResponse> => {
  try {
    const response = await fetch('/api/n8n', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: sessionId,
        chatInput: message,
        userId: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `n8n webhook error ${response.status}: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    throw error;
  }
};
