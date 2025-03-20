import axios ,{CanceledError }from "axios";

export { CanceledError };
const backend_url = import.meta.env.VITE_BACKEND_URL|| "https://node24.cs.colman.ac.il/";
export const apiClient = axios.create({
  baseURL: backend_url,
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;