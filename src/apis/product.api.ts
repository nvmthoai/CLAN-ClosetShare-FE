import { fetcher } from "./fetcher";
import type {
  Product,
  ProductListResponse,
  UpdateProductPayload,
  CreateProductInShopPayload,
} from "@/models/Product";

export type GetProductsParams = {
  shopId?: string;
  page?: number;
  limit?: number;
  search?: string;
  type?: "SALE" | "RENT";
};

export const productApi = {
  // POST /products/shop - Create product in shop
  createProductInShop: (payload: CreateProductInShopPayload) =>
    fetcher.post<Product>("/products/shop", payload),

  // GET /products - Get products with pagination
  getProducts: (params?: GetProductsParams) =>
    fetcher.get<ProductListResponse>("/products", { params }),

  // GET /products/{productId} - Get single product by ID
  getProductById: (id: string) => fetcher.get<Product>(`/products/${id}`),

  // PUT /products/{productId} - Update product
  updateProduct: (id: string, payload: UpdateProductPayload) =>
    fetcher.put<{ message: string; product: Product }>(`/products/${id}`, payload),

  // DELETE /products/{productId} - Delete product
  deleteProduct: (id: string) =>
    fetcher.delete<{ message: string }>(`/products/${id}`),

  // Convenience methods
  getProductsByShop: (
    shopId: string,
    params?: Omit<GetProductsParams, "shopId">
  ) =>
    fetcher.get<ProductListResponse>("/products", {
      params: { shopId, ...params },
    }),

  // POST /products/{productId} - Create variant with FormData (includes images)
  createVariant: (productId: string, formData: FormData) =>
    fetcher.post(`/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // PUT /products/{productId}/variants/{variantId} - Update variant
  updateVariant: (
    productId: string,
    variantId: string,
    formData: FormData
  ) =>
    fetcher.put(`/products/${productId}/variants/${variantId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // DELETE /products/{productId}/variants/{variantId} - Delete variant
  deleteVariant: (productId: string, variantId: string) =>
    fetcher.delete<{ message: string }>(
      `/products/${productId}/variants/${variantId}`
    ),
};
