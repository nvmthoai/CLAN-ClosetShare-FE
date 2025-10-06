export type FilterProp = {
  id: string;
  filter_id: string;
  name: string; // raw name from backend
  description?: string; // human readable label if provided
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type Filter = {
  id: string;
  name: string;
  description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  props?: FilterProp[];
};

export type GetFiltersResponse = {
  count: number;
  filters: Filter[];
};
