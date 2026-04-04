// src/utils/api.js
// Replace all localStorage calls with these API functions

const BASE_URL = "http://localhost:5000/api"

// Helper: get token from localStorage
const getToken = () => localStorage.getItem("token")

// Helper: headers with auth token
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
})

// ─── AUTH ───────────────────────────────────────────────

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)

  // Save token & user (replaces old localStorage.setItem("user", ...))
  localStorage.setItem("token", data.token)
  localStorage.setItem("user", JSON.stringify(data.user))
  return data
}

export const signupUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)

  localStorage.setItem("token", data.token)
  localStorage.setItem("user", JSON.stringify(data.user))
  return data
}

export const updateProfile = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)

  localStorage.setItem("token", data.token)
  localStorage.setItem("user", JSON.stringify(data.user))
  return data
}

export const logoutUser = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"))
}

// ─── ITEMS ──────────────────────────────────────────────

export const fetchItems = async (search = "", category = "All") => {
  const params = new URLSearchParams()
  if (search) params.append("search", search)
  if (category !== "All") params.append("category", category)

  const res = await fetch(`${BASE_URL}/items?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const fetchMyItems = async () => {
  const res = await fetch(`${BASE_URL}/items/mine`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const fetchItem = async (id) => {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const uploadItem = async (formData) => {
  // formData is a FormData object (supports file upload)
  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` }, // NO Content-Type for FormData
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const updateItem = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const deleteItem = async (id) => {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ─── MESSAGES ───────────────────────────────────────────

export const fetchMessages = async (itemId) => {
  const res = await fetch(`${BASE_URL}/messages/${itemId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const sendMessage = async (itemId, text) => {
  const res = await fetch(`${BASE_URL}/messages/${itemId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}
