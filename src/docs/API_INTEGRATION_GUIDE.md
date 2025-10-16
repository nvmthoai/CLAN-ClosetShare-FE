# API Integration Guide - Product List

## 📋 Tổng quan

Hệ thống đã được thiết kế để dễ dàng chuyển đổi giữa Mock Data và API thực cho việc lấy danh sách sản phẩm với phân trang.

## 🔧 API Endpoint

### GET /products

**Required Parameters:**
- `shopId` (string) - ID của shop
- `page` (number) - Trang hiện tại
- `limit` (number) - Số sản phẩm mỗi trang
- `search` (string) - Từ khóa tìm kiếm
- `type` (string) - Loại sản phẩm

**Response Format:**
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "status": "string",
      "type": "string",
      "shop_id": "string",
      "images": ["string"],
      "variants": [
        {
          "id": "string",
          "product_id": "string",
          "name": "string",
          "type": "string",
          "stock": "number",
          "status": "string",
          "imgs": ["string"],
          "pricings": [
            {
              "id": "string",
              "variant_id": "string",
              "price": "number"
            }
          ]
        }
      ]
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number",
  "totalPages": "number"
}
```

## 🚀 Cách sử dụng

### 1. Test với Mock Data (Hiện tại)

```typescript
// Trong ViewShop.tsx hoặc ProductList.tsx
const useMockData = true; // Sử dụng mock data
```

### 2. Chuyển sang API thực

```typescript
// Thay đổi useMockData thành false
const useMockData = false; // Sử dụng API thực

// Hoặc xóa hoàn toàn và chỉ dùng API
const { data: productsData } = useProductsByShop(shopId, {
  page: currentPage,
  limit: 8,
  search: searchTerm,
  type: productType,
});
```

### 3. Demo Page

Truy cập `/shop/demo` để test việc chuyển đổi giữa Mock Data và API:

- **Toggle ON**: Sử dụng Mock Data
- **Toggle OFF**: Sử dụng API thực

## 📁 File Structure

```
src/
├── apis/
│   └── product.api.ts          # API calls
├── hooks/
│   └── useProducts.ts          # React Query hooks
├── models/
│   └── Product.ts              # TypeScript types
├── components/
│   └── ProductList.tsx         # Reusable component
├── pages/Shop/
│   ├── ViewShop.tsx            # Main shop view
│   └── ProductDemo.tsx         # Demo page
└── docs/
    └── API_INTEGRATION_GUIDE.md # This file
```

## 🎯 Features

### ✅ Đã implement:
- [x] API integration với React Query
- [x] Pagination với UI controls
- [x] Search functionality
- [x] Filter by product type
- [x] Loading states
- [x] Error handling với fallback
- [x] Mock data fallback
- [x] Responsive design
- [x] Demo page với toggle

### 🔄 Workflow:
1. **Mock Data Mode**: Hiển thị dữ liệu mẫu, search/filter disabled
2. **API Mode**: Kết nối API thực, tất cả features hoạt động
3. **Error Fallback**: Nếu API lỗi, tự động chuyển về mock data

## 🛠️ Customization

### Thay đổi số sản phẩm mỗi trang:
```typescript
const { data } = useProductsByShop(shopId, {
  page: currentPage,
  limit: 12, // Thay đổi từ 8 thành 12
});
```

### Thêm filter mới:
```typescript
// Trong GetProductsParams
export type GetProductsParams = {
  shopId: string;
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  category?: string; // Thêm filter mới
  priceMin?: number; // Thêm filter giá
  priceMax?: number;
};
```

## 🐛 Troubleshooting

### API không hoạt động:
1. Kiểm tra endpoint URL trong `fetcher.ts`
2. Kiểm tra authentication headers
3. Kiểm tra CORS settings
4. Sử dụng Mock Data làm fallback

### Pagination không hiển thị:
- Kiểm tra `totalPages > 1`
- Kiểm tra API response có đúng format không

### Search không hoạt động:
- Kiểm tra API có support search parameter không
- Kiểm tra debounce cho search input

## 📞 Support

Khi có API thực, chỉ cần:
1. Thay đổi `useMockData = false`
2. Cập nhật endpoint URL
3. Test các features

Tất cả UI và logic đã sẵn sàng! 🚀
