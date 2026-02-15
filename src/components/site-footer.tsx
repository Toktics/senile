"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  defaultState,
  isRoomUnlocked,
  loadArchiveState,
  type ArchiveState,
  type RoomId,
} from "@/lib/archive-state";
import styles from "@/components/site-footer.module.css";

type FooterNavItem = {
  id: RoomId;
  label: string;
  href: string;
};

const footerNavItems: FooterNavItem[] = [
  { id: "graphic-novel-division", label: "Graphic Novel Division", href: "/graphic-novel-division" },
  { id: "recruitment-terminal", label: "Recruitment Terminal", href: "/recruitment-terminal" },
  { id: "case-room", label: "Case Room", href: "/case-room" },
  { id: "agency-overview", label: "Agency Overview", href: "/agency-overview" },
  { id: "agent-registry", label: "Agent Registry", href: "/agent-registry" },
  { id: "equipment-division", label: "Equipment Division", href: "/equipment-division" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const [showDenied, setShowDenied] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState(
    "Clearance Level Insufficient. Validate internal systems through Agency Overview.",
  );
  const [version, setVersion] = useState(0);
  const state: ArchiveState = typeof window === "undefined" ? defaultState : loadArchiveState();
  void version;

  useEffect(() => {
    const handleStateChange = () => setVersion((prev) => prev + 1);
    window.addEventListener("archive-state-change", handleStateChange);
    window.addEventListener("storage", handleStateChange);
    return () => {
      window.removeEventListener("archive-state-change", handleStateChange);
      window.removeEventListener("storage", handleStateChange);
    };
  }, []);

  const handleLockedClick = (event: React.MouseEvent, roomId: RoomId) => {
    event.preventDefault();
    if (roomId === "case-room") {
      setDeniedMessage("Field Directive: inspect the Supply Cupboard to obtain initial clearance.");
    } else {
      setDeniedMessage("Clearance Level Insufficient. Validate internal systems through Agency Overview.");
    }
    setShowDenied(true);
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.socialTopRow} aria-label="Social channels">
            <div className={styles.socialRow}>
              <a
                href="https://www.instagram.com/senile.06/"
                target="_blank"
                rel="noreferrer"
                className={styles.socialButton}
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className={styles.socialIcon} aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="4" ry="4" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="17.2" cy="6.8" r="1" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@senile06"
                target="_blank"
                rel="noreferrer"
                className={styles.socialButton}
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" className={styles.socialIcon} aria-hidden="true">
                  <path d="M14 3v9.2a3.2 3.2 0 1 1-2.2-3V7.6A5.4 5.4 0 1 0 16 12.8V8.9a5 5 0 0 0 3.4 1.3V8a3.5 3.5 0 0 1-3.4-3.5V3h-2z" />
                </svg>
              </a>
              <a
                href="https://www.webtoons.com/en/canvas"
                target="_blank"
                rel="noreferrer"
                className={styles.socialButton}
                aria-label="Webtoon Canvas"
              >
                <svg viewBox="0 0 24 24" className={styles.socialIconWebtoon} aria-hidden="true">
                  <path d="M4 4.7 20 3l-1.1 7.2h2.7l-2 9.1-6.2 1.7v-3.2H7l.8-5.9H5.2z" />
                  <path d="m8.4 9.2.9 3 .9-3h1.2l.9 3 .9-3h1.4l-1.8 5.6h-1.1l-1-3.1-1 3.1H8.7L6.9 9.2z" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.mainRow}>
            <div className={styles.brandCenter}>
              <Image
                src="/images/logos/SENILE Logo1.png"
                alt="S.E.N.I.L.E."
                width={220}
                height={90}
                className={styles.footerLogo}
              />
              <p className={styles.brandLine}>Society for the Extremely Normal, Important &amp; Little Events</p>
            </div>

            <div className={styles.accessBlock}>
              <p className={styles.footerLabel}>Archive Access Grid</p>
              <nav className={styles.footerNav} aria-label="Footer archive navigation">
                {footerNavItems.map((item) => {
                  const unlocked = isRoomUnlocked(item.id, state);
                  const isActive = pathname === item.href;

                  if (!unlocked) {
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        onClick={(event) => handleLockedClick(event, item.id)}
                        className={`${styles.footerButton} ${styles.footerButtonLocked}`}
                        aria-disabled="true"
                      >
                        {item.label}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`${styles.footerButton} ${isActive ? styles.footerButtonActive : ""}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className={styles.bottomRow}>
            <p className={styles.copyright}>© 2026 S.E.N.I.L.E. All rights reserved.</p>
            <a
              className={styles.madeBy}
              href="https://www.snappyfox.co.uk"
              target="_blank"
              rel="noreferrer"
            >
              <span>Site by Snappy Fox Ltd</span>
              <Image
                src="/images/snappy_fox_logo.png"
                alt=""
                width={24}
                height={24}
                className={styles.madeByLogo}
                aria-hidden="true"
              />
            </a>
            <div className={styles.policyRow}>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <span aria-hidden="true">•</span>
              <Link href="/cookie-policy">Cookie Policy</Link>
              <span aria-hidden="true">•</span>
              <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </footer>

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
            <p className={styles.deniedText}>CLEARANCE LEVEL INSUFFICIENT</p>
            <p className={styles.deniedSub}>{deniedMessage}</p>
            <button type="button" className={styles.deniedClose} onClick={() => setShowDenied(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
