import gaming from "@/assets/project-gaming.jpg";

export type ProjectCategory = "gaming" | "youtube" | "vfx" | "music video" | "creatives";
export type SourceType = "youtube" | "instagram" | "vimeo" | "other";
export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  thumbnail: string;
  videoUrl: string;
  sourceUrl: string;
  sourceType: SourceType;
  client?: string;
  year?: string;
  services: string[];
  featured: boolean;
  format?: "vertical" | "landscape";
};

// Display names for each category (used by the filter buttons and section headings).
export const categoryLabels: Record<ProjectCategory, string> = {
  gaming: "Gaming Montages",
  youtube: "YouTube Content",
  vfx: "VFX",
  "music video": "Music Videos",
  creatives: "Creatives",
};

type Base = {
  title: string;
  category: ProjectCategory;
  description: string;
  client?: string;
  featured?: boolean;
};

// YouTube: paste the video ID (the part after v=). Thumbnails load from YouTube automatically.
const youtube = (id: string, b: Base): Project => {
  const url = `https://www.youtube.com/watch?v=${id}`;
  return {
    id: `yt-${id}`,
    title: b.title,
    category: b.category,
    description: b.description,
    thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    videoUrl: url,
    sourceUrl: url,
    sourceType: "youtube",
    services: ["Video Editing"],
    featured: b.featured ?? false,
    ...(b.client ? { client: b.client } : {}),
  };
};

// Instagram: paste the path, e.g. "p/CP-oaUUnRNq" or "tv/CTKNqa6BAWk".
// Instagram has no public thumbnail, so a local placeholder image is used and the card opens the original post.
const instagram = (path: string, b: Base): Project => {
  const url = `https://www.instagram.com/${path}/`;
  return {
    id: `ig-${path.split("/")[1]}`,
    title: b.title,
    category: b.category,
    description: b.description,
    thumbnail: gaming,
    videoUrl: url,
    sourceUrl: url,
    sourceType: "instagram",
    services: ["Video Editing"],
    featured: b.featured ?? false,
    ...(b.client ? { client: b.client } : {}),
  };
};

const vivone = (n: string) => ({
  title: `Montage ${n}`,
  category: "gaming" as const,
  client: "Vivone Gaming",
  description: "Gaming montage edit for Vivone Gaming.",
});
const vivoneIg = (n: string) => ({
  title: `Instagram Edit ${n}`,
  category: "gaming" as const,
  client: "Vivone Gaming",
  description: "Gaming edit for Vivone Gaming, shared on Instagram.",
});
const omegle = (n: string) => ({
  title: `Omegle ${n}`,
  category: "youtube" as const,
  client: "Omegle",
  description: "YouTube content edit.",
});
const music = (n: string) => ({
  title: `Music Video ${n}`,
  category: "music video" as const,
  description: "Music video edit.",
});

// To add a video: copy one line, change the ID / path and title. VFX and Creatives are empty for now (shown as "Coming soon").
export const projects: Project[] = [
  // Gaming Montages — Vivone Gaming
  youtube("NmyBJDEBQCg", { ...vivone("01"), featured: true }),
  youtube("TObuELEJ0co", vivone("02")),
  youtube("0-M-toKMELQ", vivone("03")),
  instagram("p/CP-oaUUnRNq", vivoneIg("01")),
  instagram("p/CNr1bH_nM9M", vivoneIg("02")),
  instagram("p/CO-QH5rn2Xd", vivoneIg("03")),
  instagram("tv/CTKNqa6BAWk", vivoneIg("04")),

  // YouTube Content — Omegle
  youtube("_0FiAruBzU8", { ...omegle("01"), featured: true }),
  youtube("eE_p-N7eExU", omegle("02")),
  youtube("YL1n6MeZgXo", omegle("03")),
  youtube("f6hxmo6B-I8", omegle("04")),

  // Music Videos
  youtube("_2sqHSHIfmo", { ...music("01"), featured: true }),
  youtube("IrA3pGUhw9Q", music("02")),
];
