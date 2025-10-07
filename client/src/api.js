export const API_BASE_URL = process.env.REACT_APP_API_URL || "";

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  return fetch(url, options);
}


