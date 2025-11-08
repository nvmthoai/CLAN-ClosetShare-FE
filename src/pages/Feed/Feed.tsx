import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCard } from "@/components/social/PostCard";
import Layout from "@/components/layout/Layout";
import type {
  Post,
  CreatePostPayload,
  UpdatePostPayload,
} from "@/models/Social";
import { postApi } from "@/apis/post.api";
import { useCallback, useState } from "react";
import { Plus, X, RefreshCw } from "lucide-react";
import { TipTapEditor } from "@/components/ui/tiptap-editor";


export default function Feed() {
  const queryClient = useQueryClient();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const {
    data: posts,
    isLoading,
    isError: postsError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await postApi.getPosts();
      const rawPosts = Array.isArray(res.data)
        ? res.data
        : res.data?.posts || [];

      const postsWithComments = await Promise.all(
        rawPosts.map(async (post) => {
          try {
            const commentsRes = await postApi.getComments(post.id);
            return {
              ...post,
              comments: commentsRes.data.comments || [],
            };
          } catch (error) {
            console.error("Failed to fetch comments for post", post.id, error);
            return {
              ...post,
              comments: [],
            };
          }
        })
      );

      return postsWithComments;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => postApi.createPost(payload),
    onSuccess: () => {
      setPostTitle("");
      setPostContent("");
      setShowCreatePost(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {},
  });

  const handleCloseCreatePost = () => {
    setPostTitle("");
    setPostContent("");
    setShowCreatePost(false);
  };

  const editPostMutation = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdatePostPayload;
    }) => postApi.updatePost(postId, payload),
    onSuccess: (data, { postId }) => {
      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return [];
        return oldPosts.map((post: Post) =>
          post.id === postId ? { ...post, ...data.data } : post
        );
      });
    },
    onError: () => {},
  });

  const handleLike = useCallback(
    (postId: string, liked: boolean, totalLikes: number) => {
      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((post: Post) =>
          post.id === postId
            ? { ...post, isLiked: liked, likes: totalLikes }
            : post
        );
      });
    },
    [queryClient]
  );

  const handleEdit = (postId: string, payload: UpdatePostPayload) => {
    editPostMutation.mutate({ postId, payload });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-90 mb-2">
                Chào mừng trở lại
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Bảng tin thời trang của bạn
              </h1>
              <p className="opacity-90 text-sm max-w-2xl">
                Những bộ trang phục và cập nhật được chọn lọc dành riêng cho bạn
              </p>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200"
            >
              <Plus className="w-4 h-4" />
              Tạo bài viết
            </button>
          </div>
          {/* Decorative blobs */}
          <span className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
          <span className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl" />
        </div>

        {/* Main grid with suggestions */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem] gap-6 items-start">
          {/* Feed */}
          <div className="space-y-6 max-w-2xl">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                Đang tải bài viết...
              </div>
            ) : postsError ? (
                  <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Lỗi tải bài viết
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Không thể tải bài viết từ server. Vui lòng thử lại sau.
                    </p>
                    <button
                      onClick={() =>
                        queryClient.invalidateQueries({ queryKey: ["posts"] })
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Thử lại
                    </button>
                  </div>
                ) : (posts?.length || 0) === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Chưa có bài viết nào
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Hãy tạo bài viết đầu tiên để chia sẻ phong cách của bạn!
                    </p>
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Tạo bài viết
                    </button>
                  </div>
            ) : (
              (posts || []).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onEdit={handleEdit}
                />
              ))
            )}

            {/* Load more indicator */}
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                Đang tải thêm bài viết...
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <aside className="hidden xl:block space-y-4 sticky top-24">
            <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Gợi ý theo dõi</h2>
              <div className="space-y-3">
                {["sophia", "kenny", "maria"].map((u) => (
                  <div key={u} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        src={`https://ui-avatars.com/api/?name=${u}`}
                        alt={u}
                      />
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">{u}</div>
                        <div className="text-gray-500">Mới trên ClosetShare</div>
                      </div>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-medium">
                      Theo dõi
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Điểm nổi bật trong tuần</h2>
              <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white via-blue-50/30 to-white">
                <div className="text-sm font-semibold text-gray-900 mb-2">Mẹo stylist AI</div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Thử kết hợp áo khoác cổ điển (vintage) với giày thể thao hiện
                  đại để tạo phom dáng tươi mới.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Post Popup */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tạo bài viết mới</h2>
              <button
                onClick={handleCloseCreatePost}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tiêu đề bài viết
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nội dung bài viết
                </label>
                <TipTapEditor
                  content={postContent}
                  onChange={setPostContent}
                  placeholder="Chia sẻ phong cách thời trang của bạn..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={handleCloseCreatePost}
                className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Strip HTML tags to check if content is empty
                  const textContent = postContent.replace(/<[^>]*>/g, '').trim();
                  if (postTitle.trim() && textContent) {
                    createPostMutation.mutate({
                      title: postTitle.trim(),
                      content: postContent.trim(), // Send HTML content
                    });
                  }
                }}
                disabled={
                  !postTitle.trim() ||
                  !postContent.replace(/<[^>]*>/g, '').trim() ||
                  createPostMutation.isPending
                }
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200"
              >
                {createPostMutation.isPending ? "Đang đăng..." : "Đăng bài"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
