import type { Metadata } from "next";
import Image from "next/image";
import { siteCopy } from "@/content/archive-data";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/components/room-pages.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Recruitment Terminal",
  description:
    "Submit a provisional field operative application for archive updates, containment notices, and authorised briefings.",
  path: "/recruitment-terminal",
});

type RecruitmentTerminalPageProps = {
  searchParams?: Promise<{
    submitted?: string;
  }>;
};

export default async function RecruitmentTerminalPage({ searchParams }: RecruitmentTerminalPageProps) {
  const params = (await searchParams) ?? {};
  const submitted = params.submitted === "1";

  return (
    <main className={styles.pageWrap}>
      <section className={styles.sectionCard}>
        <div className={styles.recruitmentLayout}>
          <div className={styles.recruitmentLeft}>
            <h1>RECRUITMENT TERMINAL</h1>
            <p className={styles.sectionIntro}>Provisional Field Operative Application</p>
            <p>
              Applicants are invited to submit credentials for limited clearance access to archive
              updates, containment notices, and authorised field briefings.
            </p>
            <p>
              S.E.N.I.L.E. maintains strict intake protocols.
              <br />
              Submission does not guarantee assignment.
            </p>

            <form
              className={styles.recruitmentForm}
              action="https://formsubmit.co/hello@snappyfox.co.uk"
              method="POST"
            >
              <input type="hidden" name="_subject" value="SENILE Recruitment" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value="/recruitment-terminal?submitted=1" />
              <input
                type="hidden"
                name="_autoresponse"
                value="Submission received by S.E.N.I.L.E. Intake. Your credentials are now under procedural review."
              />
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                className={styles.honeypotField}
                aria-hidden="true"
              />
              <label htmlFor="email">Contact Address (Secure Channel)</label>
              <input id="email" name="email" type="email" required />

              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" required />

              <label htmlFor="department">Preferred Department</label>
              <select id="department" name="department" required defaultValue="">
                <option value="" disabled>
                  Select department
                </option>
                <option value="Field Irregularities Response Unit">Field Irregularities Response Unit</option>
                <option value="Domestic Environmental Stability Taskforce">
                  Domestic Environmental Stability Taskforce
                </option>
                <option value="Minor Object Displacement Monitoring">
                  Minor Object Displacement Monitoring
                </option>
                <option value="Thermal Variance Oversight Committee">Thermal Variance Oversight Committee</option>
                <option value="Behavioural Ripple Analysis Bureau">Behavioural Ripple Analysis Bureau</option>
                <option value="Micro-Event Documentation Authority">Micro-Event Documentation Authority</option>
              </select>

              <label htmlFor="message">Operational Notes (Optional)</label>
              <textarea id="message" name="message" rows={4} placeholder="Observed anomaly details" />

              <button type="submit" className={styles.primaryButton}>
                Submit for Clearance
              </button>
            </form>

            {submitted && <p className={styles.confirmation}>{siteCopy.recruitmentConfirmation}</p>}
          </div>

          <aside className={styles.recruitmentImprint} aria-hidden="true">
            <Image
              src="/images/logos/senile-logo-mark-blue.webp"
              alt=""
              width={520}
              height={520}
              className={styles.recruitmentImprintLogo}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
