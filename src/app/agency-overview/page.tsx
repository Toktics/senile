"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomGate } from "@/components/room-gate";
import { loadArchiveState, saveArchiveState } from "@/lib/archive-state";
import styles from "@/app/agency-overview/agency-overview.module.css";

const founders = [
  {
    id: "keating",
    name: "Dr. Seamus Keaiting",
    role: "Scientific Stability Protocol",
    title: "Chemical Systems Analyst",
    detail:
      "Specialised in low-reactivity compound behaviour and domestic material equilibrium modelling.",
    image: "/images/founders/Seamus.png",
  },
  {
    id: "whitcombe",
    name: "Professor Eleanor Whitcombe",
    role: "Environmental Calibration",
    title: "Applied Physicist",
    detail:
      "Developed early atmospheric variance frameworks for enclosed domestic environments.",
    image: "/images/founders/Eleanor.png",
  },
  {
    id: "rao",
    name: "Dr. Nikiil Rao",
    role: "Neurological Irritation Metrics",
    title: "Behavioural Biologist",
    detail:
      "Established threshold accumulation models linking minor disruptions to measurable behavioural shift.",
    image: "/images/founders/Nikiil.png",
  },
  {
    id: "tarasov",
    name: "Lt. Lev Ustin Nikolai Adamoff Tarasov",
    role: "Infrastructure Calibration & Continuity",
    title: "Systems Engineer",
    detail:
      "Designed distributed calibration systems for thermal irregularity containment and timing synchronisation.",
    image: "/images/founders/Ustin.png",
  },
  {
    id: "chen",
    name: "Dr. Liyda Chen",
    role: "Logistics & Retrieval Operations",
    title: "Materials Engineer",
    detail:
      "Pioneered structural fatigue mapping and displacement recovery protocols across domestic object networks.",
    image: "/images/founders/Liyda.png",
  },
  {
    id: "caldwell",
    name: "Dr. Everett Caldwell",
    role: "Emotional Equilibrium Oversight",
    title: "Social Systems Analyst",
    detail:
      "Advocated preventative intervention frameworks to maintain collective routine stability.",
    image: "/images/founders/Everett.png",
  },
] as const;

const logoTimeline = [
  { year: "1954", src: "/images/logos/logo_1954.png", alt: "S.E.N.I.L.E. identity mark from 1954" },
  { year: "1972", src: "/images/logos/logo_1972.png", alt: "S.E.N.I.L.E. identity mark from 1972" },
  { year: "1997", src: "/images/logos/logo_1997.png", alt: "S.E.N.I.L.E. identity mark from 1997" },
  { year: "2000", src: "/images/logos/logo_2000.png", alt: "S.E.N.I.L.E. identity mark from 2000" },
  { year: "2018", src: "/images/logos/logo_2018.png", alt: "S.E.N.I.L.E. identity mark from 2018" },
  { year: "2026", src: "/images/logos/SENILE Logo1.png", alt: "S.E.N.I.L.E. identity mark from 2026" },
] as const;

