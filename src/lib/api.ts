const DEFAULT_API_BASE = import.meta.env.PROD
  ? "https://ethara-web-server.onrender.com/api"
  : "/api";

const configuredApiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const API_BASE = import.meta.env.PROD && (!configuredApiBase || configuredApiBase === "/api")
  ? DEFAULT_API_BASE
  : configuredApiBase || DEFAULT_API_BASE;

type RequestOptions = RequestInit & { auth?: boolean };

export function getToken() {
  return localStorage.getItem("ethara_token");
}

export function setToken(token: string) {
  localStorage.setItem("ethara_token", token);
}

export function clearToken() {
  localStorage.removeItem("ethara_token");
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
  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = text && isJson ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  if (text && !isJson) {
    throw new Error(`Expected JSON but received ${contentType || "an unknown response type"}. Check VITE_API_URL.`);
  }

  return data as T;
}
