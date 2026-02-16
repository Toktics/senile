"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultState, loadArchiveState, saveArchiveState, type ArchiveState } from "@/lib/archive-state";
import styles from "@/components/archive-onboarding.module.css";

const DIRECTOR_CODE = "0712";

export function ArchiveExperience() {
  const router = useRouter();
  const [state, setState] = useState<ArchiveState>(() => loadArchiveState());
  const [directorCodeInput, setDirectorCodeInput] = useState("");
  const [directorCodeMessage, setDirectorCodeMessage] = useState("");
  const [activeModule, setActiveModule] = useState<"cupboard" | "uv" | "cabinet" | "sublevel" | "memo" | null>(null);
  const [showModuleDenied, setShowModuleDenied] = useState(false);
  const [anomalySubmitted, setAnomalySubmitted] = useState(false);
  const activeModuleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") {
      saveArchiveState(defaultState);
      params.delete("reset");
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
      window.location.replace(nextUrl);
      return;
    }

    if (params.get("anomaly_submitted") === "1") {
      setAnomalySubmitted(true);
    }
  }, []);

  useEffect(() => {
    if (!activeModule) {
      return;
    }

    const timer = window.setTimeout(() => {
      activeModuleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [activeModule]);

  useEffect(() => {
    const syncState = () => {
      setState(loadArchiveState());
    };

    window.addEventListener("archive-state-change", syncState);
    window.addEventListener("storage", syncState);
    window.addEventListener("pageshow", syncState);

    return () => {
      window.removeEventListener("archive-state-change", syncState);
      window.removeEventListener("storage", syncState);
      window.removeEventListener("pageshow", syncState);
    };
  }, []);

  const updateState = (patch: Partial<ArchiveState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      saveArchiveState(next);
      return next;
    });
  };

  const handleBegin = () => {
    const nextState = { ...state, onboarded: true };
    setState(nextState);
    saveArchiveState(nextState);
    router.push("/case-room");
  };

  return (
    <>
      <section className={styles.entrySequence} aria-label="Power Restoration">
        <Image
          src="/images/scenes/hero.png"
          alt="Archive headquarters wide interior view"
          fill
          className={styles.entryBackdrop}
          sizes="100vw"
          quality={72}
          priority
        />
        <div className={`${styles.fluorescentGlow} ${state.powerRestored ? styles.restored : styles.dark}`} aria-hidden="true" />
        {state.uvEnabled && !state.cabinetUnlocked && (
          <div className={styles.sceneCodeReveal} aria-hidden="true">
            <p className={styles.sceneCodeLabel}>UV TRACE DETECTED</p>
            <p className={styles.sceneCodeDigits}>0712</p>
          </div>
        )}

        <div className={styles.entryHeroRow}>
          <aside className={`${styles.powerRail} ${state.powerRestored ? styles.powerRailOn : ""}`} aria-label="Power control">
            <p className={styles.railLabel}>Archive Power</p>
            <h1 className={styles.railTitle}>Restoration Panel</h1>
            <button
              type="button"
              className={`${styles.flickSwitch} ${state.powerRestored ? styles.flickSwitchOn : ""}`}
              onClick={() => updateState({ powerRestored: true })}
              aria-label="Flick switch to restore power"
            >
              <span className={styles.flickTrack} />
              <span className={styles.flickKnob} />
            </button>
            <p className={styles.railHint}>{state.powerRestored ? "POWER RESTORED" : "GRID OFFLINE"}</p>
          </aside>

          <div className={`${styles.heroCopy} ${!state.powerRestored ? styles.heroCopyAlert : ""}`}>
            <h2 className={styles.heroTitle}>Power Restoration Protocol</h2>
            <p className={styles.heroStatusLine}>
              {state.powerRestored ? "System state confirmed. Continue to containment access." : "Awaiting switch activation."}
            </p>
          </div>
        </div>
      </section>

      {state.powerRestored && (
        <section className={styles.moduleDeck}>
          <div className={styles.roomGrid}>
            <article className={styles.shelfCard}>
              <h2>Supply Cupboard</h2>
              <p>Inspection required.</p>
              <button
                type="button"
                className={`${styles.secondaryButton} ${styles.cupboardButton}`}
                onClick={() => {
                  const nextOpen = !state.cupboardOpen;
                  updateState({ cupboardOpen: nextOpen });
                  setActiveModule(nextOpen ? "cupboard" : null);
                }}
              >
                {state.cupboardOpen ? "Close Cupboard" : "Open Cupboard"}
              </button>
            </article>

            <article className={styles.shelfCard}>
              <h2 className={styles.uvCabinetTitle}>UV Inspection File</h2>
              <p className={styles.metaLine}>
                {state.uvUnlocked ? "Torch registered. Inspect surface for latent markings." : "Torch required to inspect."}
              </p>
              <button
                type="button"
                className={`${styles.secondaryButton} ${styles.cupboardButton} ${
                  !state.uvUnlocked ? styles.lockedAction : ""
                }`}
                onClick={() => {
                  if (!state.uvUnlocked) {
                    setShowModuleDenied(true);
                    return;
                  }
                  setActiveModule("uv");
                }}
              >
                {state.uvUnlocked ? (state.cabinetUnlocked ? "OPEN FILE" : "OPEN FILE") : "LOCKED"}
              </button>
            </article>

            <article className={styles.shelfCard}>
              <h2>Director Archive Cabinet</h2>
              <p className={styles.metaLine}>Restricted records and keycard registry.</p>
              <button
                type="button"
                className={`${styles.secondaryButton} ${styles.cupboardButton} ${
                  !state.cabinetUnlocked ? styles.lockedAction : ""
                }`}
                onClick={() => {
                  if (!state.cabinetUnlocked) {
                    setShowModuleDenied(true);
                    return;
                  }
                  setActiveModule("cabinet");
                }}
              >
                {state.cabinetUnlocked ? "OPEN FILE" : "LOCKED"}
              </button>
            </article>

            <article className={styles.shelfCard}>
              <h2>Sublevel Access</h2>
              <p className={styles.metaLine}>Keycard entry to lower archive segment.</p>
              <button
                type="button"
                className={`${styles.secondaryButton} ${styles.cupboardButton} ${
                  !state.sublevelUnlocked ? styles.lockedAction : ""
                }`}
                onClick={() => {
                  if (!state.sublevelUnlocked) {
                    setShowModuleDenied(true);
                    return;
                  }
                  setActiveModule("sublevel");
                }}
              >
                {state.sublevelUnlocked ? "OPEN FILE" : "LOCKED"}
              </button>
            </article>

            <article className={styles.shelfCard}>
              <h2>Founding Memo Decode</h2>
              <p className={styles.metaLine}>Lens-assisted reveal layer.</p>
              <button
                type="button"
                className={`${styles.secondaryButton} ${styles.cupboardButton} ${
                  !state.decoderUnlocked ? styles.lockedAction : ""
                }`}
                onClick={() => {
                  if (!state.decoderUnlocked) {
                    setShowModuleDenied(true);
                    return;
                  }
                  setActiveModule("memo");
                }}
              >
                {state.decoderUnlocked ? "OPEN FILE" : "LOCKED"}
              </button>
            </article>
          </div>

          <article id="anomaly-report" className={styles.anomalyPanel}>
            <div className={styles.anomalyHeader}>
              <p className={styles.anomalyAlert}>Unauthorised access event logged. Proceed under controlled protocol.</p>
              <p className={styles.anomalyStamp}>Agency Notice // Priority Queue</p>
              <h3>REPORT ANOMALIES</h3>
              <p className={styles.anomalyLead}>
                Small disruptions matter.
                <br />
                We notice.
                <br />
                You notice.
              </p>
            </div>

            <form
              className={styles.anomalyForm}
              action="https://formsubmit.co/hello@snappyfox.co.uk"
              method="POST"
            >
              <input type="hidden" name="_subject" value="ANOMALIES REPORTED" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value="/?anomaly_submitted=1#anomaly-report" />
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                className={styles.honeypotField}
                aria-hidden="true"
              />

              <div className={styles.anomalyField}>
                <label htmlFor="anomaly-name">Name</label>
                <input id="anomaly-name" name="name" type="text" required placeholder="Agent designation" />
              </div>

              <div className={styles.anomalyField}>
                <label htmlFor="anomaly-email">Your email</label>
                <input id="anomaly-email" name="email" type="email" required placeholder="agent@securemail.com" />
              </div>

              <div className={styles.anomalyField}>
                <label htmlFor="anomaly-type">Anomaly description</label>
                <select id="anomaly-type" name="anomaly_description" required defaultValue="">
                  <option value="" disabled>
                    Select anomaly type
                  </option>
                  <option value="Missing Sock Phenomenon">Missing Sock Phenomenon</option>
                  <option value="Phantom Notification">Phantom Notification</option>
                  <option value="Queue Paradox">Queue Paradox</option>
                  <option value="Alarm Clock Desync">Alarm Clock Desync</option>
                  <option value="Pavement Tile Wobble">Pavement Tile Wobble</option>
                  <option value="Pen Click Fatigue">Pen Click Fatigue</option>
                </select>
              </div>

              <p className={styles.anomalyLegal}>
                By submitting this observation you acknowledge that minor inconsistencies in daily routine may
                constitute a threat to national caffeinated cohesion. Your report will be reviewed by a Junior
                Analyst at a time of our choosing.
              </p>

              <button type="submit" className={styles.anomalySubmit}>
                SUBMIT OBSERVATION
              </button>
            </form>

            {anomalySubmitted && (
              <p className={styles.confirmation}>
                We will notify you of any important information updates in due course. S.E.N.I.L.E. appreciates
                your compliance.
              </p>
            )}
          </article>

          {activeModule === "uv" && (
            <article ref={activeModuleRef} className={styles.signCard}>
              <h3>Director Cabinet Access</h3>
              <form
                className={styles.codeForm}
                onSubmit={(event) => {
                  event.preventDefault();
                  if (directorCodeInput.trim() !== DIRECTOR_CODE) {
                    setDirectorCodeMessage("ACCESS DENIED. Invalid code.");
                    return;
                  }
                  const next = { ...state, cabinetUnlocked: true, agencyOverviewUnlocked: true };
                  setState(next);
                  saveArchiveState(next);
                  setDirectorCodeMessage("Access approved. Director cabinet unlocked. Agency Overview route authorised.");
                }}
              >
                <label htmlFor="director-code-home">Enter Code</label>
                <input
                  id="director-code-home"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={directorCodeInput}
                  onChange={(event) => setDirectorCodeInput(event.target.value)}
                />
                <button type="submit" className={styles.secondaryButton}>
                  Submit
                </button>
                {directorCodeMessage && <p className={styles.metaLine}>{directorCodeMessage}</p>}
              </form>
            </article>
          )}

          {activeModule === "cabinet" && state.cabinetUnlocked && (
            <article ref={activeModuleRef} className={styles.signCard}>
              <h3>Director Archive Contents</h3>
              <div className={styles.cabinetRevealGrid}>
                <section className={styles.cabinetReportPanel}>
                  <div className={styles.redactionBlock}>
                    <p>Founding memo and redacted internal report retrieved.</p>
                    <p>Reference tag: L.U.N.A.T.I.C.-adjacent logistics note detected.</p>
                    {state.keycardCollected ? (
                      <>
                        <p>Keycard issued to operative profile.</p>
                        <p>Clearance escalation filed. Proceed to Agency Overview and use the wall reader.</p>
                      </>
                    ) : (
                      <>
                        <p>Keycard located in records tray.</p>
                        <p>Retrieve issued keycard before attempting internal systems validation.</p>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => router.push("/agency-overview")}
                  >
                    Open Agency Overview
                  </button>
                </section>

                <aside className={styles.keycardPanel}>
                  <p className={styles.keycardPanelLabel}>Issued Credential</p>
                  <div className={styles.keycardImageFrame}>
                    <Image
                      src="/images/keycard-issued.png"
                      alt="Issued S.E.N.I.L.E. internal keycard"
                      width={900}
                      height={560}
                      className={styles.keycardImage}
                      sizes="(max-width: 720px) 100vw, 320px"
                      loading="lazy"
                    />
                  </div>
                  {!state.keycardCollected ? (
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => updateState({ keycardCollected: true })}
                    >
                      Retrieve Keycard
                    </button>
                  ) : (
                    <p className={styles.metaLine}>Keycard retrieved and assigned to active profile.</p>
                  )}
                </aside>
              </div>
            </article>
          )}

          {activeModule === "sublevel" && state.sublevelUnlocked && (
            <article ref={activeModuleRef} className={styles.signCard}>
              <h3>Sublevel Access Console</h3>
              <p>Sublevel opened. Antique key logged for future protocol.</p>
              <p className={styles.metaLine}>Further containment layers scheduled in future revision.</p>
            </article>
          )}

          {activeModule === "memo" && state.decoderUnlocked && (
            <article ref={activeModuleRef} className={styles.signCard}>
              <h3>Founding Memo (Decoded)</h3>
              <div className={styles.redactionBlock}>████████████████████████████████████████</div>
              <p>Decoded line: environment control experiments approved under silent logistics protocol.</p>
              {!state.sublevelUnlocked ? (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    const next = { ...state, sublevelUnlocked: true };
                    setState(next);
                    saveArchiveState(next);
                  }}
                >
                  Authorise Sublevel Access
                </button>
              ) : (
                <p className={styles.metaLine}>Sublevel clearance granted.</p>
              )}
            </article>
          )}

          {activeModule === "cupboard" && state.cupboardOpen && (
            <article ref={activeModuleRef} className={styles.signCard}>
              <div className={styles.assetFrame}>
                <Image
                  src="/images/scenes/archive-cupboard-interior-v1.webp"
                  alt="Supply cupboard interior with field assets and case materials"
                  width={1024}
                  height={1536}
                  className={styles.assetThumb}
                  sizes="(max-width: 768px) 100vw, 520px"
                  loading="lazy"
                />
              </div>
              <h3>THE SOCIETY FOR THE EXTREMELY NORMAL, IMPORTANT &amp; LITTLE EVENTS</h3>
              <p>
                Established in response to escalating micro-anomalies with potential
                macro-destabilisation impact.
              </p>
              <p>We exist to intercept the ripple before it becomes the wave.</p>
              <p>Current Priority Sectors:</p>
              <ul>
                <li>Sock Displacement Events</li>
                <li>Thermal Pillow Variance</li>
                <li>Boiling Latency Irregularities</li>
                <li>Remote Control Migration</li>
              </ul>

              <button
                type="button"
                className={`${styles.secondaryButton} ${styles.cupboardButton}`}
                onClick={() => updateState({ briefingOpen: !state.briefingOpen })}
              >
                JUNIOR FIELD OPERATIVE BRIEFING
              </button>

              {state.briefingOpen && (
                <div className={styles.briefingBlock}>
                  <p>As a provisional field operative, you have been granted temporary archive access.</p>
                  <p>Your objective is simple:</p>
                  <p>Observe. Identify. Contain.</p>
                  <p>
                    The smallest anomaly left unchecked can destabilise the domestic ecosystem.
                  </p>
                  <button type="button" className={styles.primaryButton} onClick={handleBegin}>
                    Begin in the Case Room
                  </button>
                </div>
              )}
            </article>
          )}
        </section>
      )}

      {showModuleDenied && (
        <div
          className={styles.deniedBackdrop}
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModuleDenied(false)}
        >
          <div className={styles.deniedModal} onClick={(event) => event.stopPropagation()}>
            <Image
              src="/images/logos/senile-logo-wordmark-blue.webp"
              alt="S.E.N.I.L.E."
              width={244}
              height={63}
              className={styles.deniedLogo}
            />
            <p className={styles.deniedTitle}>ACCESS DENIED</p>
            <p className={styles.deniedSub}>Module remains locked pending prior clearance steps.</p>
            <button type="button" className={styles.secondaryButton} onClick={() => setShowModuleDenied(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
