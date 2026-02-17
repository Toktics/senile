"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { RoomGate } from "@/components/room-gate";
import { gadgets } from "@/content/archive-data";
import { loadArchiveState, saveArchiveState } from "@/lib/archive-state";
import styles from "@/components/room-pages.module.css";
import sceneStyles from "@/app/equipment-division/equipment-division.module.css";

type BriefingSpeaker = "watt" | "double" | "vision" | "decoder";

const BRIEFING_STEPS: Array<{ speaker: BriefingSpeaker; text: string }> = [
  {
    speaker: "watt",
    text: "Agent Watt, Equipment Division lead. Welcome to Q-Lab Test Floor.",
  },
  {
    speaker: "watt",
    text: "This lab prototypes containment tools for minor domestic anomalies before field release.",
  },
  {
    speaker: "double",
    text: "Agent Double reporting. Bench diagnostics are stable and tracking clean.",
  },
  {
    speaker: "vision",
    text: "Agent Vision confirms supervised access is clear across the lower test floor.",
  },
  {
    speaker: "watt",
    text: "Complete briefing, then activate the Decoder Lens station and unlock each equipment file from the scene.",
  },
];

const SPEAKER_NAME: Record<BriefingSpeaker, string> = {
  watt: "Agent Watt",
  double: "Agent Double",
  vision: "Agent Vision",
  decoder: "Decoder Station",
};

const SCENE_EQUIPMENT_ITEMS: Array<{
  gadgetId: string;
  objectSrc: string;
  objectAlt: string;
  top: string;
  left: string;
  width: number;
}> = [
  {
    gadgetId: "thermal-pillow-stabiliser",
    objectSrc: "/images/equipment/thermal-pillow-stabiliser.webp",
    objectAlt: "Thermal Pillow Stabiliser",
    top: "30%",
    left: "66%",
    width: 48,
  },
  {
    gadgetId: "micro-object-recovery-unit",
    objectSrc: "/images/equipment/micro-object-recovery-unit.webp",
    objectAlt: "Micro-Object Recovery Unit",
    top: "48%",
    left: "45%",
    width: 42,
  },
  {
    gadgetId: "sock-resonance-scanner",
    objectSrc: "/images/equipment/sock-resonance-scanner.webp",
    objectAlt: "Sock Resonance Scanner",
    top: "57%",
    left: "30.5%",
    width: 44,
  },
  {
    gadgetId: "sole-grip-paste",
    objectSrc: "/images/equipment/sole-grip-paste.webp",
    objectAlt: "Sole-Grip Paste",
    top: "48%",
    left: "58%",
    width: 40,
  },
];

const DECODER_FILE = {
  id: "decoder-lens",
  name: "Decoder Lens",
  tags: ["optics", "decode", "signal"],
  technicalDescription:
    "Phase-synchronized optic array that isolates low-amplitude narrative interference and converts it into readable archive signal.",
  usageProtocol:
    "Align lens toward encoded memo substrate, rotate focus ring until waveform settles, then capture decode pass in a single sweep.",
  image: {
    src: "/images/equipment/decoder-lens.webp",
    alt: "Decoder Lens object render",
    width: 400,
    height: 800,
  },
};

