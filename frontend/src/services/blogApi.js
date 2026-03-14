import { API_BASE } from "./api";

const adminHeaders = (passcode) => ({
  "Content-Type": "application/json",
  "x-admin-passcode": passcode,
});

const handleJson = async (response) => {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data?.detail || message;
    } catch (_error) {
      // Ignore parsing errors
    }
    throw new Error(message);
  }

  return response.json();
};

export const verifyAdminPasscode = async (passcode) => {
  const response = await fetch(`${API_BASE}/blog/admin/health`, {
    headers: adminHeaders(passcode),
  });
  return handleJson(response);
};

export const getBlogCategories = async () => {
  const response = await fetch(`${API_BASE}/blog/categories`);
  return handleJson(response);
};

export const createBlogCategory = async (passcode, payload) => {
  const response = await fetch(`${API_BASE}/blog/categories`, {
    method: "POST",
    headers: adminHeaders(passcode),
    body: JSON.stringify(payload),
  });
  return handleJson(response);
};

export const updateBlogCategory = async (passcode, categoryId, payload) => {
  const response = await fetch(`${API_BASE}/blog/categories/${categoryId}`, {
    method: "PUT",
    headers: adminHeaders(passcode),
    body: JSON.stringify(payload),
  });
  return handleJson(response);
};

export const deleteBlogCategory = async (passcode, categoryId) => {
  const response = await fetch(`${API_BASE}/blog/categories/${categoryId}`, {
    method: "DELETE",
    headers: adminHeaders(passcode),
  });
  return handleJson(response);
};

export const getBlogPosts = async (category = "all") => {
  const query = category && category.toLowerCase() !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  const response = await fetch(`${API_BASE}/blog/posts${query}`);
  return handleJson(response);
};

export const getAdminBlogPosts = async (passcode, category = "all") => {
  const params = new URLSearchParams({ include_drafts: "true" });
  if (category && category.toLowerCase() !== "all") {
    params.set("category", category);
  }
  const response = await fetch(`${API_BASE}/blog/posts?${params.toString()}`, {
    headers: { "x-admin-passcode": passcode },
  });
  return handleJson(response);
};

export const getBlogPostBySlug = async (slug) => {
  const response = await fetch(`${API_BASE}/blog/posts/${slug}`);
  return handleJson(response);
};

export const createBlogPost = async (passcode, payload) => {
  const response = await fetch(`${API_BASE}/blog/posts`, {
    method: "POST",
    headers: adminHeaders(passcode),
    body: JSON.stringify(payload),
  });
  return handleJson(response);
};

export const updateBlogPost = async (passcode, postId, payload) => {
  const response = await fetch(`${API_BASE}/blog/posts/${postId}`, {
    method: "PUT",
    headers: adminHeaders(passcode),
    body: JSON.stringify(payload),
  });
  return handleJson(response);
};

export const deleteBlogPost = async (passcode, postId) => {
  const response = await fetch(`${API_BASE}/blog/posts/${postId}`, {
    method: "DELETE",
    headers: adminHeaders(passcode),
  });
  return handleJson(response);
};

export const uploadImage = async (passcode, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { "x-admin-passcode": passcode },
    body: formData,
  });
  return handleJson(response);
};
