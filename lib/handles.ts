export const RESERVED_HANDLES = [
  "login",
  "signup",
  "dashboard",
  "auth",
  "api",
  "admin",
] as const;

export function normalizeHandle(input: string): string {
  return input.trim().toLowerCase().replace(/^@/, "");
}

export function validateHandle(handle: string): string | null {
  const normalized = normalizeHandle(handle);

  if (normalized.length < 3 || normalized.length > 30) {
    return "Handle must be 3–30 characters.";
  }

  if (!/^[a-z0-9_]+$/.test(normalized)) {
    return "Use only lowercase letters, numbers, and underscores.";
  }

  if (RESERVED_HANDLES.includes(normalized as (typeof RESERVED_HANDLES)[number])) {
    return "This handle is reserved.";
  }

  return null;
}
