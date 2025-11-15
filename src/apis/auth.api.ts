
import type { AuthApiResponse } from "@/models/ApiResponse";
import { fetcher } from "./fetcher";
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/models/Auth";

export const authApi = {
  forgotPassword: async (data: ForgotPasswordRequest): Promise<AuthApiResponse> => {
    return fetcher.post("/auth/forgot-password", data);
  },
  resetPassword: async (data: ResetPasswordRequest): Promise<AuthApiResponse> => {
    return fetcher.post("/auth/reset-password", data);
  },
  login: async (data: LoginRequest): Promise<AuthApiResponse> => {
    return fetcher.post("/auth/login", data);
  },
  register: async (data: RegisterRequest): Promise<AuthApiResponse> => {
    return fetcher.post("/auth/register", data);
  },
  logout: async (): Promise<AuthApiResponse> => {
    return fetcher.post("/auth/logout");
  },
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthApiResponse> => {
    return fetcher.post("/auth/refresh-token", data);
  },
};