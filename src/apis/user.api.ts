import { fetcher } from "./fetcher";

export const userApi = {
  getMe: () => fetcher.get("/users/me"),
  getUserById: (userId: string) =>
    fetcher.get("/users", {
      params: { userId },
    }),
  updateMe: (payload: UpdateMePayload) => {
    const formData = new FormData();

    if (payload.name) {
      formData.append("name", payload.name);
    }

    if (payload.bio) {
      formData.append("bio", payload.bio);
    }

    if (payload.phoneNumber) {
      formData.append("phone_number", payload.phoneNumber);
    }

    if (payload.avatar) {
      formData.append("avatar", payload.avatar);
    }

    return fetcher.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  searchUsers: (params: { page?: number; limit?: number; search?: string }) =>
    fetcher.get("/users", {
      params,
    }),
};

export interface UpdateMePayload {
  name?: string;
  bio?: string;
  phoneNumber?: string;
  avatar?: File | null;
}
