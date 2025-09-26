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
    d?.token, // for {data: {token: {...}}} structure
  ];

  for (const obj of candidates) {
    if (!obj || typeof obj !== "object") continue;

    // Direct access_token/refresh_token fields
    let access_token = obj.access_token || obj.accessToken;
    let refresh_token = obj.refresh_token || obj.refreshToken;

    // If obj.token is an object, extract from it
    if (obj.token && typeof obj.token === "object") {
      access_token =
        access_token || obj.token.access_token || obj.token.accessToken;
      refresh_token =
        refresh_token || obj.token.refresh_token || obj.token.refreshToken;
    }
    // If obj.token is a string, use it as access_token
    else if (typeof obj.token === "string") {
      access_token = access_token || obj.token;
    }

    if (access_token || refresh_token) {
      return { access_token, refresh_token };
    }
  }
  return {};
}
