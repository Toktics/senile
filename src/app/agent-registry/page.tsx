import type { Metadata } from "next";
import { RoomGate } from "@/components/room-gate";
import { AgentGlobalMap } from "@/components/agent-global-map";
import { characters } from "@/content/archive-data";
import styles from "@/components/room-pages.module.css";

export const metadata: Metadata = {
  title: "Agent Registry",
  description: "Personnel dossiers, clearance notes, and assignment logs from the S.E.N.I.L.E. registry.",
  alternates: { canonical: "/agent-registry" },
};

export default function AgentRegistryPage() {
  return (
    <RoomGate roomId="agent-registry">
      <main className={styles.pageWrap}>
        <section className={styles.sectionCard}>
          <h2>Agent Registry</h2>
          <p className={styles.sectionIntro}>
            Active global deployment map. Select a country marker to open the assigned operative file.
          </p>
          <AgentGlobalMap agents={characters} />
        </section>
      </main>
    </RoomGate>
  );
}
