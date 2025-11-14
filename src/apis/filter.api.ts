import { fetcher } from "./fetcher";
import type { GetFiltersResponse } from "@/models/Filter";

export const filterApi = {
  getAll: async () => {
    // Matches Postman: GET {{baseURL}}/filters
    return fetcher.get<GetFiltersResponse>(`/filters`);
  },
  // Create a new filter (group)
  createFilter: async (payload: { name: string; description?: string }) => {
    return fetcher.post(`/filters`, payload);
  },
  // Create one or multiple filter props under a filter
  // The backend expects a body like: { filter_id: string, filter_props: [{ name, description }, ...] }
  createFilterProps: async (
    filterId: string,
    props: Array<{ name: string; description?: string }>
  ) => {
    return fetcher.post(`/filter-props`, {
      filter_id: filterId,
      filter_props: props,
    });
  },
};
