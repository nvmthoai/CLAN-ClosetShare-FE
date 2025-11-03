import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post, UpdatePostPayload } from "@/models/Social";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onEdit?: (postId: string, payload: UpdatePostPayload) => void;
}

export function PostCard({ post, onLike, onComment, onEdit }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editPublished, setEditPublished] = useState(post.published);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post.id, {
        title: editTitle,
        content: editContent,
        published: editPublished,
      });
      setShowEditModal(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditPublished(post.published);
    setShowEditModal(false);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    return "now";
  };

  return (
    <article className="bg-white border-b">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold border-2 border-gray-200">
            {post.user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">
              {post.user?.username || 'User'}
            </h3>
            <span className="text-xs text-gray-500">{formatTimeAgo(post.created_at)}</span>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-900" />
          </button>
          
          {/* More Menu */}
          {showMoreMenu && (
            <div className="absolute right-0 top-8 bg-white border rounded-xl shadow-lg py-1 z-10 min-w-[150px] overflow-hidden">
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowMoreMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
              >
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image(s) */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <img
            src={post.images[currentImageIndex]}
            alt={post.caption || 'Post image'}
            className="w-full aspect-square object-cover"
          />

          {/* Image indicators */}
          {post.images.length > 1 && (
            <>
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{post.images.length}
              </div>
              <div className="absolute inset-0 flex">
                <button
                  className="w-1/2"
                  onClick={() =>
                    setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
                  }
                />
                <button
                  className="w-1/2"
                  onClick={() =>
                    setCurrentImageIndex(
                      Math.min((post.images?.length || 1) - 1, currentImageIndex + 1)
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onLike(post.id)} 
              className="p-0 hover:opacity-70 transition-opacity"
            >
              <Heart
                className={cn(
                  "w-7 h-7 transition-all",
                  post.isLiked ? "text-red-500 fill-red-500 scale-110" : "text-gray-900"
                )}
              />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-0 hover:opacity-70 transition-opacity"
            >
              <MessageCircle className="w-7 h-7 text-gray-900" />
            </button>
            <button className="p-0 hover:opacity-70 transition-opacity">
              <Send className="w-7 h-7 text-gray-900" />
            </button>
          </div>
          <button className="p-0 hover:opacity-70 transition-opacity">
            <Bookmark className="w-7 h-7 text-gray-900" />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-1">
          {(post.likes || 0).toLocaleString()} lượt thích
        </p>

        {/* Post Content */}
        <div className="mb-2">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-gray-900 mr-2">
              {post.user?.username || 'User'}
            </span>
            <span className="text-gray-900">{post.content}</span>
          </p>
        </div>

        {/* Comments preview */}
        {post.comments && post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 mb-2 hover:text-gray-900"
          >
            Xem tất cả {post.comments.length} bình luận
          </button>
        )}

        {/* Comments */}
        {showComments && (
          <div className="space-y-2 mb-2 max-h-48 overflow-y-auto pr-2">
            {post.comments?.slice(0, 3).map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold mr-2 text-gray-900">
                  {comment.user.username}
                </span>
                <span className="text-gray-900">{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        
      </div>

      {/* Add comment */}
      <div className="border-t px-4 py-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Thêm bình luận..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 text-sm placeholder-gray-400 focus:outline-none text-gray-900"
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
          />
          {commentText.trim() && (
            <button
              onClick={handleSubmitComment}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Đăng
            </button>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg border">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Chỉnh sửa bài viết</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Nhập tiêu đề..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Nhập nội dung..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Published Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editPublished}
                  onChange={(e) => setEditPublished(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Đã xuất bản
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
