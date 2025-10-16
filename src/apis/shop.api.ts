import { fetcher } from "./fetcher";
import type { Shop, CreateShopPayload, UpdateShopPayload, ShopListResponse } from "@/models/Shop";

export const shopApi = {
  // CRUD Operations
  create: (payload: CreateShopPayload) => fetcher.post<Shop>("/shops", payload),
  getAll: (params?: { page?: number; limit?: number; search?: string }) => 
    fetcher.get<ShopListResponse>("/shops", { params }),
  getById: (id: string) => fetcher.get<Shop>(`/shops/${id}`),
  update: (id: string, payload: UpdateShopPayload) => fetcher.patch<Shop>(`/shops/${id}`, payload),
  delete: (id: string) => fetcher.delete(`/shops/${id}`),
  
  // User's shops
  getMyShops: () => fetcher.get<Shop[]>("/shops/my-shops"),
  
  // Public view
  viewShop: (id: string) => fetcher.get<Shop>(`/view-shop/${id}`),
};
