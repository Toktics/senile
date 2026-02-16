"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { caseFiles } from "@/content/archive-data";
import { RoomGate } from "@/components/room-gate";
import { loadArchiveState, saveArchiveState } from "@/lib/archive-state";
import styles from "@/components/room-pages.module.css";

export default function CaseRoomPage() {
  const [openedCaseId, setOpenedCaseId] = useState<string | null>(null);
  const [showDenied, setShowDenied] = useState(false);
  const [notice, setNotice] = useState<string>("");
  const [uvAcquired, setUvAcquired] = useState<boolean>(() => loadArchiveState().uvUnlocked);
  const openedPanelRef = useRef<HTMLElement | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  const openedCase = caseFiles.find((entry) => entry.id === openedCaseId);

  useEffect(() => {
    if (!openedCaseId) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      openedPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);

    return () => {
      window.clearTimeout(scrollTimer);
    };
  }, [openedCaseId]);

  const handleCaseDrawerOpen = (caseId: string) => {
    if (caseId === "case-001" || caseId === "case-002") {
      setOpenedCaseId(caseId);
      setShowDenied(false);
      const opened = caseFiles.find((entry) => entry.id === caseId);
      if (opened) {
        setNotice(`Clearance approved. Case ${opened.caseNumber} opened.`);
      }
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
      noticeTimerRef.current = window.setTimeout(() => {
        setNotice("");
      }, 2400);
      return;
    }

    setOpenedCaseId(null);
    setShowDenied(true);
  };

  const handleAcquireUvTorch = () => {
    const current = loadArchiveState();
    saveArchiveState({ ...current, uvUnlocked: true, uvEnabled: true });
    setUvAcquired(true);
    setNotice("Item recovered: UV Torch. New lead logged for Entry Archive inspection.");
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <RoomGate roomId="case-room">
      <main className={styles.pageWrap}>
        <section className={styles.sectionCard}>
          <h1>Case Room</h1>
          <p className={styles.sectionIntro}>Cabinet index available. Open drawers to inspect files.</p>
          {notice && <p className={styles.openNotice}>{notice}</p>}

          <div className={styles.cabinetGrid}>
            {caseFiles.map((entry) => (
              <article key={entry.id} className={styles.drawerUnit}>
                <button
                  type="button"
                  className={styles.drawerFace}
                  onClick={() => handleCaseDrawerOpen(entry.id)}
                  aria-label={`Open case file ${entry.caseNumber}`}
                >
                  <span className={styles.drawerLabelFrame}>
                    <span className={styles.drawerLabelText}>CASE {entry.caseNumber}</span>
                    <span className={styles.drawerMeta}>{entry.status}</span>
                    <span className={styles.drawerMeta}>TL {entry.threatLevel}</span>
                  </span>
                  <span className={styles.drawerHandle} />
                </button>
              </article>
            ))}
            <article className={styles.drawerUnit}>
              <div className={styles.drawerFace}>
                <span className={styles.drawerLabelFrame}>
                  <span className={styles.drawerLabelText}>RESERVE</span>
                  <span className={styles.drawerMeta}>CLASSIFIED</span>
                </span>
                <span className={styles.drawerHandle} />
              </div>
            </article>
            <article className={styles.drawerUnit}>
              <div className={styles.drawerFace}>
                <span className={styles.drawerLabelFrame}>
                  <span className={styles.drawerLabelText}>RESERVE</span>
                  <span className={styles.drawerMeta}>CLASSIFIED</span>
                </span>
                <span className={styles.drawerHandle} />
              </div>
            </article>
          </div>

          {openedCase && (
            <article
              ref={openedPanelRef}
              className={`${styles.sectionCard} ${styles.openedCasePanel}`}
              style={{ marginTop: "1rem" }}
            >
              {openedCase.image && (
                <div className={styles.assetFrame}>
                  <Image
                    src={openedCase.image.src}
                    alt={openedCase.image.alt}
                    width={openedCase.image.width}
                    height={openedCase.image.height}
                    className={styles.assetThumb}
                    sizes="(max-width: 768px) 100vw, 420px"
                    loading="eager"
                  />
                </div>
              )}
              <p className={styles.metaLine}>CASE FILE {openedCase.caseNumber} | OPENED DRAWER</p>
              <h3>{openedCase.title}</h3>
              <p className={styles.metaLine}>Threat Level: {openedCase.threatLevel}</p>
              {openedCase.caseNumber === "001" && openedCase.body ? (
                <>
                  {openedCase.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  <div className={styles.redactionBlock}>
                    <p>Lead Marker: Evidence Locker reference cross-linked to CASE 002.</p>
                    <p>Directive: open CASE 002 to recover inspection equipment.</p>
                  </div>
                  {!uvAcquired ? (
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={handleAcquireUvTorch}
                      style={{ marginTop: "0.7rem" }}
                    >
                      Retrieve UV Torch
                    </button>
                  ) : (
                    <>
                      <p className={styles.metaLine}>Item secured: UV Torch issued to your clearance profile.</p>
                      <div className={styles.redactionBlock}>
                        <p>Field Note: UV-reactive residue detected on Entry Hall cabinet marker.</p>
                        <p>Directive: Return to Home and inspect UV Inspection File station.</p>
                      </div>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        style={{ marginTop: "0.7rem" }}
                        onClick={() => (window.location.href = "/")}
                      >
                        Return to Home Station
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className={styles.redactionBlock}>
                  <p>Incident log: ██████████ thermal inconsistency recorded at 02:13.</p>
                  <p>Visible notes: surface temperature // right side // recurrence.</p>
                  <p>Containment instruction: monitor nightly variance for seven cycles.</p>
                </div>
              )}
              {openedCase.caseNumber === "002" && (
                <div style={{ marginTop: "0.8rem" }}>
                  <div className={styles.redactionBlock}>
                    <p>Supplementary file: thermal variance appendix.</p>
                    <p>No additional field equipment assigned from this drawer.</p>
                  </div>
                </div>
              )}
            </article>
          )}
        </section>
      </main>

      {showDenied && (
        <div
          className={styles.deniedBackdrop}
          role="dialog"
          aria-modal="true"
          onClick={() => setShowDenied(false)}
        >
          <div className={styles.deniedModal} onClick={(event) => event.stopPropagation()}>
            <Image
              src="/images/logos/senile-logo-wordmark-blue.webp"
              alt="S.E.N.I.L.E."
              width={244}
              height={63}
              className={styles.deniedLogo}
            />
            <p className={styles.deniedText}>ACCESS DENIED</p>
            <p className={styles.deniedSub}>RESTRICTED FILE. Insufficient clearance.</p>
            <button type="button" className={styles.deniedClose} onClick={() => setShowDenied(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </RoomGate>
  );
}
