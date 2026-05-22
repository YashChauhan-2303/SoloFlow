/**
 * Reusable helper utility for API endpoint base URLs.
 * Resolves VITE_API_URL from Vite environment variables.
 */

// Remove any trailing slash from the base URL
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

/**
 * Constructs a full API URL for a given path.
 *
 * Examples:
 * getApiUrl("login")
 * getApiUrl("/login")
 *
 * Both become:
 * https://your-api.com/login
 */
export const getApiUrl = (path = "") => {
  const cleanPath = path.replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
};