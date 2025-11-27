// Utility functions for user management

export function getUserId(): string | null {
  // Try direct stored id first
  const userId = localStorage.getItem("user_id");
  if (userId) {
    return userId;
  }

  // Try to read from known user data keys
  const data = getUserData();
  if (data) {
    // support different shapes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyData = data as any;
    return anyData.id || anyData.user_id || anyData._id || anyData?.user?.id || null;
  }

  return null;
}

export function setUserId(userId: string): void {
  localStorage.setItem("user_id", userId);
}

export function setUserData(userData: Record<string, unknown>): void {
  localStorage.setItem("user_data", JSON.stringify(userData));
  // Also write common alternate keys for compatibility
  try {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userInfo", JSON.stringify(userData));
  } catch (e) {
    console.warn("setUserData: localStorage write failed", e);
  }
  // type guard helpers
  function hasId(obj: Record<string, unknown>): obj is { id: string } {
    return typeof obj.id === "string";
  }
  function hasUserId(obj: Record<string, unknown>): obj is { user_id: string } {
    return typeof obj.user_id === "string";
  }

  if (hasId(userData)) {
    setUserId(userData.id);
  } else if (hasUserId(userData)) {
    setUserId(userData.user_id);
  }
}

export function getUserData<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;

  const candidateKeys = ["user_data", "user", "userInfo", "userData", "user_data_v2"];
  for (const key of candidateKeys) {
    const stored = localStorage.getItem(key);
    if (!stored) continue;
    try {
      return JSON.parse(stored) as T;
    } catch {
      // If JSON parsing fails, return raw string as unknown
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (stored as any) as T;
    }
  }

  return null;
}

export function clearUserData(): void {
  localStorage.removeItem("user_id");
  const keys = ["user_data", "user", "userInfo", "userData", "user_data_v2"];
  for (const k of keys) localStorage.removeItem(k);
}
