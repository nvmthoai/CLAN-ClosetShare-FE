import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/models/Social";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
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
    <article className="bg-white border rounded-lg mb-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatar || `https://ui-avatars.com/api/?name=${post.user.username}`}
            alt={post.user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-sm">{post.user.username}</h3>
            {post.location && (
              <p className="text-xs text-gray-500">{post.location}</p>
            )}
          </div>
        </div>
        <button className="p-1">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Image(s) */}
      <div className="relative">
        <img
          src={post.images[currentImageIndex]}
          alt={post.caption}
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
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
              />
              <button
                className="w-1/2"
                onClick={() => setCurrentImageIndex(Math.min(post.images.length - 1, currentImageIndex + 1))}
              />
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLike(post.id)}
              className="p-1"
            >
              <Heart
                className={cn(
                  "w-6 h-6 transition",
                  post.isLiked ? "text-red-500 fill-red-500" : "text-gray-700"
                )}
              />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-1"
            >
              <MessageCircle className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-1">
              <Send className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          <button className="p-1">
            <Bookmark className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-1">
          {post.likes.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{post.user.username}</span>
          <span>{post.caption}</span>
        </div>

        {/* Comments preview */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 mb-2"
          >
            View all {post.comments.length} comments
          </button>
        )}

        {/* Comments */}
        {showComments && (
          <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
            {post.comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold mr-2">{comment.user.username}</span>
                <span>{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Time */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {formatTimeAgo(post.createdAt)} ago
        </p>
      </div>

      {/* Add comment */}
      <div className="border-t px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 text-sm placeholder-gray-500 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
          />
          {commentText.trim() && (
            <button
              onClick={handleSubmitComment}
              className="text-sm font-semibold text-blue-500 hover:text-blue-700"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </article>
  );
}