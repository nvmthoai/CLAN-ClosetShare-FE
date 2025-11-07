import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { outfitApi } from "@/apis/outfit.api";
import { Badge } from "@/components/ui/badge";
import { Shirt, Sparkles, ArrowLeft, Calendar, Palette, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function ViewOutfitPublic() {
  const { id } = useParams<{ id: string }>();

  const { data: outfitDetail, isLoading, isError } = useQuery({
    queryKey: ["outfit", "public", id],
    queryFn: () => outfitApi.getById(id!),
    select: (res: any) => {
      const responseData = res.data;
      if (responseData && typeof responseData === 'object' && 'id' in responseData) {
        return responseData;
      }
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data;
      }
      return responseData;
    },
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải outfit...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !outfitDetail) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy outfit</h2>
            <p className="text-gray-600 mb-6">
              Outfit này không tồn tại hoặc đã bị xóa
            </p>
            <Link
              to="/outfits/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const creator = outfitDetail.user;
  const creatorName = creator?.name || creator?.email || "Ẩn danh";
  const creatorAvatar =
    creator?.avatar ||
    (creatorName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}` : "https://ui-avatars.com/api/?name=U");
  const creatorEmail = creator?.email;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/outfits/explore"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại khám phá</span>
            </Link>
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200 bg-blue-50">
                  <img src={creatorAvatar} alt={creatorName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{outfitDetail.name || "Outfit không tên"}</h1>
                  <p className="text-sm text-gray-500">
                    Được chia sẻ bởi <span className="font-semibold text-gray-700">{creatorName}</span>
                    {creatorEmail && <span className="ml-2 text-gray-400">({creatorEmail})</span>}
                  </p>
                  {outfitDetail.created_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Ngày tạo: {new Date(outfitDetail.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Badge className="bg-blue-100 text-blue-600">Outfit công khai</Badge>
                {creator?.id && <span>ID người tạo: {creator.id.slice(0, 8)}...</span>}
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin người tạo</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
                  <img src={creatorAvatar} alt={creatorName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{creatorName}</p>
                  {creatorEmail && <p className="text-xs text-gray-500">{creatorEmail}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Đã chia sẻ vào {new Date(outfitDetail.created_at ?? Date.now()).toLocaleDateString("vi-VN")}</span>
                </div>
                {outfitDetail.style && (
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-500" />
                    <span>Phong cách: {outfitDetail.style}</span>
                  </div>
                )}
                {outfitDetail.occasion && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span>Dịp: {outfitDetail.occasion}</span>
                  </div>
                )}
                {outfitDetail.season && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>Mùa: {outfitDetail.season}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-100 rounded-2xl p-6 flex flex-col gap-3 text-sm text-gray-700">
              <h3 className="text-base font-semibold text-blue-900">Thông tin Outfit</h3>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-500" />
                <span>Tông màu: {outfitDetail.color_theme || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Số phụ kiện: {outfitDetail.accessories?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Cập nhật lần cuối: {new Date(outfitDetail.updated_at ?? outfitDetail.created_at ?? Date.now()).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>

          {/* Outfit Items Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Top */}
            {outfitDetail.top ? (
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg group">
                <img
                  src={outfitDetail.top.image}
                  alt={outfitDetail.top.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 bg-blue-500 text-white">
                      Áo
                    </Badge>
                    <h3 className="text-white font-bold text-lg">{outfitDetail.top.name}</h3>
                    <p className="text-white/80 text-sm mt-1">TOPS</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                <Shirt className="w-16 h-16 text-gray-300 mb-2" />
                <p className="text-gray-400 font-medium">Chưa có áo</p>
                <Badge className="mt-2 bg-gray-200 text-gray-600">TOPS</Badge>
              </div>
            )}

            {/* Bottom */}
            {outfitDetail.bottom ? (
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg group">
                <img
                  src={outfitDetail.bottom.image}
                  alt={outfitDetail.bottom.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 bg-green-500 text-white">
                      Quần
                    </Badge>
                    <h3 className="text-white font-bold text-lg">{outfitDetail.bottom.name}</h3>
                    <p className="text-white/80 text-sm mt-1">BOTTOMS</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                <Shirt className="w-16 h-16 text-gray-300 mb-2" />
                <p className="text-gray-400 font-medium">Chưa có quần</p>
                <Badge className="mt-2 bg-gray-200 text-gray-600">BOTTOMS</Badge>
              </div>
            )}

            {/* Outwear */}
            {outfitDetail.outwear ? (
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg group">
                <img
                  src={outfitDetail.outwear.image}
                  alt={outfitDetail.outwear.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 bg-purple-500 text-white">
                      Áo khoác
                    </Badge>
                    <h3 className="text-white font-bold text-lg">{outfitDetail.outwear.name}</h3>
                    <p className="text-white/80 text-sm mt-1">OUTWEAR</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                <Shirt className="w-16 h-16 text-gray-300 mb-2" />
                <p className="text-gray-400 font-medium">Chưa có áo khoác</p>
                <Badge className="mt-2 bg-gray-200 text-gray-600">OUTWEAR</Badge>
              </div>
            )}

            {/* Accessories */}
            {outfitDetail.accessories && outfitDetail.accessories.length > 0 ? (
              <div className="relative aspect-square rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
                  {outfitDetail.accessories.map((acc: any, idx: number) => (
                    <div key={acc.id || idx} className="relative overflow-hidden rounded-lg">
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white font-medium truncate">{acc.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-yellow-500 text-white">
                    {outfitDetail.accessories.length} phụ kiện
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
                <Sparkles className="w-16 h-16 text-gray-300 mb-2" />
                <p className="text-gray-400 font-medium">Chưa có phụ kiện</p>
                <Badge className="mt-2 bg-gray-200 text-gray-600">ACCESSORIES</Badge>
              </div>
            )}
          </div>

          {/* Accessories Detail List */}
          {outfitDetail.accessories && outfitDetail.accessories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Phụ kiện ({outfitDetail.accessories.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {outfitDetail.accessories.map((acc: any, idx: number) => (
                  <div
                    key={acc.id || idx}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-md group hover:shadow-lg transition-all"
                  >
                    <img
                      src={acc.image}
                      alt={acc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-medium text-sm truncate">{acc.name}</p>
                        <Badge className="mt-1 text-xs bg-yellow-500 text-white">ACCESSORIES</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Yêu thích outfit này?</h2>
            <p className="text-blue-100 mb-6">Đăng ký tài khoản để tạo và chia sẻ outfit của riêng bạn</p>
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold shadow-lg"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

