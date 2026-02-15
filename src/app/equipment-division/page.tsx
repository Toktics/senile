"use client";

import Image from "next/image";
import { useState } from "react";
import { RoomGate } from "@/components/room-gate";
import { gadgets } from "@/content/archive-data";
import { loadArchiveState, saveArchiveState } from "@/lib/archive-state";
import styles from "@/components/room-pages.module.css";

export default function EquipmentDivisionPage() {
  const [decoderIssued, setDecoderIssued] = useState<boolean>(() => loadArchiveState().decoderUnlocked);
  const [issueMessage, setIssueMessage] = useState("Decoder Lens pending requisition.");

  const handleIssueDecoder = () => {
    const current = loadArchiveState();
    if (current.decoderUnlocked) {
      setDecoderIssued(true);
      setIssueMessage("Decoder Lens already issued to your profile.");
      return;
    }

    const next = { ...current, decoderUnlocked: true };
    saveArchiveState(next);
    setDecoderIssued(true);
    setIssueMessage("Decoder Lens issued. Founding Memo Decode and Agent Registry now available.");
  };

  return (
    <RoomGate roomId="equipment-division">
      <main className={styles.pageWrap}>
        <section className={styles.sectionCard}>
          <h2>Equipment Division</h2>
          <p className={styles.sectionIntro}>{issueMessage}</p>
          {!decoderIssued && (
            <button type="button" className={styles.secondaryButton} onClick={handleIssueDecoder}>
              Issue Decoder Lens
            </button>
          )}
          {decoderIssued && (
            <p className={styles.metaLine}>Clearance update filed. Return to Home for Founding Memo Decode.</p>
          )}
          <div className={styles.equipmentGrid}>
            {gadgets.map((gadget) => (
              <article key={gadget.id} className={styles.equipmentCard}>
                {gadget.image && (
                  <div className={styles.assetFrame}>
                    <Image
                      src={gadget.image.src}
                      alt={gadget.image.alt}
                      width={gadget.image.width}
                      height={gadget.image.height}
                      className={styles.assetThumb}
                      sizes="(max-width: 768px) 100vw, 280px"
                      loading="lazy"
                    />
                  </div>
                )}
                <h3>{gadget.name}</h3>
                <p className={styles.metaLine}>Tags: {gadget.tags.join(" / ")}</p>
                <p>{gadget.technicalDescription}</p>
                <p>Protocol: {gadget.usageProtocol}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </RoomGate>
  );
}
