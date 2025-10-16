import { Link, NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import { shopApi } from "@/apis/shop.api";
import { toast } from "react-toastify";
import {
  Home,
  PlusSquare,
  Heart,
  Menu,
  X,
  ShoppingBag,
  Camera,
  BadgeDollarSign,
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
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem("access_token"));
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    select: (res) =>
      res.data as { name?: string; email?: string; avatarUrl?: string },
    staleTime: 60_000,
    enabled: hasToken, // Only fetch if we have a token
    retry: false, // Don't retry on failure to prevent multiple 401s
  });

  const createShopMutation = useMutation({
    mutationFn: () => shopApi.create(shopForm),
    onSuccess: (res) => {
      const id = (res.data as any)?.id;
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    // { to: "/search", icon: Search, label: "Search" },
    { to: "/shop", icon: ShoppingBag, label: "Shop" },
    { to: "/subscriptions", icon: BadgeDollarSign, label: "Plans" },
    { to: "/create", icon: PlusSquare, label: "Create" },
    { to: "/activity", icon: Heart, label: "Activity" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-purple-600 text-white px-3 py-1 rounded"
      >
        Skip to content
      </a>
      <header className="h-16 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-full gap-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md border text-gray-600 hover:bg-gray-100"
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
              className="flex items-center gap-2 font-bold text-lg tracking-tight"
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm shadow">
                <Camera className="w-4 h-4" />
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                ClosetShare
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 text-sm">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "relative font-medium text-gray-600 hover:text-purple-600 transition flex items-center gap-2",
                    isActive &&
                      "text-purple-600 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-purple-600 after:to-pink-600"
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
              <input
                placeholder="Search items"
                className="w-64 text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70"
              />
            </div>
            <button className="relative text-sm p-2 rounded-full hover:bg-purple-50">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1 rounded">
                9+
              </span>
            </button>
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-purple-50"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <img
                  src={
                    me?.avatarUrl ||
                    (me?.name || me?.email
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          me?.name || me?.email || "U"
                        )}`
                      : "https://ui-avatars.com/api/?name=U")
                  }
                  alt={me?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden sm:block text-sm font-medium max-w-[140px] truncate">
                  {me?.name || me?.email || "User"}
                </span>
                <span className="text-xs">▾</span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-lg z-50"
                >
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    View profile
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile/shops");
                    }}
                  >
                    Manage shops
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/products");
                    }}
                  >
                    Manage products
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile/edit");
                    }}
                  >
                    Update info
                  </button>
                  {!shopId && (
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowCreateShop(true);
                      }}
                    >
                      Create shop
                    </button>
                  )}
                  {shopId && (
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(`/view-shop/${shopId}`);
                      }}
                    >
                      View my shop
                    </button>
                  )}
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur px-4 py-4 space-y-3 animate-in slide-in-from-top">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 text-sm font-medium px-2 py-1 rounded hover:bg-purple-50",
                    isActive && "text-purple-600"
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
      <footer className="border-t py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} ClosetShare. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-xs">
              <button
                onClick={() => navigate("/policy")}
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                Chính sách
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => navigate("/terms")}
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                Điều khoản
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">support@closetshare.vn</span>
            </div>
          </div>
        </div>
      </footer>

      {showCreateShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tạo Shop</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowCreateShop(false)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 font-medium">Tên *</label>
                <input
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={shopForm.name}
                  onChange={(e) =>
                    setShopForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Ví dụ: Cửa hàng Vintage"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Mô tả</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={shopForm.description}
                  onChange={(e) =>
                    setShopForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Mô tả ngắn về shop"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium">Địa chỉ</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={shopForm.address}
                    onChange={(e) =>
                      setShopForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">SĐT</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={shopForm.phone_number}
                    onChange={(e) =>
                      setShopForm((f) => ({
                        ...f,
                        phone_number: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={shopForm.email}
                  onChange={(e) =>
                    setShopForm((f) => ({ ...f, email: e.target.value }))
                  }
                  type="email"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
                onClick={() => setShowCreateShop(false)}
                disabled={createShopMutation.isPending}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
                disabled={!shopForm.name || createShopMutation.isPending}
                onClick={() => createShopMutation.mutate()}
              >
                {createShopMutation.isPending ? "Đang lưu..." : "Tạo"}
              </button>
            </div>
            <p className="text-[11px] text-gray-500">
              Sau khi tạo, shop cần được xác minh trước khi hiển thị công khai.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
