"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearArchiveState,
  defaultState,
  isRoomUnlocked,
  loadArchiveState,
  type ArchiveState,
  type RoomId,
} from "@/lib/archive-state";
import styles from "@/components/site-header.module.css";

type NavItem = {
  id: RoomId;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { id: "case-room", label: "Case Room", href: "/case-room" },
  { id: "agency-overview", label: "Agency Overview", href: "/agency-overview" },
  { id: "agent-registry", label: "Agent Registry", href: "/agent-registry" },
  { id: "equipment-division", label: "Equipment Division", href: "/equipment-division" },
  { id: "graphic-novel-division", label: "Graphic Novel Division", href: "/graphic-novel-division" },
  { id: "recruitment-terminal", label: "Recruitment Terminal", href: "/recruitment-terminal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleReset = () => {
    clearArchiveState();
    setMenuOpen(false);
    window.location.href = "/";
  };

  const handleHome = () => {
    setMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      <header className={styles.topBar}>
        <button type="button" className={styles.brandBlock} onClick={handleHome} aria-label="Return to home">
          <span className={styles.logoRow}>
            <Image
              src="/images/logos/senile-logo-wordmark-blue.webp"
              alt="S.E.N.I.L.E."
              width={244}
              height={63}
              className={styles.logoWordmark}
              priority
            />
          </span>
          <p className={styles.brandSub}>Society for the Extremely Normal, Important &amp; Little Events</p>
        </button>

        <p className={styles.topCenterTitle}>ARCHIVE HEADQUARTERS</p>

        <div className={styles.headerRight}>
          <div className={styles.bulletinBlock} aria-label="Public disclosure bulletin">
            <p className={styles.bulletinLabel}>Public Disclosure Bulletin</p>
            <p className={styles.bulletin}>Case 001 remains open for active review.</p>
          </div>
          <button type="button" className={styles.resetSessionButton} onClick={handleReset}>
            Restore Session
          </button>
        </div>

        <button
          type="button"
          className={styles.mobileMenuButton}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
      </header>

      <nav className={`${styles.navRow} ${menuOpen ? styles.navOpen : ""}`} aria-label="Archive navigation">
        {navItems.map((item) => {
          const unlocked = isRoomUnlocked(item.id, state);
          const isActive = pathname === item.href;

          if (!unlocked) {
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(event) => handleLockedClick(event, item.id)}
                className={`${styles.navItem} ${styles.navLocked}`}
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
              className={`${styles.navItem} ${isActive ? styles.navActive : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

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
