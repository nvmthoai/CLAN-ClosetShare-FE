import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { outfitApi } from "@/apis/outfit.api";
import type { OutfitLegacy } from "@/models/Outfit";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildAppUrl } from "@/lib/url";
import {
  Sparkles,
  Search,
  Share2,
  ExternalLink,
  Loader2,
  Calendar,
  User as UserIcon,
  Palette,
  RefreshCcw,
  Ghost,
} from "lucide-react";
import { toast } from "react-toastify";

interface CommunityOutfit extends OutfitLegacy {
  created_at?: string;
  updated_at?: string;
  style?: string | null;
  occasion?: string | null;
  season?: string | null;
  color_theme?: string | null;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
}

const filterOptions = [
  { value: "all", label: "Tất cả" },
  { value: "complete", label: "Outfit hoàn chỉnh" },
  { value: "top", label: "Có áo" },
  { value: "bottom", label: "Có quần/váy" },
  { value: "outwear", label: "Có áo khoác" },
  { value: "accessories", label: "Có phụ kiện" },
];

const sortOptions = [
  { value: "latest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "name", label: "Tên A-Z" },
];

const emptyMessage = "Chưa có outfit nào phù hợp với bộ lọc hiện tại. Hãy thử thay đổi tiêu chí!";

const extractOutfits = (payload: any): CommunityOutfit[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.outfits)) return payload.outfits;
  return [];
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "";
  }
};

const getPreviewImages = (outfit: CommunityOutfit) => {
  const sources = [
    outfit.top?.image,
    outfit.outwear?.image,
    outfit.bottom?.image,
    outfit.accessories?.[0]?.image,
  ].filter(Boolean) as string[];

  const primary = sources[0] ?? null;
  const secondary: Array<string | null> = [
    sources[1] ?? null,
    sources[2] ?? null,
    sources[3] ?? null,
  ];

  return {
    primary,
    secondary,
  };
};

const GhostPlaceholder = ({ size }: { size: "large" | "small" }) => (
  <div
    className={cn(
      "relative flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-400",
      size === "large" ? "h-52 w-full" : "w-full h-full"
    )}
  >
    <Ghost className={size === "large" ? "w-12 h-12" : "w-6 h-6"} />
    {size === "large" && (
      <span className="absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full bg-white/85 text-gray-500 shadow-sm">
        Đang cập nhật
      </span>
    )}
  </div>
);

