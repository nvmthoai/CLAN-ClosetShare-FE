import { Link, NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import { shopApi } from "@/apis/shop.api";
import { toast } from "react-toastify";
import { isAuthenticated, clearTokens } from "@/lib/token";
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
  const hasToken = isAuthenticated();
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
    clearTokens();
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/shop", icon: ShoppingBag, label: "Shop" },
    { to: "/subscriptions", icon: BadgeDollarSign, label: "Plans" },
  ];

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
              <img 
                src="/combine_logo.png" 
                className="h-12 w-auto"
              />
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-64 text-sm border border-gray-200 rounded-xl px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 transition-all"
                />
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
                    {!shopId && (
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
              <img src="/combine_logo.png" alt="CLOSETSHARE" className="h-8 w-auto" />
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
                <label className="block mb-2 font-medium text-gray-900">Tên shop *</label>
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
                <label className="block mb-2 font-medium text-gray-900">Mô tả</label>
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
                  <label className="block mb-2 font-medium text-gray-900">Địa chỉ</label>
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
                  <label className="block mb-2 font-medium text-gray-900">Số điện thoại</label>
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
                <label className="block mb-2 font-medium text-gray-900">Email</label>
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
    </div>
  );
}
