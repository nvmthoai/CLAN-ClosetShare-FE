import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { subscriptionApi } from "@/apis/subscription.api";
import { userApi } from "@/apis/user.api";
import type { CurrentSubscription } from "@/models/CurrentSubscription";
import type { Subscription } from "@/models/Subscription";
import { toast } from "react-toastify";
import { X, Check, Crown, Sparkles, Star } from "lucide-react";

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
  const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-300";
      case "expired":
        return "bg-red-100 text-red-700 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "expired":
        return "Đã hết hạn";
      case "pending":
        return "Đang chờ";
      default:
        return status;
    }
  };

  const getPlanIcon = (index: number) => {
    const icons = [Sparkles, Crown, Star];
    return icons[index % icons.length];
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 md:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-xs uppercase tracking-wider text-white/90 mb-3">
              Gói thành viên
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Nâng cấp trải nghiệm của bạn
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Chọn gói phù hợp để khám phá thêm nhiều tính năng độc đáo và trải nghiệm tốt hơn
            </p>
          </div>
          {/* Decorative blobs */}
          <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
          <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl" />
        </section>

        {/* Current Subscription Banner */}
        {currentSubRes && (
          <section className="py-8 bg-gradient-to-br from-white via-blue-50/40 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Gói hiện tại: {currentSubRes.plan_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(currentSubRes.status)}`}>
                            {getStatusText(currentSubRes.status)}
                          </span>
                          {currentSubRes.expires_at && (
                            <span className="text-sm text-gray-600">
                              • Hết hạn: {new Date(currentSubRes.expires_at).toLocaleDateString("vi-VN")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Pricing Plans Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-white via-blue-50/40 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isError && (
              <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200 max-w-2xl mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tải được danh sách gói
                </h3>
                <p className="text-gray-600">
                  Vui lòng thử lại sau hoặc liên hệ hỗ trợ
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 animate-pulse h-96 w-full max-w-sm"
                  />
                ))}
              </div>
            ) : (
              <div className={`flex flex-wrap justify-center gap-6 md:gap-8 ${
                plans.length === 2 ? "max-w-4xl mx-auto" : ""
              }`}>
                {plans.map((p, index) => {
                  const IconComponent = getPlanIcon(index);
                  const isCurrentPlan = currentSubRes?.subscription_plan_id === p.id;
                  
                  return (
                    <div
                      key={p.id}
                      className={`group relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 transform hover:-translate-y-2 w-full ${
                        plans.length === 2 
                          ? "max-w-md flex-1 min-w-[300px]" 
                          : plans.length === 3
                          ? "max-w-sm"
                          : "max-w-sm"
                      } ${
                        isCurrentPlan
                          ? "border-blue-500 shadow-blue-200"
                          : "border-gray-100 hover:border-blue-300 hover:shadow-xl"
                      }`}
                    >
                      {/* Popular Badge */}
                      {index === 1 && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                          Phổ biến nhất
                        </div>
                      )}

                      <div className="flex flex-col h-full">
                        <div className="flex flex-col items-center text-center flex-1">
                          {/* Icon */}
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>

                          {/* Plan Name */}
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                            {p.name}
                          </h3>

                          {/* Description */}
                          <div className="text-sm text-gray-600 mb-6 min-h-[80px] flex items-center justify-center">
                            <p className="text-center leading-relaxed">
                              {p.description || "Gói phù hợp cho bạn"}
                            </p>
                          </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              maximumFractionDigits: 0,
                            }).format(p.price)}
                          </div>
                          <div className="text-sm text-gray-500">
                            / {p.duration_days} ngày
                          </div>
                        </div>

                          {/* Features */}
                          <div className="w-full space-y-3 mb-6 flex-1">
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                              <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-left">Quyền truy cập đầy đủ</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                              <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-left">Hỗ trợ 24/7</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                              <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-left">Cập nhật tính năng mới</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => {
                            setSelectedPlan(p);
                            setShowConfirm(true);
                          }}
                          disabled={isPending || isCurrentPlan}
                          className={`w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg mt-auto ${
                            isCurrentPlan
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-gray-900 text-white hover:bg-blue-500 hover:shadow-blue-200 transform hover:scale-105"
                          } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
                        >
                          {isCurrentPlan
                            ? "Gói hiện tại"
                            : isPending
                            ? "Đang xử lý..."
                            : "Chọn gói này"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Confirm Modal */}
      {showConfirm && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Xác nhận mua gói</h3>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedPlan(null);
                }}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-sm text-gray-600 mb-2">Bạn sắp mua gói:</div>
              
              <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">{selectedPlan.name}</div>
                    <div className="text-sm text-gray-600">{selectedPlan.description || ""}</div>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(selectedPlan.price)}
                  </span>
                  <span className="text-sm text-gray-500">
                    / {selectedPlan.duration_days} ngày
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-200">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Bạn sẽ được chuyển đến trang thanh toán PayOS để hoàn tất giao dịch</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedPlan(null);
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (selectedPlan) {
                    buy(selectedPlan.id);
                  }
                  setShowConfirm(false);
                  setSelectedPlan(null);
                }}
                disabled={isPending}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200"
              >
                {isPending ? "Đang xử lý..." : "Xác nhận mua"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
