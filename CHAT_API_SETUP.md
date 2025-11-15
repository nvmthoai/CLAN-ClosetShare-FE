# Chat API Setup Guide

## Vấn đề CORS

Khi gọi trực tiếp từ browser đến n8n webhook, bạn sẽ gặp lỗi CORS. Có 2 cách giải quyết:

## Giải pháp 1: Tạo endpoint trong Backend (Khuyến nghị)

Tạo endpoint `/chat` trong backend API của bạn (`http://103.163.24.150:3000`) để proxy request đến n8n:

```javascript
// Backend endpoint: POST /chat
app.post('/chat', async (req, res) => {
  const { chatInput, sessionId, userId } = req.body;
  
  // Encode Basic Auth
  const auth = Buffer.from('botuser:supersecret').toString('base64');
  
  try {
    const response = await fetch(
      'https://nvmthoai3.app.n8n.cloud/webhook/fb7bf781-87a8-4368-885d-555fd67390d7/chat',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput,
          sessionId,
          userId,
        }),
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});
```

## Giải pháp 2: Sử dụng Vercel Serverless Function (Đã setup)

Đã tạo file `api/chat.ts` để xử lý request trong production trên Vercel.

**Lưu ý**: Trong development (localhost), Vercel serverless function không chạy. Bạn cần:
1. Tạo endpoint `/chat` trong backend (Giải pháp 1), HOẶC
2. Test trực tiếp trên Vercel production

## Cấu hình hiện tại

- Frontend gọi: `POST /api/chat`
- Vercel sẽ route đến: `api/chat.ts` (serverless function)
- Serverless function sẽ proxy đến: n8n webhook

## Testing

1. **Development**: Cần có endpoint `/chat` trong backend
2. **Production**: Vercel serverless function sẽ tự động xử lý





