import type { Metadata } from "next";
import { ArchiveExperience } from "@/components/archive-experience";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Interactive Archive",
  description:
    "Restore power, inspect classified files, and uncover the S.E.N.I.L.E. archive through layered narrative interactions.",
  path: "/",
});

export default function Home() {
  return <ArchiveExperience />;
}
