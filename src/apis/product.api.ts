import { fetcher } from "./fetcher";
import type { 
  Product, 
  ProductListResponse, 
  CreateProductPayload, 
  UpdateProductPayload, 
  CreateProductInShopPayload 
} from "@/models/Product";

export type GetProductsParams = {
  shopId?: string; // Optional for general product listing
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
};

export const productApi = {
  // 1. POST /products/shop - Create product in shop
  createProductInShop: (payload: CreateProductInShopPayload) =>
    fetcher.post<Product>("/products/shop", payload),
  
  // 2. GET /products - Get products with pagination
  getProducts: (params?: GetProductsParams) => 
    fetcher.get<ProductListResponse>("/products", { params }),
  
  // 3. GET /products/{productId} - Get single product by ID
  getProductById: (id: string) => 
    fetcher.get<Product>(`/products/${id}`),
  
  // 4. POST /products/{productId} - Special action on product (duplicate/restore)
  actionOnProduct: (id: string, action?: string) =>
    fetcher.post<Product>(`/products/${id}`, { action }),
  
  // 5. PUT /products/{productId} - Update product
  updateProduct: (id: string, payload: UpdateProductPayload) =>
    fetcher.put<Product>(`/products/${id}`, payload),
  
  // Convenience methods
  getProductsByShop: (shopId: string, params?: Omit<GetProductsParams, 'shopId'>) =>
    fetcher.get<ProductListResponse>("/products", { 
      params: { shopId, ...params } 
    }),
};
