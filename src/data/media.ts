export type Media = { kind: "youtube" | "vimeo" | "video" | "instagram" | "none"; url: string };
export function resolveMedia(value: string): Media {
  if (!value) return { kind: "none", url: "" };
  if (/^\/(?!\/).+\.mp4(?:\?.*)?$/i.test(value)) return { kind: "video", url: value };
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return { kind: "none", url: "" };
    const host = url.hostname.replace(/^www\./, "");
    if (["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
      const id =
        host === "youtu.be"
          ? url.pathname.split("/")[1]
          : url.searchParams.get("v") || url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1];
      return id && /^[\w-]{11}$/.test(id)
        ? { kind: "youtube", url: `https://www.youtube-nocookie.com/embed/${id}` }
        : { kind: "none", url: "" };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname.match(/\/(\d+)/)?.[1];
      return id
        ? { kind: "vimeo", url: `https://player.vimeo.com/video/${id}` }
        : { kind: "none", url: "" };
    }
    if (host === "instagram.com") return { kind: "instagram", url: value };
    if (/\.mp4$/i.test(url.pathname)) return { kind: "video", url: value };
  } catch {
    /* Invalid URLs are never sent to a player. */
  }
  return { kind: "none", url: "" };
}
