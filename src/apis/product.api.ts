import { fetcher } from "./fetcher";
import type { Product, ProductListResponse } from "@/models/Product";

export type GetProductsParams = {
  shopId: string; // Required parameter
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
};

export const productApi = {
  // Get products with pagination (matching API documentation)
  getProducts: (params: GetProductsParams) => 
    fetcher.get<ProductListResponse>("/products", { params }),
  
  // Get single product by ID
  getProductById: (id: string) => 
    fetcher.get<Product>(`/products/${id}`),
  
  // Get products for a specific shop (convenience method)
  getProductsByShop: (shopId: string, params?: Omit<GetProductsParams, 'shopId'>) =>
    fetcher.get<ProductListResponse>("/products", { 
      params: { shopId, ...params } 
    }),
};
