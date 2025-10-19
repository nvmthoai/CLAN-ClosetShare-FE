import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { productApi } from "@/apis/product.api";
import type { Product, Variant } from "@/models/Product";
import { Button } from "@/components/ui/button";
import { orderApi, type CreateOrderPayload } from "@/apis/order.api";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductById(id!),
    enabled: !!id,
    select: (res) => res.data as Product,
  });

  const product = data;
  const heroImg = product?.images?.[0] || product?.variants?.[0]?.imgs?.[0];
  const firstVariant: Variant | undefined = product?.variants?.[0];
  const price = firstVariant?.pricings?.[0]?.price;

  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Chuyển khoản");

  const { mutate: createOrder, isPending: isOrdering } = useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.create(payload),
    onSuccess: () => {
      toast.success("Tạo đơn hàng thành công");
      // In real scenario redirect to payment URL (returned by backend) or show modal
    },
    onError: (e: any) => {
      if (e?.response?.status === 401) {
        toast.error("Bạn cần đăng nhập");
        navigate("/login");
      } else {
        toast.error("Tạo đơn thất bại");
      }
    },
  });

  const onBuyNow = () => {
    if (!product || !firstVariant) {
      toast.error("Thiếu dữ liệu sản phẩm/biến thể");
      return;
    }
    if (!receiverName || !phone || !address) {
      toast.warn("Điền đủ thông tin nhận hàng");
      return;
    }
    createOrder({
      receiver_name: receiverName,
      phone_number: phone,
      address,
      province_id: 0, // TODO: integrate province selection
      ward_id: 0, // TODO: integrate ward selection
      type: "SALE",
      payment_method: paymentMethod as "BANK_TRANSFER" | "COD",
      items: [
        {
          variant_id: firstVariant.id,
          quantity,
        },
      ],
    });
  };

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="aspect-square flex items-center justify-center animate-pulse bg-gray-100">
              Loading…
            </div>
          ) : heroImg ? (
            <img src={heroImg} alt={product?.name} className="w-full h-auto" />
          ) : (
            <div className="aspect-square flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {/* thumbnails */}
          {product?.variants && product.variants.length > 0 && (
            <div className="p-3 grid grid-cols-6 gap-2 border-t bg-gray-50">
              {product.variants.flatMap((v, idx) =>
                (v.imgs || [])
                  .slice(0, 6 - idx)
                  .map((img, i) => (
                    <img
                      key={`${v.id}-${i}`}
                      src={img}
                      className="aspect-square object-cover rounded border"
                    />
                  ))
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isError && (
            <div className="text-red-600">Không tải được sản phẩm.</div>
          )}
          <h1 className="text-2xl font-bold">{product?.name || "Product"}</h1>
          <div className="text-gray-600">
            {product?.description || "Mô tả đang cập nhật"}
          </div>
          <div className="text-2xl font-extrabold text-primary">
            {price
              ? new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(price)
              : "Liên hệ"}
          </div>

          {/* simple variant/size placeholder */}
          {product?.variants && product.variants.length > 0 && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Biến thể</div>
              <div className="flex flex-wrap gap-2">
                {product.variants.slice(0, 6).map((v) => (
                  <span key={v.id} className="px-2 py-1 rounded border text-sm">
                    {v.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className="border rounded px-3 py-2 text-sm"
                placeholder="Tên người nhận"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
              <input
                className="border rounded px-3 py-2 text-sm"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                className="border rounded px-3 py-2 text-sm sm:col-span-2"
                placeholder="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Số lượng</span>
                <input
                  type="number"
                  min={1}
                  className="w-20 border rounded px-2 py-1 text-sm"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Thanh toán</span>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="BANK_TRANSFER">Chuyển khoản</option>
                  <option value="COD">COD</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="bg-primary text-white"
                onClick={onBuyNow}
                disabled={isOrdering}
              >
                {isOrdering ? "Đang tạo đơn..." : "Mua ngay"}
              </Button>
              <Button variant="secondary">Thêm vào giỏ</Button>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h2 className="font-semibold mb-2">Chi tiết</h2>
            <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
              <li>Trạng thái: {product?.status || "N/A"}</li>
              <li>Loại: {product?.type || "N/A"}</li>
              <li>Shop: {product?.shop_id || "N/A"}</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
