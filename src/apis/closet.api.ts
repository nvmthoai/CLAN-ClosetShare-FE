import { fetcher } from "./fetcher";

export type CreateClosetPayload = {
  name: string;
  type: "TOPS" | "OUTWEAR" | "BOTTOMS" | "ACCESSORIES";
  image: File;
};

export type ClosetItem = {
  id: string;
  user_id: string;
  name: string;
  type: "TOPS" | "OUTWEAR" | "BOTTOMS" | "ACCESSORIES";
  image: string;
  color_palette?: string | null;
  material?: string | null;
  style_tag?: string | null;
  created_at: string;
  updated_at: string;
};

export const closetApi = {
  // POST /closets - Create new closet item with form-data
  create: (payload: CreateClosetPayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("type", payload.type);
    formData.append("image", payload.image);
    
    return fetcher.post<ClosetItem>("/closets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  // GET /closets?userId={userId} - Get user's closet items
  getAll: (params?: { type?: string; userId?: string }) => {
    const queryParams: any = {};
    if (params?.type) queryParams.type = params.type;
    if (params?.userId) queryParams.userId = params.userId;
    return fetcher.get<{ data: ClosetItem[]; pagination?: any }>("/closets", { params: queryParams });
  },
  
  // GET /closets/{id} - Get single closet item
  getById: (id: string) => {
    return fetcher.get<ClosetItem>(`/closets/${id}`);
  },
  
  // DELETE /closets/{id} - Delete closet item
  delete: (id: string) => {
    return fetcher.delete(`/closets/${id}`);
  },
};

