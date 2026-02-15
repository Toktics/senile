import type { MetadataRoute } from "next";

const BASE = "https://senile.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/case-room",
    "/agency-overview",
    "/agent-registry",
    "/equipment-division",
    "/graphic-novel-division",
    "/recruitment-terminal",
    "/privacy-policy",
    "/cookie-policy",
    "/terms-and-conditions",
  ];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}

