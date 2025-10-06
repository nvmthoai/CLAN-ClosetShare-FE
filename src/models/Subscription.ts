export type Subscription = {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type GetSubscriptionsResponse =
  | Subscription[]
  | { data: Subscription[] };
