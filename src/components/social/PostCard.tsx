import React, { useState, useEffect, useMemo } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Reply,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Post, UpdatePostPayload } from "@/models/Social";
import { postApi, type CreateCommentPayload } from "@/apis/post.api";
import { toast } from "react-toastify";
import { TipTapEditor } from "@/components/ui/tiptap-editor";
import { getUserId } from "@/lib/user";
import { getAccessToken } from "@/lib/token";
import { createPortal } from "react-dom";

// helper to extract message from axios or Error
function getErrorMessage(err: unknown, fallback = "Có lỗi xảy ra") {
  if (!err) return fallback;
  // axios style
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = err as any;
    if (anyErr?.response?.data?.message) return anyErr.response.data.message;
  } catch (e) {
    // ignore parsing errors
    console.warn('getErrorMessage parse error', e);
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, liked: boolean, totalLikes: number) => void;
  onEdit?: (postId: string, payload: UpdatePostPayload) => void;
}

export function PostCard({ post, onLike, onEdit }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editPublished, setEditPublished] = useState(post.published);
  const [commentPage, setCommentPage] = useState(1);
  const [liked, setLiked] = useState<boolean>(!!post.isLiked);
  const [likeCount, setLikeCount] = useState<number>(post.likes ?? 0);
  const queryClient = useQueryClient();
  
  // Initialize liked state from post.isLiked on mount
  // This ensures we read the correct value from server after F5
  useEffect(() => {
    const initialLiked = !!post.isLiked;
    const initialLikeCount = post.likes ?? 0;
    setLiked(initialLiked);
    setLikeCount(initialLikeCount);
    lastKnownLikedRef.current = initialLiked;
    // Reset hasLocalLikeState on mount to allow sync from server
    setHasLocalLikeState(false);
  }, [post.isLiked, post.likes]);

  const displayUser = useMemo(() => {
    const fromUser = post.user;
    const fromAuthor = post.author;
    return {
      name:
        fromAuthor?.name ||
        fromUser?.name ||
        fromUser?.username ||
        fromAuthor?.email ||
        post.author_id,
      username: fromUser?.username,
      email: fromAuthor?.email || fromUser?.name,
      avatar:
        fromAuthor?.avatar ||
        fromUser?.avatar ||
        (fromAuthor?.name || fromAuthor?.email || fromUser?.username
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
              fromAuthor?.name ||
                fromUser?.name ||
                fromUser?.username ||
                fromAuthor?.email ||
                "U"
            )}`
          : `https://ui-avatars.com/api/?name=U`),
    };
  }, [post.author, post.author_id, post.user]);

  // Store mutation pending state to avoid dependency issues
  const [isReactPending, setIsReactPending] = useState(false);
  // Track if we have a local like state that should override server value
  const [hasLocalLikeState, setHasLocalLikeState] = useState(false);
  // Track the last known liked state to prevent unnecessary updates
  const lastKnownLikedRef = React.useRef<boolean | null>(null);

  // Reset local state when post changes (new post loaded)
  useEffect(() => {
    setHasLocalLikeState(false);
    lastKnownLikedRef.current = null;
    setLiked(!!post.isLiked);
    setLikeCount(post.likes ?? 0);
  }, [post.id, post.isLiked, post.likes]);

  // Sync from server when post.isLiked changes (e.g., after refetch or F5)
  // Only update if we don't have local state (user hasn't clicked like recently)
  useEffect(() => {
    // Always sync from server if we don't have local state
    // This ensures F5 will restore the correct state from server
    if (!hasLocalLikeState && !isReactPending) {
      const serverLiked = !!post.isLiked;
      const serverLikeCount = post.likes ?? 0;
      
      // Update if server value is different from current state
      if (liked !== serverLiked || likeCount !== serverLikeCount) {
        setLiked(serverLiked);
        setLikeCount(serverLikeCount);
        lastKnownLikedRef.current = serverLiked;
      }
    }
  }, [post.isLiked, post.likes, hasLocalLikeState, isReactPending, liked, likeCount]);

  // Fetch comments when comments section is opened
  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", post.id, commentPage],
    queryFn: () => postApi.getComments(post.id, { page: commentPage, limit: 10 }),
    enabled: showComments,
    select: (res) => res.data,
  });

  const comments = commentsData?.comments || [];
  const totalComments = commentsData?.total || 0;
  const hasMoreComments = comments.length < totalComments;

  const toggleReactMutation = useMutation({
    mutationFn: async (shouldLike: boolean) => {
      try {
        if (shouldLike) {
          return await postApi.reactPost(post.id);
        } else {
          return await postApi.removeReact(post.id);
        }
      } catch (error) {
        // Handle 409 Conflict - automatically toggle to opposite action
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyError = error as any;
        if (anyError?.response?.status === 409) {
          if (shouldLike) {
            const result = await postApi.removeReact(post.id);
            return { ...result, _wasToggled: true, _actualAction: false };
          } else {
            const result = await postApi.reactPost(post.id);
            return { ...result, _wasToggled: true, _actualAction: true };
          }
        }
        throw error;
      }
    },
    onMutate: async (shouldLike) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      
      setIsReactPending(true);
      setHasLocalLikeState(true); // Mark that we have local state - don't let server override
      const previousState = { liked, likeCount };
      const nextLikeCount = Math.max(
        0,
        previousState.likeCount + (shouldLike ? 1 : -1)
      );

      // Optimistic update - update UI immediately
      setLiked(shouldLike);
      setLikeCount(nextLikeCount);
      lastKnownLikedRef.current = shouldLike;

      return { previousState, nextLikeCount, intendedLike: shouldLike };
    },
    onError: (error: unknown, _shouldLike, context) => {
      setIsReactPending(false);
      setHasLocalLikeState(false);
      if (context?.previousState) {
        setLiked(context.previousState.liked);
        setLikeCount(context.previousState.likeCount);
      }
      const msg = getErrorMessage(error, "Không thể cập nhật lượt thích");
      // don't show for 409
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!((error as any)?.response?.status === 409)) toast.error(msg);
    },
    onSuccess: (data: unknown, shouldLike, context) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyData = data as any;
      const actualLike = anyData?._wasToggled ? anyData._actualAction : shouldLike;
      if (anyData?._wasToggled && context) {
        const actualCount = Math.max(0, context.previousState.likeCount + (actualLike ? 1 : -1));
        setLiked(actualLike);
        setLikeCount(actualCount);
        lastKnownLikedRef.current = actualLike;
        onLike?.(post.id, actualLike, actualCount);
      } else if (context) {
        lastKnownLikedRef.current = shouldLike;
        onLike?.(post.id, shouldLike, context.nextLikeCount);
      }
      setIsReactPending(false);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }, 300);
    },
  });

  const handleToggleLike = () => {
    if (toggleReactMutation.isPending) return;
    toggleReactMutation.mutate(!liked);
  };

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: (payload: CreateCommentPayload) => postApi.createComment(payload),
    onSuccess: (_data, variables) => {
      // Clear the specific reply text that was submitted
      if (variables.quote_comment_id) {
        setReplyText((prev) => {
          const newReplyText = { ...prev };
          delete newReplyText[variables.quote_comment_id!];
          return newReplyText;
        });
      } else {
        setCommentText("");
      }
      setReplyToCommentId(null);
      // Refetch comments
      refetchComments();
      // Invalidate posts to update comment count
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Đã thêm bình luận");
    },
    onError: () => {
      toast.error("Không thể thêm bình luận");
    },
  });

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      createCommentMutation.mutate({
        post_id: post.id,
        content: commentText.trim(),
        quote_comment_id: replyToCommentId || undefined,
      });
    }
  };

  const handleReply = (commentId: string) => {
    setReplyToCommentId(commentId);
    setCommentText("");
  };

  const handleCancelReply = () => {
    setReplyToCommentId(null);
    setReplyText({});
  };

  const handleLoadMoreComments = () => {
    setCommentPage((prev) => prev + 1);
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
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMins > 0) return `${diffMins}m`;
    return "vừa xong";
  };

  // Reset comment page when closing comments
  useEffect(() => {
    if (!showComments) {
      setCommentPage(1);
      setReplyToCommentId(null);
      setReplyText({});
    }
  }, [showComments]);

  // Delete post mutation - only available to owner
  const deletePostMutation = useMutation({
    mutationFn: (token?: string) => postApi.deletePost(post.id, token),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error, "Không thể xóa bài viết");
      toast.error(msg);
    },
    onSuccess: () => {
      toast.success("Xóa bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
    },
  });

  const isOwner = (() => {
    const uid = getUserId();
    return !!(uid && (uid === post.author_id || uid === post.user?.id));
  })();

  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-visible shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold border-2 border-blue-200 overflow-hidden">
            <img
              src={displayUser.avatar}
              alt={displayUser.name || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">
              {displayUser.name || "User"}
            </h3>
            <span className="text-xs text-gray-500">{formatTimeAgo(post.created_at)}</span>
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu((v) => !v)}
            className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
            aria-expanded={showMoreMenu}
            aria-label="Open post menu"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-900" />
          </button>
          
          {/* More Menu */}
          {showMoreMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 min-w-[150px] overflow-hidden">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-500 transition-colors flex items-center gap-2 text-gray-900"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              )}

              {isOwner ? (
                <button
                  type="button"
                  onClick={() => {
                    // open in-app confirm modal instead of native confirm
                    setShowMoreMenu(false);
                    setShowDeleteModal(true);
                  }}
                  disabled={deletePostMutation.isPending}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 text-gray-900 disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deletePostMutation.isPending ? 'Đang xóa...' : 'Xóa'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    toast.info("Bạn chỉ có thể xóa bài viết của chính mình");
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-900"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Báo cáo</span>
                </button>
              )}
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
              <div className="absolute top-3 right-3 bg-gray-900/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {currentImageIndex + 1}/{post.images.length}
              </div>
              <div className="absolute inset-0 flex">
                <button
                  className="w-1/2"
                  onClick={() =>
                    setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
                  }
                  type="button"
                />
                <button
                  className="w-1/2"
                  onClick={() =>
                    setCurrentImageIndex(
                      Math.min((post.images?.length || 1) - 1, currentImageIndex + 1)
                    )
                  }
                  type="button"
                />
              </div>
            </>
          )}
        </div>
      )}

      

      {/* Likes and Content - Below actions */}
      <div className="px-4 pb-2">
        {/* Likes */}
        

        {/* Comments count preview */}
        {totalComments > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-sm text-gray-500 mb-2 hover:text-blue-500 transition-colors font-medium"
          >
            Xem tất cả {totalComments} bình luận
          </button>
        )}
        

        {/* Post Content */}
        <div className="mb-2">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-gray-900 mr-2">
              {displayUser.name || "User"}
            </span>
            <span 
              className="text-gray-900 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </p>
        </div>
        <p className="font-semibold text-sm mb-2 text-gray-900">
          {likeCount.toLocaleString()} lượt thích
        </p>
      </div>
        {/* Actions - Below image */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleLike}
              className="p-0 hover:opacity-70 transition-all duration-200 hover:scale-110"
              disabled={toggleReactMutation.isPending}
              type="button"
            >
              <Heart
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  liked ? "text-red-500 fill-red-500 scale-110" : "text-gray-900 hover:text-red-500"
                )}
              />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-0 hover:opacity-70 transition-all duration-200 hover:scale-110"
              type="button"
            >
              <MessageCircle className={cn(
                "w-6 h-6 transition-all duration-200",
                showComments ? "text-blue-500 fill-blue-500" : "text-gray-900 hover:text-blue-500"
              )} />
            </button>
            <button className="p-0 hover:opacity-70 transition-all duration-200 hover:scale-110">
              <Send className="w-6 h-6 text-gray-900 hover:text-blue-500" />
            </button>
          </div>
          <button className="p-0 hover:opacity-70 transition-all duration-200 hover:scale-110">
            <Bookmark className="w-6 h-6 text-gray-900 hover:text-blue-500" />
          </button>
        </div>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 bg-gray-50/30">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">
                Bình luận ({totalComments})
              </h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 mb-4">
              {commentsLoading && commentPage === 1 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Chưa có bình luận nào
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    {/* Parent Comment */}
                    <div className="flex gap-3 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 overflow-hidden border-2 border-blue-200">
                        {comment.user.avatar ? (
                          <img 
                            src={comment.user.avatar} 
                            alt={comment.user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          comment.user.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl p-3 border border-gray-200">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-sm text-gray-900 mr-2">
                                {comment.user.username}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(comment.createdAt || comment.created_at || '')}
                              </span>
                            </div>
                            <button
                              onClick={() => handleReply(comment.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-50 rounded-lg"
                              title="Trả lời"
                            >
                              <Reply className="w-3.5 h-3.5 text-gray-500 hover:text-blue-500" />
                            </button>
                          </div>
                          <p 
                            className="text-sm text-gray-900 leading-relaxed break-words prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: comment.content || comment.text || '' }}
                          />
                          {comment.likes > 0 && (
                            <div className="mt-2 flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                              <span className="text-xs text-gray-500">{comment.likes}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Reply input */}
                        {replyToCommentId === comment.id && (
                          <div className="mt-2 ml-4 pl-3 border-l-2 border-blue-200">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder={`Trả lời ${comment.user.username}...`}
                                value={replyText[comment.id] || ""}
                                onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                                className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && replyText[comment.id]?.trim()) {
                                    createCommentMutation.mutate({
                                      post_id: post.id,
                                      content: replyText[comment.id].trim(),
                                      quote_comment_id: comment.id,
                                    });
                                  } else if (e.key === "Escape") {
                                    handleCancelReply();
                                  }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => {
                                  if (replyText[comment.id]?.trim()) {
                                    createCommentMutation.mutate({
                                      post_id: post.id,
                                      content: replyText[comment.id].trim(),
                                      quote_comment_id: comment.id,
                                    });
                                  }
                                }}
                                disabled={!replyText[comment.id]?.trim() || createCommentMutation.isPending}
                                className="px-3 py-2 text-sm font-medium text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Đăng
                              </button>
                              <button
                                onClick={handleCancelReply}
                                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-11 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 overflow-hidden border-2 border-blue-100">
                              {reply.user.avatar ? (
                                <img 
                                  src={reply.user.avatar} 
                                  alt={reply.user.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                reply.user.username.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex-1 min-w-0">
                                    <span className="font-semibold text-xs text-gray-900 mr-2">
                                      {reply.user.username}
                                    </span>
                                    <span className="text-[10px] text-gray-500">
                                      {formatTimeAgo(reply.createdAt || reply.created_at || '')}
                                    </span>
                                  </div>
                                </div>
                                <p 
                                  className="text-xs text-gray-900 leading-relaxed break-words prose prose-xs max-w-none"
                                  dangerouslySetInnerHTML={{ __html: reply.content || reply.text || '' }}
                                />
                                {reply.likes > 0 && (
                                  <div className="mt-1.5 flex items-center gap-1">
                                    <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                                    <span className="text-[10px] text-gray-500">{reply.likes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Load More Comments */}
              {hasMoreComments && (
                <button
                  onClick={handleLoadMoreComments}
                  disabled={commentsLoading}
                  className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {commentsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Xem thêm bình luận ({totalComments - comments.length} còn lại)
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add comment */}
      <div className="border-t border-gray-100 px-4 py-2">
        {replyToCommentId ? (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">Đang trả lời</span>
            <button
              onClick={handleCancelReply}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium"
            >
              Hủy
            </button>
          </div>
        ) : null}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={replyToCommentId ? "Viết trả lời..." : "Thêm bình luận..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 text-sm placeholder-gray-400 focus:outline-none text-gray-900 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && commentText.trim()) {
                handleSubmitComment();
              }
            }}
            disabled={createCommentMutation.isPending}
          />
          {commentText.trim() && (
            <button
              onClick={handleSubmitComment}
              disabled={createCommentMutation.isPending}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createCommentMutation.isPending ? "..." : "Đăng"}
            </button>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <PortalModal onClose={handleCancelEdit}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa bài viết</h2>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Nhập tiêu đề..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nội dung
                </label>
                <TipTapEditor
                  content={editContent}
                  onChange={setEditContent}
                  placeholder="Nhập nội dung..."
                />
              </div>

              {/* Published Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editPublished}
                  onChange={(e) => setEditPublished(e.target.checked)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-900">
                  Đã xuất bản
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </PortalModal>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <PortalModal onClose={() => setShowDeleteModal(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-sm text-gray-600">Bạn có chắc muốn xóa bài viết này?</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button type="button" onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm bg-white border rounded-lg">Hủy</button>
              <button
                type="button"
                onClick={async () => {
                  const token = getAccessToken();
                  try {
                    await deletePostMutation.mutateAsync(token ?? undefined);
                    setShowDeleteModal(false);
                  } catch {
                    // error handled in mutation
                  }
                }}
                disabled={deletePostMutation.isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg disabled:opacity-60"
              >
                {deletePostMutation.isPending ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </PortalModal>
      )}
    </article>
  );
}

// small Portal Modal to ensure overlay renders at document.body level
function PortalModal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 200000 }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md p-4">{children}</div>
    </div>,
    document.body
  );
}
