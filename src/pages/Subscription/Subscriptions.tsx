import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { subscriptionApi } from "@/apis/subscription.api";
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
    queryKey: ["current-subscription"],
    queryFn: () => subscriptionApi.getCurrent(),
    select: (res) => {
      if (!res.data) return null;
      if ((res.data as any).data)
        return (res.data as any).data as CurrentSubscription | null;
      return res.data as CurrentSubscription | null;
    },
  });

  const { mutate: buy, isPending } = useMutation({
    mutationFn: (id: string) => subscriptionApi.createOrder(id),
    onSuccess: () => {
      toast.success("Đặt gói thành công! (Đang kích hoạt)");
      refetch();
      refetchCurrent();
    },
    onError: (e: any) => {
      if (e?.response?.status === 401) {
        toast.error("Bạn cần đăng nhập lại");
      } else {
        toast.error("Đặt gói thất bại");
      }
    },
  });

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
