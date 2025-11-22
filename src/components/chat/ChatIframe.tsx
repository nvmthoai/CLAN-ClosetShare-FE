import React from "react";

type Props = {
  webhookUrl?: string;
  width?: string | number;
  height?: string | number;
  title?: string;
  className?: string;
};

const DEFAULT_URL =
  "https://nvmthoai123.app.n8n.cloud/webhook/fc1aa0bb-d14d-4ba3-859e-e69fc31a22c8/chat";

const ChatIframe: React.FC<Props> = ({
  webhookUrl = DEFAULT_URL,
  width = "100%",
  height = 600,
  title = "Fashion Stylist Chatbot",
  className,
}) => {
  const heightValue = typeof height === "number" ? `${height}px` : height;
  const widthValue = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      style={{ width: widthValue, height: heightValue }}
      className={className}
    >
      <iframe
        src={webhookUrl}
        width="100%"
        height="100%"
        style={{ border: "none", borderRadius: 8 }}
        title={title}
        sandbox={"allow-forms allow-scripts allow-same-origin allow-popups"}
      />
    </div>
  );
};

export default ChatIframe;
