// src/api/client.js

/* ===============================
   BASE API CONFIG
================================ */

export const API =import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
  IMAGE_BASE is used to load images served
  from backend /uploads folder
*/
export const IMAGE_BASE =  import.meta.env.VITE_API_URL||"http://localhost:5000".replace("/api", "");

/* ===============================
   COMMON FETCH HELPER (OPTIONAL)
================================ */

/*
  Usage:
  apiFetch("/admin/menu", { method: "GET" }, token)
*/
export async function apiFetch(
  path,
  options = {},
  token = null
) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  // Handle non-JSON responses (HTML / errors)
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned non-JSON response");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
}


