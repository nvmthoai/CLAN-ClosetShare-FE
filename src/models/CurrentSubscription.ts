export type CurrentSubscription = {
  subscription_plan_id: string;
  plan_name: string;
  status: string; // active | expired | pending | cancelled
  expires_at?: string; // ISO date string
  started_at?: string;
};

export type GetCurrentSubscriptionResponse =
  | CurrentSubscription
  | { data: CurrentSubscription | null }
  | null;
