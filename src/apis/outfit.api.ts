import { fetcher } from "./fetcher";
import { getAccessToken } from "@/lib/token";
import type { Outfit, GetOutfitsParams, CreateOutfitPayload } from "../models/Outfit";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type UpdateOutfitItemsPayload = {
  closet_item_ids: string[];
};

const authHeaders = () => {
  const token = getAccessToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
};

export const outfitApi = {
  // GET /outfits?userId={id} or GET /outfits (with access token)
  getOutfits: (params?: GetOutfitsParams) => {
    const queryParams = params?.userId ? { userId: params.userId } : undefined;
    return fetcher.get<Outfit[]>("/outfits", {
      params: queryParams,
      headers: authHeaders(),
    });
  },

  // GET /outfits/public - Get public outfits for explore feed
  getPublicOutfits: (params?: PaginationParams) =>
    fetcher.get("/outfits/public", {
      params,
      headers: authHeaders(),
    }),

  // GET /outfits/{id} - Get shared outfit detail (requires token)
  getPublicOutfitById: (outfitId: string) =>
    fetcher.get(`/outfits/${outfitId}`, {
      headers: authHeaders(),
    }),
  
  // GET /outfits/{outfitId} - Get outfit details
  getById: (outfitId: string) =>
    fetcher.get<Outfit>(`/outfits/${outfitId}`, {
      headers: authHeaders(),
    }),
  
  // POST /outfits - Create new outfit
  createOutfit: (payload: CreateOutfitPayload) =>
    fetcher.post<Outfit>("/outfits", payload, {
      headers: authHeaders(),
    }),
  
  // POST /outfits/{outfitId} - Update outfit with closet items
  updateOutfitItems: (outfitId: string, payload: UpdateOutfitItemsPayload) =>
    fetcher.post<Outfit>(`/outfits/${outfitId}`, payload, {
      headers: authHeaders(),
    }),
};
