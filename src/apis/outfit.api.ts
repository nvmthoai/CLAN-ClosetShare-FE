import { fetcher } from "./fetcher";
import type { Outfit, GetOutfitsParams, CreateOutfitPayload } from "../models/Outfit";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type UpdateOutfitItemsPayload = {
  closet_item_ids: string[];
};

export const outfitApi = {
  // GET /outfits?userId={id} or GET /outfits (with access token)
  getOutfits: (params?: GetOutfitsParams) => {
    const queryParams = params?.userId ? { userId: params.userId } : undefined;
    return fetcher.get<Outfit[]>("/outfits", { params: queryParams });
  },

  // GET /outfits/public - Get public outfits for explore feed
  getPublicOutfits: (params?: PaginationParams) =>
    fetcher.get("/outfits/public", {
      params,
    }),

  // GET /outfits/public/{id} - Get public outfit detail
  getPublicOutfitById: (outfitId: string) =>
    fetcher.get(`/outfits/public/${outfitId}`),
  
  // GET /outfits/{outfitId} - Get outfit details
  getById: (outfitId: string) =>
    fetcher.get<Outfit>(`/outfits/${outfitId}`),
  
  // POST /outfits - Create new outfit
  createOutfit: (payload: CreateOutfitPayload) =>
    fetcher.post<Outfit>("/outfits", payload),
  
  // POST /outfits/{outfitId} - Update outfit with closet items
  updateOutfitItems: (outfitId: string, payload: UpdateOutfitItemsPayload) =>
    fetcher.post<Outfit>(`/outfits/${outfitId}`, payload),
};
