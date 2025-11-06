import { fetcher } from "./fetcher";
import type { Outfit, GetOutfitsParams, CreateOutfitPayload } from "../models/Outfit";

export type UpdateOutfitItemsPayload = {
  closet_item_ids: string[];
};

export const outfitApi = {
  // GET /outfits?userId={id} or GET /outfits (with access token)
  getOutfits: (params: GetOutfitsParams) => {
    // If userId is empty, don't send it - server will use token
    const queryParams = params.userId ? { userId: params.userId } : {};
    return fetcher.get<Outfit[]>("/outfits", { params: queryParams });
  },
  
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
