import { fetcher } from "./fetcher";
import type { Shop, CreateShopPayload, UpdateShopPayload, ShopListResponse } from "@/models/Shop";

export const shopApi = {
  // CRUD Operations for single shop per user
  create: (payload: CreateShopPayload) => fetcher.post<Shop>("/shops", payload),
  getMyShop: () => fetcher.get<Shop>("/shops/my-shop"), // Get current user's shop
  update: (payload: UpdateShopPayload) => fetcher.patch<Shop>("/shops/my-shop", payload),
  delete: () => fetcher.delete("/shops/my-shop"),
  
  // Get shop by ID (public view)
  getById: (id: string) => fetcher.get<Shop>(`/shop/${id}`),
  
  // Admin operations (if needed)
  getAll: (params?: { page?: number; limit?: number; search?: string }) => 
    fetcher.get<ShopListResponse>("/shops", { params }),
};
