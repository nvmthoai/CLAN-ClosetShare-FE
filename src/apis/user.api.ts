import { fetcher } from "./fetcher";

export interface UpdateMePayload {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export const userApi = {
  getMe: () => fetcher.get("/users/me"),
  updateMe: (payload: UpdateMePayload) => fetcher.put("/users/me", payload),
};
