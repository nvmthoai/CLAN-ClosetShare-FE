export type Tokens = { access_token?: string; refresh_token?: string };

export function extractTokens(res: unknown): Tokens {
  // Try common shapes
  const r: any = res as any;
  const d = r?.data ?? r;

  const candidates: any[] = [
    // axios response shapes
    d,
    d?.data,
    d?.result,
    d?.payload,
    d?.tokens,
  ];

  for (const obj of candidates) {
    if (!obj || typeof obj !== "object") continue;
    const access_token = obj.access_token || obj.accessToken || obj.token;
    const refresh_token = obj.refresh_token || obj.refreshToken;
    if (access_token || refresh_token) {
      return { access_token, refresh_token };
    }
  }
  return {};
}
