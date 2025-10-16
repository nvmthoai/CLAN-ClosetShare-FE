export type Pricing = {
  id: string;
  variant_id: string;
  price: number;
};

export type Variant = {
  id: string;
  product_id: string;
  name: string;
  type: string;
  stock: number;
  status: string;
  imgs: string[];
  pricings?: Pricing[];
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  status?: string;
  type?: string;
  shop_id?: string;
  images?: string[];
  variants?: Variant[];
};

export type PagedResponse<T> = {
  data: T[];
  page?: number;
  limit?: number;
  total?: number;
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// CRUD Operations Types
export type CreateProductPayload = {
  name: string;
  description?: string;
  type?: string;
  shop_id: string;
  images?: string[];
  variants?: Omit<Variant, 'id' | 'product_id'>[];
};

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  status?: string;
  type?: string;
  images?: string[];
  variants?: Omit<Variant, 'id' | 'product_id'>[];
};

export type CreateProductInShopPayload = {
  name: string;
  description?: string;
  type?: string;
  images?: string[];
  variants?: Omit<Variant, 'id' | 'product_id'>[];
};