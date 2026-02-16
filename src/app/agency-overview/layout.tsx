import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Agency Overview",
  description: "Review founding charter records, validate keycard access, and unlock the Equipment Division.",
  path: "/agency-overview",
});

export default function AgencyOverviewLayout({ children }: { children: ReactNode }) {
  return children;
}
