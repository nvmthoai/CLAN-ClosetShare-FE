import { fetcher } from "./fetcher";
import type { GetFiltersResponse } from "@/models/Filter";

export const filterApi = {
  getAll: async () => {
    // Matches Postman: GET {{baseURL}}/filters
    return fetcher.get<GetFiltersResponse>(`/filters`);
  },
};
