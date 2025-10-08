import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { subscriptionApi } from "@/apis/subscription.api";
import { userApi } from "@/apis/user.api";
import type { CurrentSubscription } from "@/models/CurrentSubscription";
import type { Subscription } from "@/models/Subscription";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function Subscriptions() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionApi.getAll(),
    select: (res) =>
      (Array.isArray(res.data)
        ? res.data
        : (res.data as any).data) as Subscription[],
  });

  const { data: currentSubRes, refetch: refetchCurrent } = useQuery({
    queryKey: ["me-for-subscription"],
    queryFn: () => userApi.getMe(),
    select: (res) => {
      const u = res.data as any;
      // Expect fields: subscription_plan_id, subscription_plan_start_date, subscription_plan_end_date
      if (!u || !u.subscription_plan_id) return null;
      const planName = u.subscription_plan_name || u.subscription_plan_id;
      const status = deriveSubscriptionStatus(u);
      const cs: CurrentSubscription = {
        subscription_plan_id: u.subscription_plan_id,
        plan_name: planName,
        status,
        started_at: u.subscription_plan_start_date,
        expires_at: u.subscription_plan_end_date,
      };
      return cs;
    },
  });

  function deriveSubscriptionStatus(u: any): string {
    const now = Date.now();
    const start = u.subscription_plan_start_date
      ? Date.parse(u.subscription_plan_start_date)
      : null;
    const end = u.subscription_plan_end_date
      ? Date.parse(u.subscription_plan_end_date)
      : null;
    if (end && end < now) return "expired";
    if (start && start > now) return "pending";
    if (u.subscription_plan_id) return "active";
    return "none";
  }

  const { mutate: buy, isPending } = useMutation({
    mutationFn: (id: string) => subscriptionApi.createOrder(id, "PAYOS"),
    onSuccess: (res: any) => {
      const payload = res?.data || res;
      // Save raw response globally for quick manual inspection
      // @ts-ignore
      window.__lastSubscriptionOrder = payload;

      const paymentUrl = extractPayOsUrl(payload);
      if (paymentUrl) {
        toast.success("Chuyển sang PayOS...");
        // slight delay so toast shows
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 500);
      } else {
        toast.info(
          "Không nhận được link PayOS từ server — kiểm tra payment_method hoặc response."
        );
        refetch();
        refetchCurrent();
      }
    },
    onError: (e: any) => {
      if (e?.response?.status === 401) {
        toast.error("Bạn cần đăng nhập lại");
      } else {
        toast.error("Đặt gói thất bại");
      }
    },
  });

  function extractPayOsUrl(obj: any): string | undefined {
    if (!obj || typeof obj !== "object") return undefined;
    // Direct common fields
    const direct =
      obj.payment_url ||
      obj.paymentUrl ||
      obj.checkoutUrl ||
      obj.checkout_url ||
      obj.redirectUrl ||
      obj.redirect_url;
    if (isPayOsLink(direct)) return direct;
    // Nested known container
    const pu = obj.paymentunit;
    if (pu) {
      const nested =
        pu.payment_url ||
        pu.paymentUrl ||
        pu.checkoutUrl ||
        pu.checkout_url ||
        pu.redirectUrl ||
        pu.redirect_url;
      if (isPayOsLink(nested)) return nested;
    }
    // Fallback: deep scan any string value
    try {
      const stack: any[] = [obj];
      const seen = new Set<any>();
      while (stack.length) {
        const cur = stack.pop();
        if (!cur || typeof cur !== "object" || seen.has(cur)) continue;
        seen.add(cur);
        for (const k of Object.keys(cur)) {
          const v = (cur as any)[k];
          if (typeof v === "string" && isPayOsLink(v)) return v;
          if (typeof v === "object") stack.push(v);
        }
      }
    } catch (e) {
      // ignore scan errors
    }
    return undefined;
  }

  function isPayOsLink(value: any): value is string {
    return (
      typeof value === "string" &&
      value.startsWith("http") &&
      /payos/i.test(value)
    );
  }

  const plans = data || [];

  return (
    <Layout>
      <div className="space-y-10 flex flex-col mx-auto w-full max-w-5xl p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Gói thành viên</h1>
          <p className="text-sm text-gray-600">
            Chọn gói phù hợp để trải nghiệm tốt hơn
          </p>
        </div>

        {currentSubRes && (
          <div className="mx-auto max-w-md bg-gradient-to-r from-green-50 to-emerald-50 border border-emerald-300 rounded-lg p-4 text-sm text-emerald-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-emerald-900">
                  Gói hiện tại: {currentSubRes.plan_name}
                </div>
                <div className="mt-1">
                  Trạng thái:{" "}
                  <span className="font-medium">{currentSubRes.status}</span>
                  {currentSubRes.expires_at && (
                    <>
                      {" "}
                      - Hết hạn:{" "}
                      {new Date(currentSubRes.expires_at).toLocaleDateString(
                        "vi-VN"
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {isError && (
          <div className="text-red-600">Không tải được danh sách gói.</div>
        )}
        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 bg-white animate-pulse h-40 w-full max-w-sm"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {plans.map((p) => (
              <div
                key={p.id}
                className="border rounded-xl bg-white p-5 shadow-sm w-full max-w-sm"
              >
                <div className="text-lg font-semibold">{p.name}</div>
                <div className="text-gray-600 text-sm mt-1">
                  {p.description || ""}
                </div>
                <div className="text-2xl font-extrabold text-primary mt-3">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(p.price)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {p.duration_days} ngày
                </div>
                <div className="pt-4">
                  <Button
                    className="w-full"
                    onClick={() => buy(p.id)}
                    disabled={isPending}
                  >
                    {isPending ? "Đang xử lý..." : "Mua ngay"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
