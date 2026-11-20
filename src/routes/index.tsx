import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio/Portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Video Editor & Motion Designer — Portfolio" },
      {
        name: "description",
        content:
          "Cinematic video editing, gaming montages, VFX, motion graphics and short-form work.",
      },
      { property: "og:title", content: "Video Editor & Motion Designer — Portfolio" },
      {
        property: "og:description",
        content: "Selected video editing, gaming, VFX and motion design work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});