export default function OutfitExplore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("latest");
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const limit = 10;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["public-outfits", limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      outfitApi.getPublicOutfits({
        page: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage, pages) => {
      const items = extractOutfits(lastPage?.data ?? lastPage);
      if (!items || items.length < limit) return undefined;
      return pages.length + 1;
    },
  });

  const outfits = useMemo(() => {
    if (!data?.pages) return [] as CommunityOutfit[];
    return data.pages.flatMap((page) => extractOutfits(page?.data ?? page));
  }, [data]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchNextPage();
          }
        });
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const filteredOutfits = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    let result = Array.isArray(outfits) ? [...outfits] : [];

    if (normalizedSearch) {
      result = result.filter((outfit) =>
        outfit.name?.toLowerCase().includes(normalizedSearch) ||
        outfit.user_id?.toLowerCase().includes(normalizedSearch)
      );
    }

    result = result.filter((outfit) => {
      switch (filter) {
        case "complete":
          return Boolean(outfit.top && outfit.bottom && outfit.outwear);
        case "top":
          return Boolean(outfit.top);
        case "bottom":
          return Boolean(outfit.bottom);
        case "outwear":
          return Boolean(outfit.outwear);
        case "accessories":
          return (outfit.accessories?.length ?? 0) > 0;
        default:
          return true;
      }
    });

    result.sort((a, b) => {
      if (sort === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }

      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

      if (sort === "oldest") {
        return dateA - dateB;
      }

      // default latest
      return dateB - dateA;
    });

    return result;
  }, [outfits, searchTerm, filter, sort]);

  const stats = useMemo(() => {
    const total = outfits.length;
    const completed = outfits.filter((item) => item.top && item.bottom && item.outwear).length;
    const accessorieLovers = outfits.filter((item) => (item.accessories?.length ?? 0) >= 2).length;

    return {
      total,
      completed,
      accessoryHeavy: accessorieLovers,
    };
  }, [outfits]);

  const handleCopyLink = async (outfitId: string) => {
    if (copyingId) return;
    try {
      setCopyingId(outfitId);
      const shareUrl = buildAppUrl(`/outfits/${outfitId}`);
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Đã sao chép liên kết outfit!");
    } catch (error) {
      console.error("Copy outfit link error", error);
      toast.error("Không thể sao chép liên kết. Vui lòng thử lại.");
    } finally {
      setCopyingId(null);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white px-8 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_rgba(255,255,255,0))]" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              Khám phá Outfit Cộng đồng
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Lấy cảm hứng phối đồ từ cộng đồng ClosetShare
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              Duyệt qua các outfit được mix & match từ những fashionista khác. Học hỏi cách phối màu, lựa chọn chất liệu và tích hợp phụ kiện để nâng cấp phong cách riêng của bạn.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="rounded-2xl bg-white/10 backdrop-blur px-5 py-3">
                <p className="uppercase text-xs text-white/60">Tổng outfit</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur px-5 py-3">
                <p className="uppercase text-xs text-white/60">Outfit hoàn chỉnh</p>
                <p className="text-2xl font-semibold">{stats.completed}</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur px-5 py-3">
                <p className="uppercase text-xs text-white/60">Yêu phụ kiện</p>
                <p className="text-2xl font-semibold">{stats.accessoryHeavy}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-xl">
            <div className="relative rounded-[32px] bg-white/10 backdrop-blur p-6 shadow-2xl border border-white/30">
              <div className="absolute -top-6 right-10 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 rounded-2xl overflow-hidden bg-white/10 border border-white/20 h-44">
                  <div className="w-full h-full bg-gradient-to-br from-white/80 to-transparent flex flex-col justify-end p-4 text-blue-900">
                    <p className="text-sm font-semibold">Outfit Highstreet</p>
                    <p className="text-xs">Vintage denim • Moto jacket • Silver hoops</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/15 border border-white/20 p-4 h-32 flex flex-col justify-between">
                  <span className="text-xs text-white/70">Tone màu</span>
                  <p className="text-sm font-semibold">Pastel Urban</p>
                </div>
                <div className="rounded-2xl bg-white/15 border border-white/20 p-4 h-32 flex flex-col justify-between">
                  <span className="text-xs text-white/70">Phù hợp</span>
                  <p className="text-sm font-semibold">Đi chơi cuối tuần</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên outfit hoặc người tạo..."
              className="pl-12 py-6 text-sm rounded-2xl border-gray-200"
            />
            {isFetching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-purple-500" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              className="rounded-2xl border-gray-200"
              onClick={() => {
                setFilter("all");
                setSort("latest");
                setSearchTerm("");
                refetch();
              }}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />Làm mới
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "px-4 py-2 text-sm rounded-full border transition-all",
                filter === option.value
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow-lg shadow-purple-300/40"
                  : "border-gray-200 text-gray-600 hover:border-purple-400"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse space-y-4"
              >
                <div className="h-48 bg-gray-100 rounded-2xl" />
                <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                <div className="h-12 bg-gray-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center space-y-4">
            <h3 className="text-lg font-semibold text-red-600">
              Không thể tải dữ liệu outfit
            </h3>
            <p className="text-sm text-red-500">
              Đã có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng kiểm tra lại mạng hoặc thử tải lại sau.
            </p>
            <Button onClick={() => refetch()} className="bg-red-500 hover:bg-red-600">
              Thử lại
            </Button>
          </div>
        ) : filteredOutfits.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center space-y-4">
            <Sparkles className="w-10 h-10 mx-auto text-purple-400" />
            <h3 className="text-xl font-semibold text-gray-800">Không tìm thấy outfit phù hợp</h3>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOutfits.map((outfit) => {
              const preview = getPreviewImages(outfit);
              const accessoryCount = outfit.accessories?.length ?? 0;

              return (
                <Card
                  key={outfit.id}
                  className="group border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <div className="grid grid-cols-[2fr_1fr] gap-3 p-4">
                      <div className="rounded-2xl overflow-hidden bg-gray-100">
                        {preview.primary ? (
                          <img
                            src={preview.primary}
                            alt={outfit.name || "Outfit preview"}
                            className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <GhostPlaceholder size="large" />
                        )}
                      </div>
                      <div className="grid grid-rows-3 gap-3">
                        {preview.secondary.map((image, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl overflow-hidden bg-gray-100 h-24"
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={`Item ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <GhostPlaceholder size="small" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 flex gap-2">
                      {outfit.style && (
                        <Badge className="bg-white/90 text-purple-600 border border-purple-200">
                          {outfit.style}
                        </Badge>
                      )}
                      {outfit.color_theme && (
                        <Badge className="bg-white/90 text-blue-600 border border-blue-200 flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          {outfit.color_theme}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                        <img
                          src={
                            outfit.user?.avatar ||
                            (outfit.user?.name || outfit.user?.email
                              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  outfit.user?.name || outfit.user?.email || "U"
                                )}`
                              : "https://ui-avatars.com/api/?name=U")
                          }
                          alt={outfit.user?.name || outfit.user?.email || "Người tạo"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {outfit.user?.name || outfit.user?.email || "Ẩn danh"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {outfit.user_id?.slice(0, 8) || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {outfit.name || "Outfit không tên"}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <UserIcon className="w-4 h-4" />
                          <span>
                            Người tạo: {outfit.user?.name || outfit.user?.email || "Ẩn danh"}
                          </span>
                        </p>
                      </div>
                      {outfit.created_at && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {formatDate(outfit.created_at)}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
                        <p className="text-gray-500">Áo</p>
                        <p className="font-medium text-gray-800 truncate">{outfit.top?.name || "Chưa có"}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
                        <p className="text-gray-500">Quần/Váy</p>
                        <p className="font-medium text-gray-800 truncate">{outfit.bottom?.name || "Chưa có"}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
                        <p className="text-gray-500">Áo khoác</p>
                        <p className="font-medium text-gray-800 truncate">{outfit.outwear?.name || "Chưa có"}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
                        <p className="text-gray-500">Phụ kiện</p>
                        <p className="font-medium text-gray-800 truncate">
                          {accessoryCount > 0 ? `${accessoryCount} món` : "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {filter !== "complete" && outfit.top && outfit.bottom && outfit.outwear && (
                          <Badge className="bg-blue-100 text-blue-600">Full set</Badge>
                        )}
                        {(outfit.accessories?.length ?? 0) >= 2 && (
                          <Badge className="bg-purple-100 text-purple-600">Nhiều phụ kiện</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-full" asChild>
                          <Link to={`/outfits/${outfit.id}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />Xem chi tiết
                          </Link>
                        </Button>
                        <Button
                          className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                          onClick={() => handleCopyLink(outfit.id)}
                          disabled={copyingId === outfit.id}
                        >
                          {copyingId === outfit.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Share2 className="w-4 h-4 mr-2" />Chia sẻ
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Đang tải thêm...
          </div>
        )}
      </div>
    </div>
  );
}
