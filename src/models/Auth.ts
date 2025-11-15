export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string; // reset token from email/otp
  password: string;
}

export interface AuthPayload {
  access_token: string;
  refresh_token: string;
  user?: any;
  data?: {
    user?: any;
  };
}

export interface AuthResponse {
  data: AuthPayload;
}