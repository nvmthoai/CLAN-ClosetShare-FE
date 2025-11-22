export type Pricing = {
  price: number;
  start_date?: string;
  end_date?: string | null;
};

export type Variant = {
  id: string;
  product_id: string;
  name: string;
  type: string;
  stock: number;
  images: string[]; // Backend returns signed URLs
  pricing: Pricing | null; // Backend transforms pricings array to single pricing object
};

export type Product = {
  id: string;
  name: string;
  description: string;
  type: "SALE" | "RENT";
  shop_id: string;
  variants: Variant[];
  filter_props?: Array<{
    filterProp: {
      id: string;
      name: string;
      filter_id: string;
    };
  }>;
};

export type ProductListResponse = {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    total_pages: number;
  };
};

// CRUD Operations Types
export type CreateProductInShopPayload = {
  name: string;
  description: string;
  type: "SALE" | "RENT";
  filter_props: string[]; // Array of filter_prop IDs
};

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  type?: "SALE" | "RENT";
  filter_props?: string[]; // Array of filter_prop IDs
};

export type CreateVariantPayload = {
  name: string;
  type: string;
  stock: number;
  price: number;
  images?: File[]; // Files to upload
};