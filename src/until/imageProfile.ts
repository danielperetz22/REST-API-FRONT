const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://10.10.246.24";

export const getCorrectImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("https")) {
    return url;
  }
  return `${BACKEND_URL}/${url.replace(/\\/g, "/")}`;
};
