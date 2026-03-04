const TINA_HOST_PATTERN = /(^|\.)tina\.io$/i;

const trimLeadingSlash = (value: string) => value.replace(/^\/+/, "");

export const resolveImagePath = (value?: string | null): string | undefined => {
  if (!value) return undefined;

  if (value.startsWith("/")) return value;

  try {
    const parsed = new URL(value);

    // Keep non-Tina remote images untouched.
    if (!TINA_HOST_PATTERN.test(parsed.hostname)) {
      return value;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return undefined;

    // Tina asset URLs are usually /<client-id>/<branch>/<path/to/file>.
    if (segments.length >= 3) {
      return `/${segments.slice(2).join("/")}`;
    }

    return `/${segments.join("/")}`;
  } catch {
    return `/${trimLeadingSlash(value)}`;
  }
};

export const parseImageFieldValue = (media: unknown): string => {
  if (!media) return "";

  if (typeof media === "string") {
    return resolveImagePath(media) ?? "";
  }

  if (typeof media === "object") {
    const value = media as { filename?: unknown; src?: unknown; id?: unknown };

    if (typeof value.filename === "string" && value.filename.length > 0) {
      return `/${trimLeadingSlash(value.filename)}`;
    }

    if (typeof value.src === "string" && value.src.length > 0) {
      return resolveImagePath(value.src) ?? "";
    }

    if (typeof value.id === "string" && value.id.length > 0) {
      return resolveImagePath(value.id) ?? "";
    }
  }

  return "";
};
