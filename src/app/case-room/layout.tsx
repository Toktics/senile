import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Case Room",
  description: "Open classified drawers, inspect case files, and retrieve field tools for anomaly containment.",
  path: "/case-room",
});

export default function CaseRoomLayout({ children }: { children: ReactNode }) {
  return children;
}
