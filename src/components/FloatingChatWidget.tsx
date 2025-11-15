import React, { useState } from "react";
import ChatBot from "./ChatBot";

interface FloatingChatWidgetProps {
  userId: string;
}

const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] z-50 shadow-2xl rounded-lg overflow-hidden">
          <ChatBot userId={userId} className="h-full" />
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all z-40 flex items-center justify-center text-2xl"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
};

export default FloatingChatWidget;
