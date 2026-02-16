import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/components/room-pages.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for the S.E.N.I.L.E. Interactive Archive and related services.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.pageWrap}>
      <section className={styles.sectionCard}>
        <h1>Privacy Policy</h1>
        <p className={styles.sectionIntro}>How personal data is used across the S.E.N.I.L.E. Interactive Archive.</p>
        <p className={styles.policyMeta}>Last updated: 15 February 2026</p>

        <div className={styles.policySection}>
          <h3>1. Who We Are</h3>
          <p>
            The S.E.N.I.L.E. Interactive Archive is operated by Snappy Fox Ltd on behalf of the S.E.N.I.L.E.
            publishing project. For data protection questions, contact: hello@snappyfox.co.uk.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>2. Data We Collect</h3>
          <p>Depending on how you use the site, we may process:</p>
          <ul>
            <li>Contact details you submit (for example, email address and optional name).</li>
            <li>Recruitment form content, including department selection and optional notes.</li>
            <li>Technical data such as browser type, device type, and IP-derived diagnostics.</li>
            <li>Essential progression data used to preserve puzzle/clearance state between visits.</li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h3>3. How We Use Data</h3>
          <p>We use data to:</p>
          <ul>
            <li>Deliver and maintain core site functionality.</li>
            <li>Preserve your archive progression and unlocked rooms across sessions.</li>
            <li>Process recruitment/newsletter submissions and send requested updates.</li>
            <li>Protect service integrity, prevent abuse, and troubleshoot issues.</li>
            <li>Improve content and experience quality over time.</li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h3>4. Lawful Basis</h3>
          <p>We rely on one or more of the following lawful bases where applicable:</p>
          <ul>
            <li>Performance of a contract (to deliver requested site features).</li>
            <li>Legitimate interests (security, reliability, service improvement).</li>
            <li>Consent (for optional communications and non-essential tracking where used).</li>
            <li>Legal obligations (where disclosure is required by law).</li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h3>5. Essential Progression Storage</h3>
          <p>
            To keep puzzle progression stable, the site stores strictly necessary progression data in browser
            storage (cookies and/or local storage equivalents). This includes power state, unlocked modules,
            clearance state, and related access flags.
          </p>
          <p>
            If essential storage is blocked or cleared, progression may reset and users may need to repeat
            onboarding and puzzle steps.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>6. Sharing and Processors</h3>
          <p>We do not sell personal data. We may share data with trusted service providers for:</p>
          <ul>
            <li>Site hosting and delivery infrastructure.</li>
            <li>Email/form processing providers.</li>
            <li>Security, anti-abuse, and operational support.</li>
          </ul>
          <p>Processors are limited to what is necessary to provide their service.</p>
        </div>

        <div className={styles.policySection}>
          <h3>7. Retention</h3>
          <ul>
            <li>Recruitment/contact submissions: retained until no longer needed for communications.</li>
            <li>Essential progression storage: retained in-browser until expired or manually cleared.</li>
            <li>Operational logs: retained for security and troubleshooting for a limited period.</li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h3>8. Your Rights</h3>
          <p>Subject to local law, you may request access, correction, deletion, restriction, or portability.</p>
          <p>To exercise rights, contact: hello@snappyfox.co.uk.</p>
        </div>

        <div className={styles.policySection}>
          <h3>9. Children</h3>
          <p>
            The site is designed for general audiences. Where personal data from minors is involved, parental or
            guardian oversight is expected in line with applicable law.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>10. Updates</h3>
          <p>
            This policy may be updated to reflect legal, operational, or product changes. The latest version is
            always published on this page.
          </p>
        </div>
      </section>
    </main>
  );
}
