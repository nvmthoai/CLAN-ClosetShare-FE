import { fetcher } from "./fetcher";
import type { Shop, CreateShopPayload } from "@/models/Shop";

export const shopApi = {
  create: (payload: CreateShopPayload) => fetcher.post<Shop>("/shops", payload),
  getById: (id: string) => fetcher.get<Shop>(`/shops/${id}`),
};
