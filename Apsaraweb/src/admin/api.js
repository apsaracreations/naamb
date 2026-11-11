// Shared helpers for the admin panel (/admin)
export const API_BASE = import.meta.env.VITE_API_URL || "";
export const API_ROOT = API_BASE.replace(/\/api\/?$/, "");

// Kept separate from the customer "token" so shop login/logout never affects the admin session
const TOKEN_KEY = "adminToken";
export const getAdminToken = () => localStorage.getItem(TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(TOKEN_KEY);

export async function adminFetch(path, { method = "GET", json, body } = {}) {
  const headers = {};
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty or non-JSON body
  }

  if (res.status === 401 && token) {
    clearAdminToken();
    window.dispatchEvent(new Event("adminLogout"));
  }
  if (!res.ok) throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  return data;
}

export const SHIPPING_STATUSES = ["Pending", "Packed", "Shipped", "Delivered"];
export const statusTone = { Pending: "yellow", Packed: "purple", Shipped: "blue", Delivered: "green" };

export const buildImgSrc = (path) => {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ROOT}/${path.replace(/\\/g, "/").replace(/^\/+/, "")}`;
};

export const formatINR = (n) =>
  n === null || n === undefined || n === ""
    ? "—"
    : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export const formatDate = (value, withTime = true) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

export const toList = (value) =>
  Array.isArray(value)
    ? value.filter(Boolean)
    : typeof value === "string"
      ? value.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
