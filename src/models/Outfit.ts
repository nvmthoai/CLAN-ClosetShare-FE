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
  top: ClothingItem | null;
  bottom: ClothingItem | null;
  outwear: ClothingItem | null;
  accessories: ClothingItem[];
}

export interface GetOutfitsParams {
  userId: string;
}

export interface CreateOutfitPayload {
  name: string;
  top?: string | null;
  bottom?: string | null;
  outwear?: string | null;
  accessories?: string[];
}
