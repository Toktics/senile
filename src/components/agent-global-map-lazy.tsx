"use client";

import dynamic from "next/dynamic";
import type { Character } from "@/content/types";
import styles from "@/components/room-pages.module.css";

const AgentGlobalMap = dynamic(
  () => import("@/components/agent-global-map").then((mod) => mod.AgentGlobalMap),
  {
    ssr: false,
    loading: () => <p className={styles.sectionIntro}>Loading deployment map...</p>,
  },
);

export function AgentGlobalMapLazy({ agents }: { agents: Character[] }) {
  return <AgentGlobalMap agents={agents} />;
}
