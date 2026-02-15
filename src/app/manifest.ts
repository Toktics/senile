import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "S.E.N.I.L.E. Interactive Archive",
    short_name: "S.E.N.I.L.E.",
    description: "Interactive archive of domestic anomaly containment records.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1720",
    theme_color: "#0f1720",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

