const ALLOWED_PATHS = ["/dashboard"] as const;

export function safeRedirectPath(
  path: string | null | undefined,
  fallback: (typeof ALLOWED_PATHS)[number] = "/dashboard",
): string {
  if (!path) {
    return fallback;
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  if (!ALLOWED_PATHS.includes(path as (typeof ALLOWED_PATHS)[number])) {
    return fallback;
  }

  return path;
}
