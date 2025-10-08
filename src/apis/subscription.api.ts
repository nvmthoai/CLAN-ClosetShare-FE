import { fetcher } from "./fetcher";
import type { GetSubscriptionsResponse } from "@/models/Subscription";
import type { GetCurrentSubscriptionResponse } from "@/models/CurrentSubscription";

export const subscriptionApi = {
  getAll: async () => fetcher.get<GetSubscriptionsResponse>("/subscriptions"),
  // Allow passing payment method (default PAYOS) so backend returns checkoutUrl
  createOrder: async (
    subscriptionPlanId: string,
    paymentMethod: string = "PAYOS"
  ) => {
    const payload = {
      subscription_plan_id: subscriptionPlanId,
      payment_method: paymentMethod,
    } as any;
    try {
      const res = await fetcher.post("/subscriptions/order", payload);
      // Debug log to inspect structure (can remove in production)
      // eslint-disable-next-line no-console
      console.log("[subscription.createOrder] response:", res.data);
      return res;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[subscription.createOrder] error", e);
      throw e;
    }
  },
  // getCurrent may not exist in backend; kept for backward compatibility (will likely 404)
  getCurrent: async () =>
    fetcher.get<GetCurrentSubscriptionResponse>("/me/subscription"),
};
