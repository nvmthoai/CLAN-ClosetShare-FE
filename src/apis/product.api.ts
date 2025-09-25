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
};

export const productApi = {
  getProducts: async (params: GetProductsParams = {}) => {
    return fetcher.get("/products", { params });
  },
};
