import { Link, NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import { shopApi } from "@/apis/shop.api";
import { getUserId } from "@/lib/user";
import { toast } from "react-toastify";
import { isAuthenticated, clearTokens } from "@/lib/token";
import ChatBot from "@/components/chat/ChatBot";
import {
  Home,
  Menu,
  X,
  ShoppingBag,
  BadgeDollarSign,
  Search,
  User,
  Settings,
  Store,
  Package,
  LogOut,
  Sparkles,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export default function Layout({ children, sidebar }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCreateShop, setShowCreateShop] = useState(false);
  const [shopId, setShopId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("shop_id") : null
  );
  const [shopForm, setShopForm] = useState({
    name: "",
    description: "",
    address: "",
    phone_number: "",
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const hasToken = isAuthenticated();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: meResp, isFetched: meFetched } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    // Keep the full response so different consumers don't get differing selects.
    staleTime: 60_000,
    enabled: hasToken, // Only fetch if we have a token
    retry: false, // Don't retry on failure to prevent multiple 401s
  });

  // Normalize the user object from response: backend returns { user: { ... } }
  const me =
    (meResp?.data?.user as {
      name?: string;
      email?: string;
      avatar?: string;
      avatarUrl?: string;
      shopCreated?: boolean;
    }) || undefined;

  // Optionally fetch shop by user id so we can hide Create Shop immediately when a shop exists.
  const userId = getUserId();
  const { data: shopByUserResp } = useQuery({
    queryKey: ["shop-by-user", userId],
    queryFn: () => (userId ? shopApi.getByUser(userId) : Promise.resolve(null)),
    // backend returns { shop: { ... }, products: ... }
    select: (res: any) => res?.data?.shop || null,
    enabled: !!userId && hasToken,
    staleTime: 60_000,
    retry: false,
  });

  const shopExistsForUser = !!(shopByUserResp && shopByUserResp.id);

  // Determine whether the current user is allowed to create a shop.
  // Some APIs return `shopCreated: true` on the user object after creating a shop.
  // Respect that flag (or an existing `shop_id` in localStorage) to hide the "Tạo shop" action.
  // Also check localStorage as a fallback: some login flows persist `user_data`.
  let storedShopCreated = false;
  try {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      storedShopCreated =
        parsed?.shopCreated === true || parsed?.user?.shopCreated === true;
    }
  } catch (e) {
    // ignore parse errors
  }

  // Final decision: hide Create Shop if we have a shop id, if a shop exists for the user
  // (queried via /shops/user/:userId), or if either the fetched user object or persisted
  // user data indicate `shopCreated: true`.
  const canCreateShop = !shopId &&
    !(
      (me as any)?.shopCreated === true ||
      storedShopCreated ||
      shopExistsForUser
    );

  const createShopMutation = useMutation({
    mutationFn: () => shopApi.create(shopForm),
    onSuccess: (res) => {
      // Save returned shop id (if any) and update local state
      const id = res?.data?.id as string | undefined;
      if (id) {
        localStorage.setItem("shop_id", id);
        setShopId(id);
      }
      toast.success("Tạo shop thành công (đang chờ xác minh)");
      setShowCreateShop(false);
      setShopForm({
        name: "",
        description: "",
        address: "",
        phone_number: "",
        email: "",
      });
    },
    onError: (err: any) => {
      if (err?.response?.status === 401) {
        toast.warning("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        logout();
        return;
      }
      toast.error("Tạo shop thất bại");
    },
  });

  const logout = () => {
    clearTokens();
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  // Debugging: log user/shop state when the menu opens to help diagnose
  // why the "Tạo shop" button may still render.
  useEffect(() => {
    if (!menuOpen) return;
    // eslint-disable-next-line no-console
    console.debug(
      "[Layout] menuOpen: showing menu. me:",
      me,
      "meFetched:",
      meFetched,
      "shopId:",
      shopId,
      "storedShopCreated:",
      // recompute stored flag for clearer runtime debugging
      (() => {
        try {
          const s =
            typeof window !== "undefined"
              ? localStorage.getItem("user_data")
              : null;
          if (s) {
            const p = JSON.parse(s);
            return p?.shopCreated === true || p?.user?.shopCreated === true;
          }
        } catch (e) {
          /* ignore */
        }
        return false;
      })(),
      "canCreateShop:",
      canCreateShop
    );
  }, [menuOpen, me, meFetched, shopId, canCreateShop]);

  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/shop", icon: ShoppingBag, label: "Shop" },
    { to: "/outfits/explore", icon: Sparkles, label: "Outfits" },
    { to: "/subscriptions", icon: BadgeDollarSign, label: "Plans" },
  ];

  const debouncedSearchTerm = useMemo(() => searchTerm.trim(), [searchTerm]);

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["search-users", debouncedSearchTerm],
    queryFn: () =>
      userApi.searchUsers({
        page: 1,
        limit: 10,
        search: debouncedSearchTerm,
      }),
    enabled: hasToken && debouncedSearchTerm.length > 0,
    select: (res) => res.data,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!showSearchResults) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showSearchResults]);

  useEffect(() => {
    if (debouncedSearchTerm.length === 0) {
      setShowSearchResults(false);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50/20 to-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Skip to content
      </a>
      <header className="h-16 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-full gap-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md border border-gray-200 text-gray-900 hover:bg-blue-50 hover:text-blue-500 transition-colors"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <Link
              to="/home"
              className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              <img src="/combine_logo.png" className="h-12 w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 text-sm">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "relative font-medium text-gray-900 hover:text-blue-500 transition-colors flex items-center gap-2",
                    isActive &&
                      "text-blue-500 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-blue-500"
                  )
                }
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4 relative">
            <div className="hidden md:flex items-center gap-2">
              <div className="relative" ref={searchContainerRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(true);
                  }}
                  placeholder="Tìm kiếm người dùng..."
                  className="w-64 text-sm border border-gray-200 rounded-xl px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 transition-all"
                />
                {showSearchResults && debouncedSearchTerm.length > 0 && (
                  <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                      {isSearching
                        ? "Đang tìm kiếm..."
                        : `Kết quả cho "${debouncedSearchTerm}"`}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {isSearching ? (
                        <div className="px-4 py-6 text-sm text-gray-500 text-center">
                          Đang tải người dùng...
                        </div>
                      ) : (searchResults?.data || searchResults)?.length ? (
                        (searchResults?.data || searchResults).map(
                          (user: any) => (
                            <button
                              key={user.id}
                              onClick={() => {
                                setShowSearchResults(false);
                                setSearchTerm("");
                                navigate(`/profile/${user.id}`);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors"
                            >
                              <img
                                src={
                                  user.avatar ||
                                  user.avatarUrl ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user.name ||
                                      user.email ||
                                      user.username ||
                                      "U"
                                  )}`
                                }
                                alt={user.name || user.email || "User"}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {user.name || user.username || user.email}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {user.email || "Không có email"}
                                </div>
                              </div>
                            </button>
                          )
                        )
                      ) : (
                        <div className="px-4 py-6 text-sm text-gray-500 text-center">
                          Không tìm thấy người dùng phù hợp
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <img
                  src={
                    me?.avatar ||
                    me?.avatarUrl ||
                    (me?.name || me?.email
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          me?.name || me?.email || "U"
                        )}`
                      : "https://ui-avatars.com/api/?name=U")
                  }
                  alt={me?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-900 max-w-[140px] truncate">
                  {me?.name || me?.email || "User"}
                </span>
                <span className="text-xs text-gray-600">▾</span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <User className="w-4 h-4" />
                      Xem hồ sơ
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile/shops");
                      }}
                    >
                      <Store className="w-4 h-4" />
                      Quản lý shop
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/products");
                      }}
                    >
                      <Package className="w-4 h-4" />
                      Quản lý sản phẩm
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile/edit");
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Cập nhật thông tin
                    </button>
                    {canCreateShop && (
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition-colors flex items-center gap-2"
                        onClick={() => {
                          setMenuOpen(false);
                          setShowCreateShop(true);
                        }}
                      >
                        <Store className="w-4 h-4" />
                        Tạo shop
                      </button>
                    )}
                    {shopId && (
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition-colors flex items-center gap-2"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(`/view-shop/${shopId}`);
                        }}
                      >
                        <Store className="w-4 h-4" />
                        Xem shop của tôi
                      </button>
                    )}
                  </div>
                  <div className="border-t border-gray-200 p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur px-4 py-4 space-y-2">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors",
                    isActive ? "text-blue-500 bg-blue-50" : "text-gray-900"
                  )
                }
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main
        id="main"
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6"
      >
        {sidebar && (
          <aside className="w-60 shrink-0 hidden lg:block self-start sticky top-24">
            {sidebar}
          </aside>
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </main>

      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/combine_logo_1.png"
                alt="CLOSETSHARE"
                className="h-8 w-auto"
              />
              <span className="text-xs text-gray-600">
                © {new Date().getFullYear()} ClosetShare. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <button
                onClick={() => navigate("/policy")}
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                Chính sách
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => navigate("/terms")}
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                Điều khoản
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">support@closetshare.vn</span>
            </div>
          </div>
        </div>
      </footer>

      {showCreateShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Tạo Shop</h2>
              <button
                className="text-gray-500 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowCreateShop(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block mb-2 font-medium text-gray-900">
                  Tên shop *
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={shopForm.name}
                  onChange={(e) =>
                    setShopForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Ví dụ: Cửa hàng Vintage"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-900">
                  Mô tả
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={shopForm.description}
                  onChange={(e) =>
                    setShopForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Mô tả ngắn về shop"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-2 font-medium text-gray-900">
                    Địa chỉ
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={shopForm.address}
                    onChange={(e) =>
                      setShopForm((f) => ({ ...f, address: e.target.value }))
                    }
                    placeholder="Địa chỉ"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-900">
                    Số điện thoại
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={shopForm.phone_number}
                    onChange={(e) =>
                      setShopForm((f) => ({
                        ...f,
                        phone_number: e.target.value,
                      }))
                    }
                    placeholder="SĐT"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-900">
                  Email
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={shopForm.email}
                  onChange={(e) =>
                    setShopForm((f) => ({ ...f, email: e.target.value }))
                  }
                  type="email"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-5 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors font-medium"
                onClick={() => setShowCreateShop(false)}
                disabled={createShopMutation.isPending}
              >
                Hủy
              </button>
              <button
                className="px-5 py-2.5 text-sm rounded-xl bg-gray-900 text-white hover:bg-blue-500 transition-all duration-200 disabled:opacity-60 font-medium shadow-lg hover:shadow-blue-200"
                disabled={!shopForm.name || createShopMutation.isPending}
                onClick={() => createShopMutation.mutate()}
              >
                {createShopMutation.isPending ? "Đang lưu..." : "Tạo shop"}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Sau khi tạo, shop cần được xác minh trước khi hiển thị công khai.
            </p>
          </div>
        </div>
      )}

      {/* ChatBot is mounted per-page when needed. Removed global mount to avoid duplicate widgets. */}
      {/* Global chat widget (floating). Mount when user is authenticated so it appears across screens. */}
      {hasToken && <ChatBot />}
    </div>
  );
}
