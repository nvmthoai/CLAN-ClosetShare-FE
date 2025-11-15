import React, { useState } from "react";
import ChatIframe from "./ChatIframe";

type Props = {
  webhookUrl?: string;
  buttonPosition?: { bottom?: string; right?: string };
};

const FloatingChatWidget: React.FC<Props> = ({
  webhookUrl,
  buttonPosition = { bottom: "20px", right: "20px" },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: 400,
            height: 550,
            backgroundColor: "white",
            borderRadius: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>Fashion Stylist AI</div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <ChatIframe webhookUrl={webhookUrl} height={500} />
        </div>
      )}

      <button
        onClick={() => setIsOpen((s) => !s)}
        aria-label="Open chat"
        style={{
          position: "fixed",
          bottom: buttonPosition.bottom || "20px",
          right: buttonPosition.right || "20px",
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 999,
        }}
      >
        💬
      </button>
    </>
  );
};

export default FloatingChatWidget;
