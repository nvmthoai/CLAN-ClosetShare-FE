import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { productApi } from "@/apis/product.api";
import type { Product, Variant } from "@/models/Product";
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
  const heroImg = product?.variants?.[0]?.images?.[0];
  const firstVariant: Variant | undefined = product?.variants?.[0];
  const price = firstVariant?.pricing?.price;

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
      } else if (e?.response?.data?.message) {
        toast.error(e.response.data.message);
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
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-lg">
              {isLoading ? (
                <div className="aspect-square flex items-center justify-center animate-pulse bg-gray-100">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : heroImg ? (
                <img src={heroImg} alt={product?.name} className="w-full h-auto" />
              ) : (
                <div className="aspect-square flex items-center justify-center text-gray-400 bg-gray-50">
                  <span className="text-lg">No image</span>
                </div>
              )}
              {/* thumbnails */}
              {product?.variants && product.variants.length > 0 && (
                <div className="p-3 grid grid-cols-6 gap-2 border-t border-gray-200 bg-gray-50">
                  {product.variants.flatMap((v, idx) =>
                    (v.images || [])
                      .slice(0, 6 - idx)
                      .map((img, i) => (
                        <img
                          key={`${v.id}-${i}`}
                          src={img}
                          className="aspect-square object-cover rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                        />
                      ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {isError && (
                <div className="text-red-600 bg-red-50 border-2 border-red-200 rounded-xl p-4 font-semibold">
                  Không tải được sản phẩm.
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product?.name || "Product"}</h1>
                <div className="text-gray-700 leading-relaxed">
                  {product?.description || "Mô tả đang cập nhật"}
                </div>
              </div>
              <div className="text-3xl font-extrabold text-blue-500">
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
                  <div className="text-sm font-semibold text-gray-900 mb-2">Biến thể</div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.slice(0, 6).map((v) => (
                      <span key={v.id} className="px-3 py-1.5 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-900 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                        {v.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-4 bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-4">Thông tin đặt hàng</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Tên người nhận"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                  <input
                    className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">Số lượng</span>
                    <input
                      type="number"
                      min={1}
                      className="w-20 border-2 border-gray-200 rounded-xl px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">Thanh toán</span>
                    <select
                      className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="BANK_TRANSFER">Chuyển khoản</option>
                      <option value="COD">COD</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onBuyNow}
                    disabled={isOrdering}
                  >
                    {isOrdering ? "Đang tạo đơn..." : "Mua ngay"}
                  </button>
                  <button className="px-6 py-3 border-2 border-gray-200 text-gray-900 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 font-semibold">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-lg">
                <h2 className="font-bold text-gray-900 mb-4">Chi tiết sản phẩm</h2>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex justify-between">
                    <span className="font-semibold text-gray-900">Loại:</span>
                    <span>{product?.type === "SALE" ? "Bán" : "Thuê"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold text-gray-900">Số biến thể:</span>
                    <span>{product?.variants?.length || 0}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
