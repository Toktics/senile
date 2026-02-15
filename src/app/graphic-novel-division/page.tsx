import type { Metadata } from "next";
import { GraphicNovelDivisionExperience } from "@/components/graphic-novel-division";

export const metadata: Metadata = {
  title: "Graphic Novel Division",
  description:
    "Public disclosure editions from the S.E.N.I.L.E. universe, including Volume 1, Case 001, and classified future releases.",
  alternates: { canonical: "/graphic-novel-division" },
};

export default function GraphicNovelDivisionPage() {
  return <GraphicNovelDivisionExperience />;
}
