import axios from "axios";

export function saveToken(token: string) {
  // Save to localStorage for client-side persistence
  if (typeof window !== "undefined") {
    localStorage.setItem("store_token", token);
    
    // Save to Cookies so the Middleware (Server) can see it
    // We set it to expire in 7 days
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `auth_token=${token}; path=/; expires=${expires}; SameSite=Lax`;
  }
}

export const getToken = () => {
  if (typeof window === "undefined") return null;
  
  // Try localStorage first
  const localToken = localStorage.getItem("store_token");
  if (localToken) return localToken;

  // Fallback to reading from Cookies
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1];
    
  return cookieToken || null;
};

export function logoutUser() {
  if (typeof window !== "undefined") {
    // Clear localStorage
    localStorage.removeItem("store_token");
    
    // Delete Cookie by setting expiry to past
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    
    // Redirect to login page
    window.location.href = "/login";
  }
}

export const axiosRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VITE_API_URL,
});

axiosRequest.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
