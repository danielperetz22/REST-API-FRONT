const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "https://node24.cs.colman.ac.il";

export const getCorrectImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("https")) {
    return url.replace(/\/uploads\/uploads\//, "/uploads/");
  }

  return `${BACKEND_URL}/${url.replace(/\\/g, "/")}`;
};
