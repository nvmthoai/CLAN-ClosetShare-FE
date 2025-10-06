import { fetcher } from "./fetcher";

export type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  shopId?: string;
  sort?: string; // e.g. newest | price_asc | price_desc
  sizes?: string; // comma separated sizes
  priceMin?: number | null;
  priceMax?: number | null;
  // Backend-driven filter selections: pass prop IDs (e.g., size "37" prop id)
  filterPropIds?: string; // comma separated list of filter prop IDs
  filter_prop_ids?: string; // snake_case alternative
  // snake_case fallbacks some backends may expect
  price_min?: number | null;
  price_max?: number | null;
};

export const productApi = {
  getProducts: async (params: GetProductsParams = {}) => {
    return fetcher.get("/products", { params });
  },
  getProductById: async (id: string) => {
    return fetcher.get(`/products/${id}`);
  },
};
