import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { productApi } from "@/apis/product.api";
import type { Product, Variant } from "@/models/Product";
import { orderApi, type CreateOrderPayload } from "@/apis/order.api";
import { useState, useEffect, useMemo } from "react";
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
  
  // State for selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  
  // Get selected variant or default to first variant
  const selectedVariant: Variant | undefined = product?.variants?.find(
    (v) => v.id === selectedVariantId
  ) || product?.variants?.[0];
  
  // Update selected variant when product loads (set to first variant)
  useEffect(() => {
    if (product?.variants?.[0]?.id && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product?.variants, selectedVariantId]);
  
  const heroImg = selectedVariant?.images?.[0];
  const price = selectedVariant?.pricing?.price;
  const stock = selectedVariant?.stock || 0;

  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Chuyển khoản");
  
  // Chỉ hỗ trợ giao hàng tại nội thành TP.HCM (code = 79)
  const HCM_PROVINCE_CODE = 79;
  const [provinceId] = useState<number>(1); // Backend province_id
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [wardId, setWardId] = useState<number | null>(null);
  
  // Danh sách 19 quận nội thành TP.HCM (hardcoded để đảm bảo ổn định)
  // Code của các quận theo API provinces.open-api.vn
  const HCM_INNER_DISTRICTS = [
    { code: 760, name: "Quận 1" },
    { code: 761, name: "Quận 2" },
    { code: 762, name: "Quận 3" },
    { code: 763, name: "Quận 4" },
    { code: 764, name: "Quận 5" },
    { code: 765, name: "Quận 6" },
    { code: 766, name: "Quận 7" },
    { code: 767, name: "Quận 8" },
    { code: 768, name: "Quận 9" },
    { code: 769, name: "Quận 10" },
    { code: 770, name: "Quận 11" },
    { code: 771, name: "Quận 12" },
    { code: 772, name: "Quận Bình Thạnh" },
    { code: 773, name: "Quận Tân Bình" },
    { code: 774, name: "Quận Tân Phú" },
    { code: 775, name: "Quận Phú Nhuận" },
    { code: 776, name: "Quận Gò Vấp" },
    { code: 777, name: "Quận Bình Tân" },
    { code: 778, name: "Thành phố Thủ Đức" },
  ];

  // Fetch wards của district đã chọn
  // API v2 không có endpoint riêng cho district, nên dùng API v1 hoặc parse từ wards
  const { data: districtWardsData, isLoading: wardsLoading } = useQuery({
    queryKey: ["district-wards", districtId],
    queryFn: async () => {
      if (!districtId) return null;
      
      // Thử dùng API v1 để lấy district với wards
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/v1/district/${districtId}?depth=2`);
        if (res.ok) {
          const districtData = await res.json();
          console.log("District data v1:", districtData);
          // District data có thể có wards array
          if (districtData && districtData.wards && Array.isArray(districtData.wards)) {
            return districtData.wards;
          }
        }
      } catch (e) {
        console.log("v1 district API failed:", e);
      }
      
      // Fallback: Lấy tất cả wards và filter theo district code từ name
      // Hoặc dùng mapping hardcoded
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/v2/w/?province=${HCM_PROVINCE_CODE}`);
        if (res.ok) {
          const allWards = await res.json();
          if (Array.isArray(allWards)) {
            console.log("All wards sample:", allWards.slice(0, 5));
            // Wards có thể có district_code hoặc cần parse từ name
            // Tạm thời trả về để xem cấu trúc
            return allWards;
          }
        }
      } catch (e) {
        console.log("Failed to fetch wards:", e);
      }
      
      return null;
    },
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60, // Cache 1 hour
  });

  // Districts list (hardcoded)
  const districtsWithCode = HCM_INNER_DISTRICTS;

  // Extract và filter wards theo district
  const wards = useMemo(() => {
    if (!districtId || !districtWardsData) return [];
    
    // Nếu districtWardsData là array wards từ district API v1
    if (Array.isArray(districtWardsData)) {
      // Kiểm tra xem có phải wards từ district API không (đã được filter sẵn)
      // Hoặc cần filter từ allWards
      const wardsList = districtWardsData.map((w: { code: number; name: string; district_code?: number; [key: string]: unknown }) => ({
        code: w.code,
        name: w.name,
      }));
      
      // Nếu wards có district_code, filter theo đó
      if (districtWardsData.length > 0 && 'district_code' in districtWardsData[0]) {
        return wardsList.filter((w: { code: number; name: string }) => {
          const ward = districtWardsData.find((item: { code: number }) => item.code === w.code);
          return ward && (ward as { district_code?: number }).district_code === districtId;
        });
      }
      
      // Nếu không có district_code, có thể đã được filter sẵn từ API v1
      // Hoặc cần dùng mapping hardcoded
      return wardsList;
    }
    
    return [];
  }, [districtId, districtWardsData]);

  // Set first district on mount
  useEffect(() => {
    if (!districtId && districtsWithCode.length > 0) {
      setDistrictId(districtsWithCode[0].code);
    }
  }, [districtId, districtsWithCode]);

  // Set first ward when wards load
  useEffect(() => {
    if (wards.length > 0 && !wardId) {
      setWardId(wards[0].code);
    }
  }, [wards, wardId]);

  // Reset ward when district changes
  useEffect(() => {
    if (districtId) {
      setWardId(null);
    }
  }, [districtId]);
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState<string | null>(null);

  const { mutate: createOrder, isPending: isOrdering } = useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.create(payload),
    onSuccess: (res: unknown) => {
      console.log("Order creation response:", res);
      
      // Try to extract a payment URL from several possible response shapes/keys
      const r = res as { data?: unknown } | undefined;
      const responseData = (r && r.data ? r.data : r) as
        | { data?: unknown; [k: string]: unknown }
        | undefined;
      const data = ((responseData && (responseData.data as unknown)) ||
        responseData) as { [k: string]: unknown } | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyData = data as any;
      
      console.log("Extracted data:", anyData);
      console.log("paymentUrl object:", anyData?.paymentUrl);
      
      const paymentUrl =
        // Direct checkoutUrl in paymentUrl object (most common)
        anyData?.paymentUrl?.checkoutUrl ||
        anyData?.paymentUrl?.checkout_url ||
        // Flat keys
        anyData?.paymentUrl ||
        anyData?.payment_url ||
        anyData?.checkoutUrl ||
        anyData?.checkout_url ||
        anyData?.payUrl ||
        anyData?.pay_url ||
        // Other nested keys
        anyData?.paymentInfo?.checkoutUrl ||
        anyData?.paymentInfo?.checkout_url ||
        anyData?.payment?.checkoutUrl ||
        anyData?.payment?.checkout_url ||
        anyData?.payment_info?.checkoutUrl ||
        anyData?.payment_info?.checkout_url;

      console.log("Final paymentUrl:", paymentUrl);

      if (typeof paymentUrl === "string" && paymentUrl.length > 0) {
        toast.info("Chuyển đến trang thanh toán...");
        setPendingPaymentUrl(paymentUrl);
        // Use setTimeout to ensure toast is shown before redirect
        setTimeout(() => {
          try {
            // Primary redirect
            window.location.href = paymentUrl;
          } catch {
            try {
              // Fallback redirect
              window.location.assign(paymentUrl);
            } catch {
              try {
                // Last resort
                window.location.replace(paymentUrl);
              } catch {
                // As a last resort, leave a CTA button for the user
                console.error("Failed to redirect to payment page");
              }
            }
          }
        }, 500);
        return;
      }

      toast.success("Tạo đơn hàng thành công");
      console.warn("No payment URL found in response:", anyData);
      // Optionally: navigate to an order detail or orders page if no payment URL is returned
    },
    onError: (e: unknown) => {
      const err = e as { response?: { status?: number; data?: { message?: string } } };
      if (err?.response?.status === 401) {
        toast.error("Bạn cần đăng nhập");
        navigate("/login");
      } else if (err?.response?.data?.message) {
        toast.error(err.response.data.message as string);
      } else {
        toast.error("Tạo đơn thất bại");
      }
    },
  });

  const onBuyNow = () => {
    if (!product || !selectedVariant) {
      toast.error("Thiếu dữ liệu sản phẩm/biến thể");
      return;
    }
    if ((selectedVariant.stock ?? 0) <= 0) {
      toast.error("Biến thể này đã hết hàng");
      return;
    }
    if (quantity > (selectedVariant.stock ?? 0)) {
      toast.warn("Số lượng vượt quá tồn kho");
      return;
    }
    if (!selectedVariant.pricing || typeof selectedVariant.pricing.price !== "number") {
      toast.error("Sản phẩm chưa có giá bán");
      return;
    }
    if (!receiverName || !phone || !address) {
      toast.warn("Điền đủ thông tin nhận hàng");
      return;
    }
    
    if (!wardId) {
      toast.warn("Vui lòng chọn phường/xã");
      return;
    }
    
    createOrder({
      receiver_name: receiverName,
      phone_number: phone,
      address,
      province_id: provinceId,
      ward_id: wardId, // Use ward code from API
      type: "SALE",
      payment_method: (paymentMethod === "COD" ? "COD" : "BANK_TRANSFER") as "BANK_TRANSFER" | "COD",
      items: [
        {
          variant_id: selectedVariant.id,
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
              {pendingPaymentUrl && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700 mb-3">
                    Nếu không tự chuyển trang, bấm nút bên dưới để đến trang thanh toán.
                  </p>
                  <a
                    href={pendingPaymentUrl}
                    target="_self"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Đi tới trang thanh toán
                  </a>
                </div>
              )}
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

              {/* Variant selection with prices */}
              {product?.variants && product.variants.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-3">Chọn biến thể</div>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariantId === v.id;
                      const variantPrice = v.pricing?.price || 0;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`
                            px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer
                            ${isSelected
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="font-semibold text-gray-900 mb-1">{v.name}</div>
                          <div className="text-sm text-gray-600 mb-1">
                            {variantPrice > 0
                              ? new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(variantPrice)
                              : "Liên hệ"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {v.stock > 0 ? `Còn ${v.stock} sản phẩm` : "Hết hàng"}
                          </div>
                        </button>
                      );
                    })}
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
                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-900">Khu vực giao hàng: </span>
                      <span className="text-sm text-blue-600 font-medium">TP. Hồ Chí Minh (Nội thành)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 min-w-[100px]">Quận/Huyện</span>
                      <select
                        className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white disabled:opacity-50"
                        value={districtId || ""}
                        onChange={(e) => setDistrictId(Number(e.target.value))}
                        disabled={false}
                      >
                        {districtsWithCode.length > 0 ? (
                          districtsWithCode.map((d: { code: number; name: string }) => (
                            <option key={d.code} value={d.code}>
                              {d.name}
                            </option>
                          ))
                        ) : (
                          <option>Không có dữ liệu</option>
                        )}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 min-w-[100px]">Phường/Xã</span>
                      <select
                        className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white disabled:opacity-50"
                        value={wardId || ""}
                        onChange={(e) => setWardId(Number(e.target.value))}
                        disabled={!districtId || wardsLoading}
                      >
                        {wardsLoading ? (
                          <option>Đang tải...</option>
                        ) : !districtId ? (
                          <option>Vui lòng chọn quận/huyện</option>
                        ) : wards.length > 0 ? (
                          wards.map((w: { code: number; name: string }) => (
                            <option key={w.code} value={w.code}>
                              {w.name}
                            </option>
                          ))
                        ) : (
                          <option>Không có dữ liệu</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">Số lượng</span>
                    <input
                      type="number"
                      min={1}
                      max={stock}
                      className="w-20 border-2 border-gray-200 rounded-xl px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, val), stock));
                      }}
                    />
                    {stock > 0 && (
                      <span className="text-xs text-gray-500">(Tối đa: {stock})</span>
                    )}
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
