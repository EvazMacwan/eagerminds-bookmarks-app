export type Bookmark = {
  id: string;
  title: string;
  url: string;
  is_public: boolean;
  created_at: string;
};

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateBookmarkInput(title: string, url: string): string | null {
  if (!title.trim()) {
    return "Title is required.";
  }

  if (!url.trim()) {
    return "URL is required.";
  }

  try {
    const parsed = new URL(normalizeUrl(url));
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "URL must use http or https.";
    }
  } catch {
    return "Please enter a valid URL.";
  }

  return null;
}
