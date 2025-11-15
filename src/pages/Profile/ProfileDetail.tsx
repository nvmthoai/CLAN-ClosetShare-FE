import Layout from "@/components/layout/Layout";
import { userApi } from "@/apis/user.api";
import type { User } from "@/models/User";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, User as UserIcon, CalendarDays } from "lucide-react";

interface ApiResponse {
  data?: User | User[];
  [key: string]: unknown;
}

function normalizeUser(data?: ApiResponse["data"]): User | null {
  if (!data) return null;
  if (Array.isArray(data)) {
    return (data[0] as User) ?? null;
  }
  return data as User;
}

export default function ProfileDetail() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: async () => {
      if (!id) throw new Error("Không tìm thấy người dùng");
      const res = await userApi.getUserById(id);
      const payload =
        (res.data as ApiResponse).data ?? (res.data as ApiResponse["data"]);
      return normalizeUser(payload);
    },
    enabled: Boolean(id),
  });

  const user = data;
  const formatDate = (value?: string) => {
    if (!value) return null;
    try {
      return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
    } catch (err) {
      return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/20 to-white">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 text-sm">Đang tải hồ sơ người dùng...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/20 to-white">
          <div className="text-center max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-4">
            <div className="text-3xl">😔</div>
            <h2 className="text-lg font-semibold text-gray-900">Không tìm thấy người dùng</h2>
            <p className="text-sm text-gray-600">
              {error instanceof Error ? error.message : "Vui lòng thử lại sau hoặc kiểm tra liên kết."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const createdAt = formatDate(user.created_at || user.createdAt);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 sm:px-10 py-12 text-center">
              <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
              <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <img
                  src={
                    user.avatar ||
                    user.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || user.username || user.email || "U"
                    )}`
                  }
                  alt={user.name || user.username || "Avatar"}
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-2xl"
                />
                <div className="text-white text-center space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">{user.name || user.username || "Người dùng"}</h1>
                  {user.username && (
                    <p className="text-sm text-white/80">@{user.username}</p>
                  )}
                  {user.bio && <p className="text-sm text-white/80 max-w-xl mx-auto">{user.bio}</p>}
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <section className="px-6 sm:px-10 py-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  Thông tin cá nhân
                </h2>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
                  <div className="space-y-1">
                    <dt className="font-medium text-gray-500">Họ và tên</dt>
                    <dd className="text-gray-900">{user.name || "Chưa cập nhật"}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-medium text-gray-500">Email</dt>
                    <dd className="flex items-center gap-2 text-gray-900">
                      <Mail className="w-4 h-4 text-blue-500" />
                      {user.email || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-medium text-gray-500">Số điện thoại</dt>
                    <dd className="flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4 text-blue-500" />
                      {user.phone || user.phone_number || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-medium text-gray-500">Trạng thái</dt>
                    <dd className="text-gray-900 uppercase">{user.status || "Không rõ"}</dd>
                  </div>
                  {createdAt ? (
                    <div className="space-y-1">
                      <dt className="font-medium text-gray-500">Tham gia ngày</dt>
                      <dd className="flex items-center gap-2 text-gray-900">
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                        {createdAt}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

