import type { Metadata } from "next";
import { ArchiveExperience } from "@/components/archive-experience";

export const metadata: Metadata = {
  title: "Interactive Archive",
  description:
    "Restore power, inspect classified files, and uncover the S.E.N.I.L.E. archive through layered narrative interactions.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <ArchiveExperience />;
}
