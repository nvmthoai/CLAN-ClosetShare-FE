// Utility functions for user management

export function getUserId(): string | null {
  // Try to get user ID from localStorage first
  const userId = localStorage.getItem("user_id");
  if (userId) {
    return userId;
  }

  // If not in localStorage, try to get from user data
  const userData = localStorage.getItem("user_data");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      return parsed.id || parsed.user_id || null;
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  return null;
}

export function setUserId(userId: string): void {
  localStorage.setItem("user_id", userId);
}

export function setUserData(userData: any): void {
  localStorage.setItem("user_data", JSON.stringify(userData));
  if (userData.id || userData.user_id) {
    setUserId(userData.id || userData.user_id);
  }
}

export function clearUserData(): void {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_data");
}
