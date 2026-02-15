"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/components/cookie-consent-banner.module.css";

type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  setAt: string;
};

const STORAGE_KEY = "senile-cookie-consent-v1";

function readConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(next: ConsentState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("cookie-consent-change"));
}

export function CookieConsentBanner() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return !readConsent();
  });

  useEffect(() => {
    const openPreferences = () => setOpen(true);
    window.addEventListener("open-cookie-preferences", openPreferences);
    return () => {
      window.removeEventListener("open-cookie-preferences", openPreferences);
    };
  }, []);

  const acceptAll = () => {
    writeConsent({
      essential: true,
      analytics: true,
      marketing: true,
      setAt: new Date().toISOString(),
    });
    setOpen(false);
  };

  const essentialOnly = () => {
    writeConsent({
      essential: true,
      analytics: false,
      marketing: false,
      setAt: new Date().toISOString(),
    });
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <aside className={styles.banner} role="dialog" aria-live="polite" aria-label="Cookie settings">
      <p className={styles.label}>Cookie Control Notice</p>
      <h2 className={styles.title}>Essential Archive Storage Active</h2>
      <p className={styles.copy}>
        We use essential cookies/storage to preserve puzzle progression, clearance state, and return-session
        continuity. Optional analytics and marketing cookies can be enabled or declined.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={acceptAll}>
          Accept All
        </button>
        <button type="button" className={styles.secondary} onClick={essentialOnly}>
          Essential Only
        </button>
      </div>
      <div className={styles.links}>
        <Link href="/cookie-policy">Cookie Policy</Link>
        <span aria-hidden="true">•</span>
        <Link href="/privacy-policy">Privacy Policy</Link>
      </div>
    </aside>
  );
}
