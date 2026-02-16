import type { Metadata } from "next";
import { GraphicNovelDivisionExperience } from "@/components/graphic-novel-division";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Graphic Novel Division",
  description:
    "Public disclosure editions from the S.E.N.I.L.E. universe, including Volume 1, Case 001, and classified future releases.",
  path: "/graphic-novel-division",
});

export default function GraphicNovelDivisionPage() {
  return <GraphicNovelDivisionExperience />;
}
