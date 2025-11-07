export const normalizeBaseUrl = (url: string) => {
  if (!url) return url;
  return url.replace(/\/$/, "");
};

const CANONICAL_HOST = "closetshare.vercel.app";
const DEFAULT_CANONICAL_URL = `https://${CANONICAL_HOST}`;

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
      const host = url.host.toLowerCase();

      if (host === CANONICAL_HOST) {
        return normalizeBaseUrl(`${url.protocol}//${CANONICAL_HOST}`);
      }

      // Skip localhost or preview Vercel URLs so we can fall back to canonical
      const isLocal = /localhost|127\.0\.0\.1/.test(host);
      const isVercelPreview = host.endsWith("vercel.app") && host !== CANONICAL_HOST;
      if (isLocal || isVercelPreview) {
        continue;
      }

      return normalizeBaseUrl(`${url.protocol}//${host}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      if (import.meta.env.DEV) {
        console.warn("[url] Invalid base URL from env:", candidate, error);
      }
    }
  }

  return null;
};

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
    const isVercelPreview = /vercel\.app$/i.test(host) && host !== CANONICAL_HOST;

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

