import axios ,{CanceledError }from "axios";

export { CanceledError };

const apiClient = axios.create({
  baseURL: import.meta.env.BACK_API_URL,
});


export default apiClient;