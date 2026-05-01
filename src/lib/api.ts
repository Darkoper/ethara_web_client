const API_BASE = import.meta.env.VITE_API_URL || "/api";

type RequestOptions = RequestInit & { auth?: boolean };

export function getToken() {
  return localStorage.getItem("harmony_token");
}

export function setToken(token: string) {
  localStorage.setItem("harmony_token", token);
}

export function clearToken() {
  localStorage.removeItem("harmony_token");
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}
