export function getCorrectImageUrl(url: string | null | undefined): string {
  if (!url) return "";


  if (url.startsWith("http") || url.startsWith("https")) {
      return url;
  }

  return `http://localhost:3000/${url.replace(/\\/g, "/")}`;
}
