"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
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

const SCENE_EQUIPMENT_HOTSPOTS: Array<{
  gadgetId: string;
  label: string;
  top: string;
  left: string;
}> = [
  { gadgetId: "thermal-pillow-stabiliser", label: "Thermal Chamber", top: "50%", left: "57%" },
  { gadgetId: "micro-object-recovery-unit", label: "Recovery Unit", top: "59%", left: "40%" },
  { gadgetId: "sock-resonance-scanner", label: "Resonance Scanner", top: "73%", left: "47%" },
  { gadgetId: "sole-grip-paste", label: "Sole-Grip Paste", top: "73%", left: "54%" },
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
    return state.decoderUnlocked ? new Set([DECODER_FILE.id]) : new Set();
  });
  const [openFileId, setOpenFileId] = useState<string | null>(null);
  const [accessNotice, setAccessNotice] = useState<string | null>(null);
  const [wattAnimPlaying, setWattAnimPlaying] = useState(false);
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
    saveArchiveState(next);
    setDecoderIssued(true);
    setUnlockedFiles((existing) => new Set([...existing, DECODER_FILE.id]));
    setIssueMessage("Decoder Lens issued. Founding Memo Decode and Agent Registry now available.");
  };

  const unlockEquipmentFile = (gadgetId: string, label: string) => {
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

  const playWattAnimation = () => {
    setWattAnimPlaying(true);
    window.setTimeout(() => {
      if (!wattVideoRef.current) return;
      void wattVideoRef.current.play().catch(() => {
        setWattAnimPlaying(false);
      });
    }, 20);
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
            {wattAnimPlaying && (
              <div className={sceneStyles.wattVideoOverlay}>
                <video
                  ref={wattVideoRef}
                  className={sceneStyles.wattVideo}
                  src="/images/animation/agent-watt-zoom.mp4"
                  muted
                  playsInline
                  autoPlay
                  preload="metadata"
                  onEnded={() => setWattAnimPlaying(false)}
                  onError={() => setWattAnimPlaying(false)}
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

            {SCENE_EQUIPMENT_HOTSPOTS.map((hotspot) => (
              <button
                key={hotspot.gadgetId}
                type="button"
                className={sceneStyles.equipmentHotspot}
                style={{ top: hotspot.top, left: hotspot.left }}
                onClick={() => unlockEquipmentFile(hotspot.gadgetId, hotspot.label)}
                aria-label={`Unlock ${hotspot.label} file door`}
              >
                {hotspot.label}
              </button>
            ))}

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
                  onClick={() => setBriefingStep((step) => step + 1)}
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
                <button
                  type="button"
                  className={sceneStyles.wattAnimButton}
                  onClick={playWattAnimation}
                  disabled={wattAnimPlaying}
                >
                  {wattAnimPlaying ? "Playing..." : "Animate Agent Watt"}
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
            {accessNotice && <p className={sceneStyles.accessDenied}>{accessNotice}</p>}
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
      </main>
    </RoomGate>
  );
}
