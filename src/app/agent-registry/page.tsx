import Image from "next/image";
import { RoomGate } from "@/components/room-gate";
import { characters } from "@/content/archive-data";
import styles from "@/components/room-pages.module.css";

export default function AgentRegistryPage() {
  return (
    <RoomGate roomId="agent-registry">
      <main className={styles.pageWrap}>
        <section className={styles.sectionCard}>
          <h2>Agent Registry</h2>
          <p className={styles.sectionIntro}>
            Personnel note: Equipment requisition anomaly filed under Decoder Lens issue ticket.
          </p>
          <div className={styles.registryGrid}>
            {characters.map((agent) => (
              <article key={agent.id} className={styles.registryCard}>
                {agent.portrait && (
                  <div className={styles.assetFrame}>
                    <Image
                      src={agent.portrait.src}
                      alt={agent.portrait.alt}
                      width={agent.portrait.width}
                      height={agent.portrait.height}
                      className={styles.assetThumb}
                      sizes="(max-width: 768px) 100vw, 300px"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className={styles.metaLine}>{agent.codename}</p>
                <h3>{agent.name}</h3>
                <p>Clearance: {agent.clearanceLevel}</p>
                {agent.visibility === "RESTRICTED" ? (
                  <p>Profile restricted at director clearance.</p>
                ) : (
                  <>
                    <p>{agent.psychologicalNotes}</p>
                    <p>Known assignments: {agent.knownAssignments.join(", ")}</p>
                    <div className={styles.redactionBlock}>
                      {agent.redactedNotes.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </RoomGate>
  );
}
