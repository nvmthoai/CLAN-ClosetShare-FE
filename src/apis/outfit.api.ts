import { fetcher } from "./fetcher";
import type { Outfit, GetOutfitsParams, CreateOutfitPayload } from "../models/Outfit";

export const outfitApi = {
  // GET /outfits?userId={id}
  getOutfits: (params: GetOutfitsParams) =>
    fetcher.get<Outfit[]>("/outfits", { params }),
  
  // POST /outfits - Create new outfit
  createOutfit: (payload: CreateOutfitPayload) =>
    fetcher.post<Outfit>("/outfits", payload),
};
