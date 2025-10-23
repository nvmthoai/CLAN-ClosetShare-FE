import type { AxiosResponse } from "axios";

// Generic API response type aliasing AxiosResponse with a typed payload
export type ApiResponse<T = unknown> = AxiosResponse<T>;

// Auth-specific payload returned by auth endpoints
export interface AuthPayload {
  user: any;
  data: any;
  access_token?: string;
  refresh_token?: string;
}

// Auth API response
export type AuthApiResponse = ApiResponse<AuthPayload>;
