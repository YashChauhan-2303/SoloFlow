/**
 * Reusable helper utility for API endpoint base URLs.
 * Resolves VITE_API_URL from Vite environment variables.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Constructs a full API URL for a given path.
 * Ensures no double slashes when joining base URL and path.
 * 
 * @param {string} path - The sub-route or path (e.g. '/login' or 'user/123')
 * @returns {string} The full resolved API URL
 */
export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};
