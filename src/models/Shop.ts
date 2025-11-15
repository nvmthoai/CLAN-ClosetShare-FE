export type Shop = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  avatar?: string | null;
  background?: string | null;
  rating?: number;
  status?: string; // e.g. UNVERIFIED / ACTIVE
  created_at?: string;
  updated_at?: string;
  reviews_count?: number;
  products_count?: number;
  followers?: number;
  following?: number;
  opening_hours?: Record<string, string>;
  social_links?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
};

export type CreateShopPayload = {
  name: string;
  description?: string;
  address?: string;
  phone_number?: string;
  email?: string;
};

export type UpdateShopPayload = {
  name?: string;
  description?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  avatar?: string;
  background?: string;
};

export type ShopListResponse = {
  shops: Shop[];
  total: number;
  page: number;
  limit: number;
};