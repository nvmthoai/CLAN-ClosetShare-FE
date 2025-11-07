export interface ClothingItem {
  id: string;
  user_id: string;
  name: string;
  type: "TOPS" | "BOTTOMS" | "OUTWEAR" | "ACCESSORIES";
  image: string;
}

export interface Outfit {
  id: string;
  name: string;
  user_id: string;
  style: string | null;
  occasion: string | null;
  season: string | null;
  color_theme: string | null;
  created_at: string;
  updated_at: string;
  top_id: string | null;
  outwear_id: string | null;
  bottom_id: string | null;
}

// Deprecated: Keep for backward compatibility
export interface OutfitLegacy {
  id: string;
  name: string;
  user_id: string;
  top: ClothingItem | null;
  bottom: ClothingItem | null;
  outwear: ClothingItem | null;
  accessories: ClothingItem[];
}

export interface GetOutfitsParams {
  userId?: string;
}

export interface CreateOutfitPayload {
  name: string;
  style?: string | null;
  occasion?: string | null;
  season?: string | null;
  color_theme?: string | null;
  top_id?: string | null;
  outwear_id?: string | null;
  bottom_id?: string | null;
}
