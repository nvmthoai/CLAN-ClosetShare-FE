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
