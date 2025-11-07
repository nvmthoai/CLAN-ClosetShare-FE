import { fetcher } from "./fetcher";
import { getAccessToken } from "@/lib/token";
import type { Post, CreatePostPayload, UpdatePostPayload, Comment } from "../models/Social";

const tokenConfig = () => {
  const token = getAccessToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export interface CreateCommentPayload {
  post_id: string;
  content: string;
  quote_comment_id?: string; // Optional: if provided, this is a reply to a comment
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
}

export interface UploadImageResponse {
  url: string; // URL string của ảnh sau khi server parse và lưu
}

export interface UploadImagePayload {
  image: string; // Base64 string của ảnh
}

export const postApi = {
  // GET /posts - Get all posts
  getPosts: (params?: { page?: number; limit?: number; author_id?: string }) =>
    fetcher.get<{ posts: Post[]; total: number }>("/posts", { params }),

  // GET /posts/{postId} - Get single post by ID
  getPost: (postId: string) =>
    fetcher.get<Post>(`/posts/${postId}`),

  // POST /posts - Create new post
  createPost: (payload: CreatePostPayload) =>
    fetcher.post<Post>("/posts", payload),

  // PUT /posts/{postId} - Update post
  updatePost: (postId: string, payload: UpdatePostPayload) =>
    fetcher.put<Post>(`/posts/${postId}`, payload),

  // DELETE /posts/{postId} - Delete post
  deletePost: (postId: string) =>
    fetcher.delete(`/posts/${postId}`),

  // GET /comments/post/{postId} - Get comments for a post
  getComments: (postId: string, params?: { page?: number; limit?: number }) =>
    fetcher.get<CommentsResponse>(`/comments/post/${postId}`, { params }),

  // POST /comments - Create comment or reply
  createComment: (payload: CreateCommentPayload) =>
    fetcher.post<Comment>("/comments", payload),

  // POST /posts/{postId}/reacts - React to a post (like)
  reactPost: (postId: string) =>
    fetcher.post(
      `/posts/${postId}/reacts`,
      undefined,
      tokenConfig()
    ),

  // DELETE /posts/{postId}/reacts - Remove reaction from a post (unlike)
  removeReact: (postId: string) =>
    fetcher.delete(`/posts/${postId}/reacts`, tokenConfig()),

  // POST /upload/image - Upload image as base64 string and get URL string
  uploadImage: (imageBase64: string) =>
    fetcher.post<UploadImageResponse>("/upload/image", {
      image: imageBase64,
    }),
};
