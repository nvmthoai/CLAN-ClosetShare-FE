import { fetcher } from "./fetcher";

export type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  shopId?: string;
};

export const productApi = {
  getProducts: async (params: GetProductsParams = {}) => {
    return fetcher.get("/products", { params });
  },
};
