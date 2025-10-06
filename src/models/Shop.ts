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
};

export type CreateShopPayload = {
  name: string;
  description?: string;
  address?: string;
  phone_number?: string;
  email?: string;
};
