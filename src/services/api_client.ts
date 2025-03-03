import axios ,{CanceledError }from "axios";

export { CanceledError };

const apiClient = axios.create({
  baseURL: import.meta.env.BACK_API_URL || "http://localhost:3000",
});


export default apiClient;