import type { Metadata } from "next";
import styles from "@/components/room-pages.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms governing access and use of the S.E.N.I.L.E. Interactive Archive.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  return (
    <main className={styles.pageWrap}>
      <section className={styles.sectionCard}>
        <h2>Terms &amp; Conditions</h2>
        <p className={styles.sectionIntro}>Terms governing access and use of the S.E.N.I.L.E. Interactive Archive.</p>
        <p className={styles.policyMeta}>Last updated: 15 February 2026</p>

        <div className={styles.policySection}>
          <h3>1. Acceptance</h3>
          <p>
            By accessing or using this site, you agree to these Terms. If you do not agree, you should stop using
            the site.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>2. Service Scope</h3>
          <p>
            The site provides narrative, archive, and publication information related to the S.E.N.I.L.E. project,
            including interactive progression systems and recruitment/newsletter functionality.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>3. Accounts and Access</h3>
          <p>
            No user account is currently required. Access to certain rooms/features may depend on progression and
            clearance states stored in-browser.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>4. Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Attempt to disrupt, damage, or reverse-engineer service infrastructure.</li>
            <li>Use automated abuse, scraping, or interference techniques beyond normal browsing.</li>
            <li>Submit unlawful, harmful, or deceptive content through forms.</li>
            <li>Misrepresent identity when using contact/recruitment channels.</li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h3>5. Intellectual Property</h3>
          <p>
            Site content, artwork, text, branding, and narrative materials are protected by intellectual property
            laws and remain the property of their respective rights holders unless otherwise stated.
          </p>
          <p>
            You may view and share links for personal, non-commercial use. Reproduction or distribution beyond this
            requires written permission.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>6. External Links</h3>
          <p>
            The site may link to third-party services (for example social platforms or reading destinations). We
            are not responsible for external content, terms, or privacy practices.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>7. Availability and Changes</h3>
          <p>
            Features, content, and progression logic may be changed, suspended, or removed at any time to support
            updates, maintenance, or narrative expansion.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>8. Disclaimer and Liability</h3>
          <p>
            The site is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, no
            warranty is given regarding uninterrupted availability or error-free operation.
          </p>
          <p>
            To the fullest extent permitted by law, Snappy Fox Ltd and associated project parties are not liable
            for indirect or consequential losses arising from use of the site.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>9. Privacy and Cookies</h3>
          <p>
            Use of the site is also governed by the Privacy Policy and Cookie Policy, including essential storage
            required for interactive progression continuity.
          </p>
        </div>

        <div className={styles.policySection}>
          <h3>10. Contact</h3>
          <p>For legal or policy questions, contact hello@snappyfox.co.uk.</p>
        </div>
      </section>
    </main>
  );
}
