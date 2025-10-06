import { fetcher } from "./fetcher";
import type { GetSubscriptionsResponse } from "@/models/Subscription";
import type { GetCurrentSubscriptionResponse } from "@/models/CurrentSubscription";

export const subscriptionApi = {
  getAll: async () => fetcher.get<GetSubscriptionsResponse>("/subscriptions"),
  // Backend screenshot shows POST /subscriptions/order with { subscription_plan_id }
  createOrder: async (subscriptionPlanId: string) =>
    fetcher.post("/subscriptions/order", {
      subscription_plan_id: subscriptionPlanId,
    }),
  getCurrent: async () =>
    fetcher.get<GetCurrentSubscriptionResponse>(
      "/me/subscription" // expect backend to expose current user's subscription
    ),
};
