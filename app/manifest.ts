import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nexora AI",
    short_name: "Nexora",
    description: "AI-powered workspace and automation for modern teams.",
    start_url: "/",
    display: "standalone",
    background_color: "#05050a",
    theme_color: "#05050a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