export default function AgencyOverviewPage() {
  const router = useRouter();
  const [validated, setValidated] = useState<boolean>(() => loadArchiveState().agencyValidated);
  const [doorOpen, setDoorOpen] = useState<boolean>(() => loadArchiveState().agencyValidated);
  const [scanning, setScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState(() => {
    const current = loadArchiveState();
    if (current.agencyValidated) {
      return "Internal systems already validated. Equipment Division available.";
    }
    return current.keycardCollected
      ? "Issued keycard detected in operative inventory. Ready for validation."
      : "Clearance credential not detected. Retrieve issued keycard from Director Archive Cabinet.";
  });
  const [activeFounderId, setActiveFounderId] = useState<string>(founders[0].id);

  const handleValidate = () => {
    const current = loadArchiveState();
    if (current.agencyValidated) {
      setValidated(true);
      setDoorOpen(true);
      setStatusMessage("Internal systems already validated. Equipment Division available.");
      return;
    }
    if (!current.keycardCollected) {
      setStatusMessage(
        "Clearance Level Insufficient. Did you pick up the keycard from the Director Archive Cabinet?",
      );
      return;
    }

    setScanning(true);
    setStatusMessage("Authenticating issued keycard...");
    window.setTimeout(() => {
      const next = { ...loadArchiveState(), agencyValidated: true };
      saveArchiveState(next);
      setValidated(true);
      setDoorOpen(true);
      setScanning(false);
      setStatusMessage("Access granted. Equipment Division unlocked.");
    }, 900);
  };

  const activeFounder = founders.find((founder) => founder.id === activeFounderId) ?? founders[0];

  return (
    <RoomGate roomId="agency-overview">
      <main className={styles.corridorPage}>
        <div className={styles.contentWrap}>
          <div className={styles.ceilingLight} aria-hidden="true" />
          <div className={styles.upperBand} aria-hidden="true" />

          <div className={styles.stageGrid}>
            <section className={styles.doorZone} aria-label="Agency corridor entrance">
              <div className={styles.plaque}>Equipment Division</div>
              <button
                type="button"
                className={`${styles.keypadButton} ${scanning ? styles.keypadButtonScanning : ""} ${
                  validated ? styles.keypadButtonValidated : ""
                }`}
                onClick={handleValidate}
                aria-label="Validate keycard for internal systems"
                disabled={scanning}
              >
                {validated ? "VALIDATED" : "PRESENT KEYCARD"}
              </button>
              <div className={styles.keypadStatus}>
                <p className={styles.keypadStatusLabel}>Internal Reader</p>
                <p className={styles.keypadStatusText}>{statusMessage}</p>
                <button type="button" className={styles.keypadAction} onClick={handleValidate} disabled={scanning}>
                  {scanning ? "Validating..." : validated ? "Validation Confirmed" : "Use Keycard Reader"}
                </button>
                {validated && (
                  <button
                    type="button"
                    className={styles.keypadActionPrimary}
                    onClick={() => router.push("/equipment-division")}
                  >
                    Enter Equipment Division
                  </button>
                )}
              </div>
              <div className={`${styles.doorFrame} ${doorOpen ? styles.doorFrameOpen : ""}`}>
                <div className={`${styles.door} ${doorOpen ? styles.doorOpen : ""}`}>
                  <div className={styles.window} aria-hidden="true" />
                  <div className={styles.handle} aria-hidden="true" />
                </div>
              </div>
            </section>

            <section className={styles.introPanel}>
              <div className={styles.introTitleRow}>
                <Image
                  src="/images/logos/senile-logo-mark-blue.webp"
                  alt="S.E.N.I.L.E. Mark"
                  width={56}
                  height={56}
                  className={styles.introLogoMark}
                  priority
                />
                <h1>AGENCY OVERVIEW</h1>
              </div>
              <p className={styles.metaLine}>Founding Charter // Internal Copy</p>
              <p className={styles.leadLine}>
                S.E.N.I.L.E. exists to identify and contain minor domestic irregularities before they
                aggregate into behavioural instability across households.
              </p>
              <p className={styles.supportLine}>We operate discreetly to preserve continuity of the ordinary.</p>
            </section>
          </div>

          <section className={styles.moduleStack}>
            <article className={`${styles.overviewBlock} ${styles.moduleA}`}>
                <h2>Strategic Structure</h2>
                <div className={styles.structureLayout}>
                  <ul className={styles.structureList}>
                    <li>Directorate</li>
                    <li>Field Operations</li>
                    <li>Equipment Division</li>
                    <li>Documentation Bureau</li>
                    <li>Containment Support</li>
                  </ul>
                  <section className={styles.structureDiagram} aria-label="Strategic command architecture">
                    <p className={styles.diagramTitle}>Strategic Command Architecture</p>
                    <div className={styles.diagramCanvas}>
                      <div className={styles.nodeTop}>Directorate</div>
                      <div className={styles.nodeMidRow}>
                        <div className={styles.nodeMid}>Field Operations</div>
                        <div className={styles.nodeMid}>Documentation Bureau</div>
                        <div className={styles.nodeMid}>Equipment Division</div>
                      </div>
                      <div className={styles.nodeBottom}>Containment Support</div>
                    </div>
                  </section>
                </div>
            </article>

            <article className={`${styles.overviewBlock} ${styles.moduleB}`}>
                <h2>Executive Mandate</h2>
                <div className={styles.protocolGrid}>
                  <p>Detect early</p>
                  <p>Document precisely</p>
                  <p>Intervene proportionately</p>
                  <p>Restore continuity</p>
                </div>
            </article>

            <article className={`${styles.overviewBlock} ${styles.moduleC}`}>
                <h2>Notification &amp; Neutralisation Framework</h2>
                <div className={styles.doctrineLines}>
                  <p>Classify event.</p>
                  <p>Assign operative.</p>
                  <p>Issue calibrated toolkit.</p>
                  <p>Record post-containment domestic baseline.</p>
                </div>
            </article>

            <article className={`${styles.overviewBlock} ${styles.moduleD}`}>
                <h2>Institutional History</h2>
                <p>
                  Formally constituted in the mid-20th century following a documented rise in
                  &ldquo;unexplained irritation clusters,&rdquo; the Society has operated discreetly to
                  preserve environmental and emotional equilibrium.
                </p>
                <p>Founded by six independent specialists operating across multiple disciplines.</p>
            </article>

            <article className={`${styles.overviewBlock} ${styles.moduleE}`}>
                <h2>Legacy Directorate</h2>
                <div className={styles.founderGrid}>
                  {founders.map((founder) => (
                    <button
                      key={founder.id}
                      type="button"
                      className={`${styles.founderCard} ${
                        founder.id === activeFounder.id ? styles.founderCardActive : ""
                      }`}
                      onClick={() => setActiveFounderId(founder.id)}
                    >
                      <span className={styles.founderPortrait} aria-hidden="true">
                        {founder.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <span className={styles.founderName}>{founder.name}</span>
                      <span className={styles.founderRole}>{founder.role}</span>
                    </button>
                  ))}
                </div>
                <article className={styles.founderDetail}>
                  <div className={styles.founderDetailImageWrap}>
                    <Image
                      src={activeFounder.image}
                      alt={activeFounder.name}
                      width={720}
                      height={900}
                      className={styles.founderDetailImage}
                      sizes="(max-width: 760px) 100vw, 320px"
                      loading="lazy"
                    />
                  </div>
                  <h3>{activeFounder.name}</h3>
                  <p className={styles.metaLine}>{activeFounder.role}</p>
                  <p>{activeFounder.title}</p>
                  <p>{activeFounder.detail}</p>
                </article>
            </article>

            <article className={`${styles.overviewBlock} ${styles.moduleF}`}>
                <h2>Evolution of Identity</h2>
                <div className={styles.timelineRow}>
                  {logoTimeline.map((entry) => (
                    <article key={entry.year} className={styles.timelineCard}>
                      <div className={styles.timelineImageWrap}>
                        <Image
                          src={entry.src}
                          alt={entry.alt}
                          width={320}
                          height={240}
                          className={styles.timelineImage}
                          sizes="(max-width: 760px) 100vw, 240px"
                          loading="lazy"
                        />
                      </div>
                      <p className={styles.timelineYear}>{entry.year}</p>
                    </article>
                  ))}
                </div>
                <p className={styles.metaLine}>Visual identity revisions reflect operational expansion.</p>
            </article>
          </section>
        </div>
      </main>
    </RoomGate>
  );
}
