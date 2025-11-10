import React, { useEffect, useRef, useState } from "react";
import { getUserId } from "@/lib/user";
import { chatApi } from "@/apis/chat.api";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

type Props = {
  webhookUrl?: string;
  title?: string;
  maxWidth?: string | number;
  height?: string | number;
  currentUserId?: string | null;
  debug?: boolean;
};

const DEFAULT_WEBHOOK =
  "https://nvmthoai1.app.n8n.cloud/webhook/fc1aa0bb-d14d-4ba3-859e-e69fc31a22c8/chat";

const generateSessionId = () => Math.random().toString(36).substring(2, 9);

export default function CustomChatBot({
  webhookUrl = DEFAULT_WEBHOOK,
  title = "Fashion Stylist AI",
  maxWidth = "500px",
  height = 600,
  currentUserId,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef<string>(generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // optional: initial greeting
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Xin chào! Tôi là Fashion Stylist AI. Hỏi tôi về phối đồ, phong cách hoặc gợi ý thời trang.",
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const providedUserId = currentUserId ?? getUserId?.() ?? undefined;

      const payload: Record<string, any> = {
        action: "sendMessage",
        sessionId: sessionIdRef.current,
        chatInput: trimmed,
      };

      if (providedUserId) payload.userId = providedUserId;

  // Debug: log payload to console
  console.info("CustomChatBot -> Sending payload:", payload);

      // In development use chatApi (axios + proxy) to avoid CORS and include auth headers
      if (import.meta.env.DEV) {
        const axiosRes = await chatApi.sendMessage(payload as any);
        // axios response: axiosRes.data
        console.info("CustomChatBot <- axios response:", axiosRes.data);
        const data = axiosRes.data as any;
  // Debug: show structured response and bot output
  console.info("Bot response:", data?.output);
        const botText = data?.chatOutput || data?.message || data?.output || "Xin lỗi, tôi không thể trả lời ngay.";
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: botText,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // Read raw text first so we can handle empty/non-JSON responses gracefully
        const status = res.status;
        const raw = await res.text();
        console.info("CustomChatBot <- Raw response (status, body):", status, raw);

        // Try parse JSON, fall back to raw text
        let data: any = undefined;
        try {
          data = raw ? JSON.parse(raw) : undefined;
        } catch (parseErr) {
          data = raw;
        }

        if (!res.ok) {
          // include response body in thrown error for easier debugging
          throw new Error(`HTTP ${status} - ${raw}`);
        }

        // Debug: log structured response when possible
        console.info("Bot response:", data?.output ?? data);

        const botText = data?.output || data?.message || (typeof data === "string" ? data : "Xin lỗi, tôi không thể trả lời ngay.");
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: botText,
        };

        setMessages((prev) => [...prev, botMessage]);
      }

      // note: botMessage already appended inside each branch above
    } catch (err: any) {
      console.error("CustomChatBot error:", err);
  // Log error for troubleshooting
  const errText = err?.message ? `${err.message}` : String(err);
  console.error("CustomChatBot error detail:", errText);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Xin lỗi, có lỗi khi kết nối với chatbot. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth }}
      className="border rounded-xl overflow-hidden shadow-lg"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-blue-100">ClosetShare Chat</div>
        </div>
        {/* control area (no debug button) */}
      </div>

      <div style={{ height: typeof height === "number" ? `${height}px` : height }} className="bg-gray-50 p-4 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`mb-3 max-w-[80%] ${m.role === "user" ? "ml-auto text-right" : "mr-auto text-left"}`}>
            <div className={`${m.role === "user" ? "bg-blue-500 text-white rounded-2xl px-4 py-2 inline-block" : "bg-white border border-gray-200 rounded-2xl px-4 py-2 inline-block"}`}>
              <div dangerouslySetInnerHTML={{ __html: m.content }} />
            </div>
            <div className="text-[11px] text-gray-400 mt-1">{m.role === "user" ? "Bạn" : "Bot"}</div>
          </div>
        ))}

        {isLoading && (
          <div className="mb-3">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 inline-block">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}


        <div ref={messagesEndRef} />
      </div>

      {/* Debug panel removed for production-style UI */}

      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for outfit suggestions..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            className={
              "px-4 py-2 rounded-lg bg-blue-600 text-white " +
              (isLoading || !input.trim() ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700")
            }
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Nhấn Enter để gửi</p>
      </form>
    </div>
  );
}
