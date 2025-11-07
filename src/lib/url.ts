export const normalizeBaseUrl = (url: string) => {
  if (!url) return url;
  return url.replace(/\/$/, "");
};

const getEnvBaseUrl = () => {
  const candidates = [
    import.meta.env.VITE_PUBLIC_APP_URL,
    import.meta.env.VITE_APP_URL,
    import.meta.env.VITE_PUBLIC_BASE_URL,
    import.meta.env.VITE_BASE_URL,
    import.meta.env.VITE_VERCEL_URL,
    import.meta.env.VERCEL_URL,
  ].filter((value) => typeof value === "string" && value.length > 0) as string[];

  for (const candidate of candidates) {
    const trimmed = candidate.trim();
    if (!trimmed) continue;
    try {
      const hasProtocol = /^https?:\/\//i.test(trimmed);
      const url = hasProtocol ? new URL(trimmed) : new URL(`https://${trimmed}`);
      return normalizeBaseUrl(`${url.protocol}//${url.host}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      if (import.meta.env.DEV) {
        console.warn("[url] Invalid base URL from env:", candidate, error);
      }
    }
  }

  return null;
};

const DEFAULT_CANONICAL_URL = "https://closetshare.vercel.app";

export const getAppBaseUrl = () => {
  const envBaseUrl = getEnvBaseUrl();
  if (envBaseUrl) {
    return envBaseUrl;
  }

  if (typeof window !== "undefined" && window.location) {
    const host = window.location.host;
    const protocol = window.location.protocol;

    // Force canonical domain for vercel preview domains or localhost
    const isLocalhost = /localhost|127\.0\.0\.1/.test(host);
    const isVercelPreview = /vercel\.app$/i.test(host) && host !== new URL(DEFAULT_CANONICAL_URL).host;

    if (isLocalhost || isVercelPreview) {
      return DEFAULT_CANONICAL_URL;
    }

    return normalizeBaseUrl(`${protocol}//${host}`);
  }

  // Fallback to Vercel-style domain if nothing else available
  return DEFAULT_CANONICAL_URL;
};

export const buildAppUrl = (path = "") => {
  const base = getAppBaseUrl();
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