export default function EquipmentDivisionPage() {
  const [decoderIssued, setDecoderIssued] = useState<boolean>(() => loadArchiveState().decoderUnlocked);
  const [issueMessage, setIssueMessage] = useState("Decoder Lens pending requisition.");
  const [briefingStep, setBriefingStep] = useState(0);
  const [unlockedFiles, setUnlockedFiles] = useState<Set<string>>(() => {
    const state = loadArchiveState();
    const persisted = new Set(state.equipmentUnlocked);
    if (state.decoderUnlocked) {
      persisted.add(DECODER_FILE.id);
    }
    return persisted;
  });
  const [openFileId, setOpenFileId] = useState<string | null>(null);
  const [accessNotice, setAccessNotice] = useState<string | null>(null);
  const [activeClip, setActiveClip] = useState<null | "watt" | "double" | "vision1" | "vision2">(null);
  const [clipTick, setClipTick] = useState(0);
  const [pendingBriefingStep, setPendingBriefingStep] = useState<number | null>(null);
  const wattVideoRef = useRef<HTMLVideoElement | null>(null);
  const fileEntries = [...gadgets, DECODER_FILE];

  const briefingComplete = briefingStep >= BRIEFING_STEPS.length;
  const currentBriefing = briefingComplete ? null : BRIEFING_STEPS[briefingStep];
  const statusText = useMemo(() => {
    if (!briefingComplete) return "LOCKED";
    return decoderIssued ? "ISSUED" : "READY";
  }, [briefingComplete, decoderIssued]);

  const handleIssueDecoder = () => {
    if (!briefingComplete) {
      setIssueMessage("Complete Agent Watt briefing before Decoder Lens activation.");
      return;
    }

    const current = loadArchiveState();
    if (current.decoderUnlocked) {
      setDecoderIssued(true);
      setIssueMessage("Decoder Lens already issued to your profile.");
      return;
    }

    const next = { ...current, decoderUnlocked: true };
    next.equipmentUnlocked = Array.from(new Set([...next.equipmentUnlocked, DECODER_FILE.id]));
    saveArchiveState(next);
    setDecoderIssued(true);
    setUnlockedFiles((existing) => new Set([...existing, DECODER_FILE.id]));
    setIssueMessage("Decoder Lens issued. Founding Memo Decode and Agent Registry now available.");
  };

  const unlockEquipmentFile = (gadgetId: string, label: string) => {
    const state = loadArchiveState();
    if (!state.equipmentUnlocked.includes(gadgetId)) {
      saveArchiveState({ ...state, equipmentUnlocked: [...state.equipmentUnlocked, gadgetId] });
    }
    setUnlockedFiles((current) => {
      if (current.has(gadgetId)) return current;
      const next = new Set(current);
      next.add(gadgetId);
      return next;
    });
    setAccessNotice(null);
    setIssueMessage(`${label} file door unlocked.`);
  };

  const handleFileButton = (gadgetId: string, gadgetName: string) => {
    const unlocked = unlockedFiles.has(gadgetId);
    if (!unlocked) {
      setAccessNotice(`ACCESS DENIED: ${gadgetName}. Retrieve this item during Q-LAB training to unlock.`);
      return;
    }
    setAccessNotice(null);
    setOpenFileId((current) => (current === gadgetId ? null : gadgetId));
  };

  const playClip = (clip: "watt" | "double" | "vision1" | "vision2") => {
    setClipTick((value) => value + 1);
    setActiveClip(clip);
    window.setTimeout(() => {
      if (!wattVideoRef.current) return;
      wattVideoRef.current.currentTime = 0;
      void wattVideoRef.current.play().catch(() => {
        setActiveClip(null);
      });
    }, 20);
  };

  const handleClipFinished = () => {
    if (pendingBriefingStep !== null) {
      setBriefingStep(pendingBriefingStep);
      setPendingBriefingStep(null);
    }
    setActiveClip(null);
  };

  const handleAdvanceBriefing = () => {
    if (briefingStep === 0) {
      playClip("watt");
      setBriefingStep(1);
      return;
    }
    if (briefingStep === 1) {
      playClip("double");
      setPendingBriefingStep(2);
      return;
    }
    if (briefingStep === 2) {
      playClip("vision1");
      setPendingBriefingStep(3);
      return;
    }
    if (briefingStep === 3) {
      playClip("vision2");
      setPendingBriefingStep(4);
      return;
    }
    setBriefingStep((step) => step + 1);
  };

  return (
    <RoomGate roomId="equipment-division">
      <main className={`${styles.pageWrap} ${sceneStyles.equipmentPage}`}>
        <section className={`${styles.sectionCard} ${sceneStyles.sceneSection}`}>
          <div className={sceneStyles.sceneBackdrop} aria-hidden="true">
            <Image
              src="/images/scenes/equipment-division-scene-v2.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className={sceneStyles.sceneImage}
            />
          </div>
          <div className={sceneStyles.sceneOverlay}>
            {activeClip && (
              <div
                className={`${sceneStyles.wattVideoOverlay} ${
                  activeClip === "watt"
                    ? sceneStyles.wattVideoOverlayTopRight
                    : activeClip === "double"
                      ? sceneStyles.wattVideoOverlayBottomLeft
                      : sceneStyles.wattVideoOverlayBottomRight
                }`}
              >
                <video
                  key={`${activeClip}-${clipTick}`}
                  ref={wattVideoRef}
                  className={sceneStyles.wattVideo}
                  src={
                    activeClip === "watt"
                      ? "/images/animation/agent-watt-zoom.mp4"
                      : activeClip === "double"
                        ? "/images/animation/agent-double-zoom.mp4"
                        : activeClip === "vision1"
                          ? "/images/animation/agent-vision-zoom1.mp4"
                          : "/images/animation/agent-vision-zoom2.mp4"
                  }
                  muted
                  playsInline
                  autoPlay
                  preload="metadata"
                  onEnded={handleClipFinished}
                  onError={handleClipFinished}
                />
              </div>
            )}
            <div className={sceneStyles.sceneHeader}>
              <p className={sceneStyles.scenePlaque}>Equipment Division // Q-Lab Test Floor</p>
              <div className={sceneStyles.statusChip}>
                <span>Decoder Lens</span>
                <strong>{statusText}</strong>
              </div>
            </div>

            <aside className={`${sceneStyles.sideRail} ${sceneStyles.sideRailLeft}`} aria-hidden="true">
              <p>LIVE TELEMETRY</p>
              <span>THERMAL // STABLE</span>
              <span>QUEUE FLOW // GREEN</span>
              <span>BENCH LOAD // 62%</span>
            </aside>
            <aside className={`${sceneStyles.sideRail} ${sceneStyles.sideRailRight}`} aria-hidden="true">
              <p>ACTIVE KITS</p>
              <span>MINOR STABILISER</span>
              <span>LENS ARRAY</span>
              <span>REROUTE MODULE</span>
            </aside>

            <div className={`${sceneStyles.hotspot} ${sceneStyles.hotspotLead}`} aria-hidden="true">
              <span className={sceneStyles.hotspotDot} />
            </div>
            <div className={`${sceneStyles.hotspot} ${sceneStyles.hotspotFloor}`} aria-hidden="true">
              <span className={sceneStyles.hotspotDot} />
            </div>

            {SCENE_EQUIPMENT_ITEMS.map((item) => {
              const collected = unlockedFiles.has(item.gadgetId);
              return (
                <div
                  key={item.gadgetId}
                  className={`${sceneStyles.sceneItemWrap} ${collected ? sceneStyles.sceneItemCollected : ""}`}
                  style={{ top: item.top, left: item.left, "--item-size": `${item.width}px` } as CSSProperties}
                >
                  <Image
                    src={item.objectSrc}
                    alt={item.objectAlt}
                    width={item.width}
                    height={item.width * 2}
                    className={sceneStyles.sceneItemImage}
                    sizes="(max-width: 900px) 48px, 86px"
                  />
                  <button
                    type="button"
                    className={sceneStyles.sceneItemHotspot}
                    onClick={() => unlockEquipmentFile(item.gadgetId, item.objectAlt)}
                    aria-label={`Collect ${item.objectAlt}`}
                  />
                </div>
              );
            })}

            <button
              type="button"
              className={`${sceneStyles.hotspot} ${sceneStyles.hotspotDecoder} ${
                briefingComplete ? sceneStyles.hotspotDecoderReady : sceneStyles.hotspotDecoderLocked
              } ${decoderIssued ? `${sceneStyles.hotspotDecoderIssued} ${sceneStyles.hotspotHidden}` : ""}
              }`}
              onClick={handleIssueDecoder}
              aria-label="Decoder lens station"
              disabled={!briefingComplete}
            >
              <span className={sceneStyles.hotspotDot} />
            </button>
            <div
              className={`${sceneStyles.decoderProp} ${
                briefingComplete ? sceneStyles.decoderPropReady : ""
              } ${decoderIssued ? sceneStyles.decoderPropIssued : ""}`}
            >
              <Image
                src="/images/equipment/decoder-lens.webp"
                alt="Decoder Lens unit"
                width={70}
                height={140}
                className={sceneStyles.decoderPropImage}
                sizes="70px"
              />
            </div>

            {currentBriefing && (
              <div
                className={`${sceneStyles.comicBubble} ${
                  currentBriefing.speaker === "watt"
                    ? sceneStyles.comicBubbleWatt
                    : currentBriefing.speaker === "double"
                      ? sceneStyles.comicBubbleDouble
                      : currentBriefing.speaker === "vision"
                        ? sceneStyles.comicBubbleVision
                        : sceneStyles.comicBubbleDecoder
                }`}
                role="status"
                aria-live="polite"
              >
                <p className={sceneStyles.comicSpeaker}>{SPEAKER_NAME[currentBriefing.speaker]}</p>
                <p className={sceneStyles.comicText}>{currentBriefing.text}</p>
                <button
                  type="button"
                  className={sceneStyles.comicNext}
                  onClick={handleAdvanceBriefing}
                >
                  Next
                </button>
              </div>
            )}

            {briefingComplete && (
              <div className={sceneStyles.sceneControls}>
                <button type="button" className={sceneStyles.replayButton} onClick={() => setBriefingStep(0)}>
                  Replay Briefing
                </button>
              </div>
            )}

            <div className={sceneStyles.mobileConsole}>
              <button type="button" onClick={() => setBriefingStep(0)}>
                Agent Watt
              </button>
              <button type="button" onClick={() => setBriefingStep(2)}>
                Agent Double
              </button>
              <button type="button" onClick={handleIssueDecoder} disabled={!briefingComplete}>
                Decoder Lens
              </button>
            </div>
          </div>
        </section>

        <section className={`${styles.sectionCard} ${sceneStyles.contentSection}`}>
          <div className={sceneStyles.sceneContent}>
            <h1>Equipment File Doors</h1>
            <p className={styles.sectionIntro}>{issueMessage}</p>
            <p className={styles.metaLine}>Select equipment in the scene to unlock each corresponding dossier.</p>
            <div className={sceneStyles.fileDoorGrid}>
              {fileEntries.map((gadget) => {
                const unlocked = unlockedFiles.has(gadget.id);
                const isOpen = unlocked && openFileId === gadget.id;
                return (
                  <article
                    key={gadget.id}
                    className={`${sceneStyles.fileDoorCard} ${unlocked ? sceneStyles.fileDoorOpen : sceneStyles.fileDoorLocked}`}
                  >
                    <div className={sceneStyles.fileDoorHeader}>
                      <h3>{gadget.name}</h3>
                      <button
                        type="button"
                        className={`${sceneStyles.fileDoorButton} ${
                          unlocked ? sceneStyles.fileDoorButtonUnlocked : sceneStyles.fileDoorButtonLocked
                        }`}
                        onClick={() => handleFileButton(gadget.id, gadget.name)}
                      >
                        {unlocked ? (isOpen ? "CLOSE FILE" : "OPEN FILE") : "LOCKED"}
                      </button>
                    </div>
                    {!unlocked && (
                      <p className={sceneStyles.fileDoorLockMessage}>
                        Access restricted. Select this item inside the lab scene to unlock.
                      </p>
                    )}
                    {unlocked && isOpen && (
                      <div className={sceneStyles.fileDoorBody}>
                        {gadget.image && (
                          <div className={sceneStyles.objectFrame}>
                            <Image
                              src={gadget.image.src}
                              alt={gadget.image.alt}
                              width={gadget.image.width}
                              height={gadget.image.height}
                              className={sceneStyles.objectThumb}
                              sizes="(max-width: 768px) 100vw, 280px"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <p className={styles.metaLine}>Tags: {gadget.tags.join(" / ")}</p>
                        <p>{gadget.technicalDescription}</p>
                        <p>Protocol: {gadget.usageProtocol}</p>
                      </div>
                    )}
                    {unlocked && !isOpen && (
                      <p className={sceneStyles.fileDoorLockMessage}>File unlocked. Select OPEN FILE to view dossier.</p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        {accessNotice && (
          <div className={styles.deniedBackdrop} role="dialog" aria-modal="true" aria-label="Access denied notice">
            <div className={styles.deniedModal}>
              <p className={styles.deniedText}>ACCESS DENIED</p>
              <p className={styles.deniedSub}>{accessNotice}</p>
              <button type="button" className={styles.deniedClose} onClick={() => setAccessNotice(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </RoomGate>
  );
}
