import type { Metadata } from "next";
import styles from "@/components/room-pages.module.css";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie and browser storage policy, including essential progression storage for returning S.E.N.I.L.E. visitors.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <main className={styles.pageWrap}>
      <section className={styles.sectionCard}>
        <h2>Cookie Policy</h2>
        <p className={styles.sectionIntro}>How cookies and browser storage are used across the archive.</p>
        <p className={styles.policyMeta}>Last updated: 15 February 2026</p>

        <div className={styles.policySection}>
          <h3>1. What We Use</h3>
          <p>
            We use cookies and browser storage technologies (including local storage) to operate core features,
            maintain progression state, and support platform reliability.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>2. Essential (Strictly Necessary) Storage</h3>
          <p>
            Essential storage is required for core archive functionality and cannot be disabled without affecting
            how the site works.
          </p>
          <ul>
            <li>Power restoration and onboarding state.</li>
            <li>Room unlocks and clearance progression.</li>
            <li>Puzzle milestones (for example UV, cabinet, keycard, decode state).</li>
            <li>Session integrity and anti-abuse safeguards.</li>
          </ul>
          <p>
            If this storage is rejected or deleted, users may lose progression and return to earlier states on the
            next visit.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>3. Optional Cookies</h3>
          <p>
            Where optional analytics or marketing cookies are introduced, they will be presented separately and
            managed through consent controls.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>4. Managing Cookies</h3>
          <p>
            You can manage cookies via browser settings. Most browsers allow blocking or deleting cookies and local
            storage.
          </p>
          <p>
            Note: blocking essential storage can prevent puzzle continuity, clearance persistence, and other core
            interactive functions.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>5. Duration</h3>
          <ul>
            <li>Session storage: removed when browser session ends.</li>
            <li>Persistent storage: retained until expiry or manual deletion.</li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h3>6. Contact</h3>
          <p>Questions about cookie usage can be sent to hello@snappyfox.co.uk.</p>
        </div>
      </section>
    </main>
  );
}
