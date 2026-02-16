import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Equipment Division",
  description: "Issue containment tools, review operational protocols, and prepare field equipment loadouts.",
  path: "/equipment-division",
});

export default function EquipmentDivisionLayout({ children }: { children: ReactNode }) {
  return children;
}
