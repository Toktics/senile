"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { books } from "@/content/archive-data";
import styles from "@/components/graphic-novel-division.module.css";

const volume1Pages = [
  "/images/graphic novels/volume-1-page-1.webp",
  "/images/graphic novels/volume-1-page-2.webp",
  "/images/graphic novels/volume-1-page-3.webp",
  "/images/graphic novels/volume-1-page-4.webp",
];

const case001Pages = [
  "/images/graphic novels/case-001-page-1.webp",
  "/images/graphic novels/case-001-page-2.webp",
];

const volume2Pages = [
  "/images/graphic novels/volume-3.webp",
  "/images/agents/agent-hinge-card.webp",
  "/images/agents/agent-kelvin-card.webp",
  "/images/equipment/micro-object-recovery-unit-card.png",
  "/images/agents/director-card.webp",
];

const case002Pages = [
  "/images/graphic novels/case-002.webp",
  "/images/equipment/thermal-pillow-stabiliser-card.png",
  "/images/agents/dr-griffiths-card.webp",
  "/images/agents/agent-vale-card.webp",
  "/images/equipment/sole-grip-paste-card.png",
];

type BubbleId = "motion" | "volume-1" | "volume-2" | null;
type ReaderTarget = "volume-1" | "case-001" | "volume-2" | "case-002";

export function GraphicNovelDivisionExperience() {
  const transitionRef = useRef<HTMLElement | null>(null);
  const readerRef = useRef<HTMLElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [readerTarget, setReaderTarget] = useState<ReaderTarget>("volume-1");
  const [bubble, setBubble] = useState<BubbleId>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const section = transitionRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = Math.max(section.offsetHeight, 1);
      const viewportHeight = window.innerHeight;

      const start = sectionTop - viewportHeight * 0.2;
      const end = sectionTop + sectionHeight - viewportHeight * 0.45;
      const raw = (window.scrollY - start) / Math.max(end - start, 1);
      const clamped = Math.min(1, Math.max(0, raw));
      setProgress(clamped);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const parallaxY = reducedMotion ? 0 : Math.round(progress * 46);

  const transitionVars = useMemo(
    () => {
      const paperBlend = Math.min(1, Math.max(0, (progress - 0.08) / 0.7));
      const cardBlend = Math.min(1, Math.max(0, (progress - 0.14) / 0.58));
      const inkBlend = Math.min(1, Math.max(0, (progress - 0.24) / 0.26));
      const chromeBlend = Math.min(1, Math.max(0, progress / 0.64));

      return {
        "--bgBlend": progress.toFixed(3),
        "--paperOpacity": paperBlend.toFixed(3),
        "--chromeOpacity": (1 - chromeBlend).toFixed(3),
        "--gutterOpacity": paperBlend.toFixed(3),
        "--cardBlend": cardBlend.toFixed(3),
        "--inkBlend": inkBlend.toFixed(3),
      } as React.CSSProperties;
    },
    [progress],
  );

  const goToReader = useCallback((target: ReaderTarget) => {
    setReaderTarget(target);
    setPageIndex(0);
    if (!drawerOpen) {
      setDrawerOpen(true);
    }
    window.setTimeout(() => {
      readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 90);
  }, [drawerOpen]);

  const activePages = useMemo(() => {
    if (readerTarget === "case-001") return case001Pages;
    if (readerTarget === "volume-2") return volume2Pages;
    if (readerTarget === "case-002") return case002Pages;
    return volume1Pages;
  }, [readerTarget]);

  const readerTitle = useMemo(() => {
    if (readerTarget === "case-001") return "Case 001 Excerpt";
    if (readerTarget === "volume-2") return "Volume 2 Excerpt";
    if (readerTarget === "case-002") return "Case 002 Excerpt";
    return "Volume 1 Excerpt";
  }, [readerTarget]);

  const nextPage = () => setPageIndex((prev) => (prev + 1) % activePages.length);
  const prevPage = () => setPageIndex((prev) => (prev - 1 + activePages.length) % activePages.length);

  return (
    <main id="top" className={styles.page}>
      <section className={styles.archiveHeader}>
        <div className={styles.archiveHeaderInner}>
          <p className={styles.kicker}>Graphic Novel Division</p>
          <h1>Public Disclosure Program</h1>
          <p>
            Authorised releases translate active containment records into narrative case editions for external
            civilian readership.
          </p>
        </div>
      </section>

      <section className={styles.motionHeader} onMouseLeave={() => setBubble(null)}>
        <div className={styles.motionViewport}>
          <div className={styles.motionImageTrack} style={{ transform: `translateY(-${parallaxY}px)` }}>
            <Image
              src="/images/graphic novels/hero.webp"
              alt="Public disclosure banner collage from S.E.N.I.L.E. archive records"
              fill
              className={styles.motionImage}
              sizes="100vw"
              priority
            />
          </div>
          <button
            type="button"
            className={styles.hintHotspot}
            onMouseEnter={() => setBubble("motion")}
            onClick={() => setBubble((prev) => (prev === "motion" ? null : "motion"))}
            aria-label="Reveal disclosure hint"
          >
            {bubble === "motion" && (
              <span className={styles.speechBubble}>
                They&apos;ve labelled this &quot;Public Disclosure&quot;. That&apos;s... comforting.
              </span>
            )}
          </button>
        </div>
      </section>

      <section className={styles.booksAboutSection} aria-label="About the books">
        <div className={styles.booksAboutInner}>
          <article className={styles.booksAboutLead}>
            <h2>The smallest disruptions are never accidental.</h2>
            <p>
              Somewhere between a missing sock and a malfunctioning kettle lies the thin line that holds
              civilisation together.
            </p>
            <p>
              The Society for the Extremely Normal, Important &amp; Little Events exists to protect that line,
              intercepting minor irregularities before they become irreversible consequences.
            </p>
            <p className={styles.booksListBlock}>
              A remote that relocates itself.
              <br />
              A pillow that won&apos;t cool.
              <br />
              A queue that subtly refuses to move.
            </p>
            <p className={styles.booksListBlock}>
              Individually insignificant.
              <br />
              Collectively destabilising.
            </p>
            <p className={styles.booksListBlock}>
              Most people dismiss them.
              <br />
              S.E.N.I.L.E. does not.
            </p>
          </article>

          <article className={styles.booksAboutBody}>
            <p>
              When thirteen-year-old MarTin stumbles into their hidden headquarters beneath an ordinary
              launderette, he discovers that inconvenience is not random. Patterns exist. Someone is nudging
              the world, one irritation at a time.
            </p>
            <p>
              And as devices begin to degrade without explanation... batteries draining faster, screens
              faltering, tempers thinning, it becomes clear that the war on normality may be entering a second
              phase.
            </p>
            <p>
              These stories follow the agents tasked with containing the world&apos;s most minor disturbances, and
              the reluctant boy who discovers that behind every tiny inconvenience may lie a pattern no one else
              is willing to see.
            </p>
            <p>
              The tone is cinematic European adventure with understated comedy from total seriousness about
              absurdly small stakes, grounded in family pressure, responsibility, and the idea that small people
              and small things matter.
            </p>
            <p className={styles.booksClose}>
              Because civilisation rarely collapses in a single moment.
              <br />
              It frays.
            </p>
          </article>
        </div>
      </section>

      <section ref={transitionRef} className={styles.transitionShell} style={transitionVars}>
        <div className={styles.chromeWatermark} aria-hidden="true">
          S.E.N.I.L.E. ARCHIVE
        </div>

        <div className={styles.volumeGrid}>
          <article className={styles.volumePanel} onMouseLeave={() => setBubble((prev) => (prev === "volume-1" ? null : prev))}>
            <header className={styles.volumeHead}>
              <div className={styles.volumeMetaRow}>
                <p className={styles.volumeCode}>Volume 1 // Public Access</p>
                <p className={styles.volumeStatus}>
                  STATUS // <span>In Production</span>
                </p>
              </div>
              <h2>Volume 1: THE ODD SOCK CONSPIRACY</h2>
            </header>
            <div className={styles.coverWrap}>
              <Image
                src="/images/graphic novels/volume-1.webp"
                alt="Volume 1 cover: The Odd Sock Conspiracy"
                width={900}
                height={1350}
                className={styles.coverImage}
                sizes="(max-width: 900px) 100vw, 44vw"
              />
              <button
                type="button"
                className={styles.hintHotspotSmall}
                onMouseEnter={() => setBubble("volume-1")}
                onClick={() => setBubble((prev) => (prev === "volume-1" ? null : "volume-1"))}
                aria-label="Reveal volume hint"
              >
                {bubble === "volume-1" && (
                  <span className={styles.speechBubbleSmall}>If this is the public file, imagine what got redacted.</span>
                )}
              </button>
            </div>
            <p className={styles.volumeSummary}>
              A deadpan spy-thriller graphic novel for 8–12 readers where 13-year-old MarTin discovers
              S.E.N.I.L.E. (Society for the Extremely Normal, Important &amp; Little Events), a secret agency
              that treats tiny everyday annoyances (missing socks, squeaky hinges, crooked clocks) as serious
              national-security threats. MarTin is recruited after stumbling into their hidden headquarters
              under a launderette, initially for the money to help his overworked mum, but gradually uncovers
              a real pattern of deliberate tiny disruptions engineered to destabilise normal life.
            </p>
            <div className={styles.ctaRow}>
              <button
                type="button"
                className={styles.primaryCta}
                onClick={() => {
                  goToReader("volume-1");
                }}
              >
                Open Volume 1
              </button>
              <button type="button" className={styles.linkCta} onClick={() => goToReader("volume-1")}>
                Read an excerpt
              </button>
            </div>
          </article>

          <article className={styles.volumePanel} onMouseLeave={() => setBubble((prev) => (prev === "volume-2" ? null : prev))}>
            <header className={styles.volumeHead}>
              <div className={styles.volumeMetaRow}>
                <p className={styles.volumeCode}>Case 001 // Public Access</p>
                <p className={styles.volumeStatus}>
                  STATUS // <span>Available on WEBTOON</span>
                </p>
              </div>
              <h2>Case 001: THE KETTLE DESYNCHRONISATION EVENT</h2>
            </header>
            <div className={styles.coverWrap}>
              <Image
                src="/images/graphic novels/volume-2.webp"
                alt="Case 001 cover: The Kettle Desynchronisation Event"
                width={800}
                height={1200}
                className={styles.coverImage}
                sizes="(max-width: 900px) 100vw, 44vw"
              />
              <button
                type="button"
                className={styles.hintHotspotSmall}
                onMouseEnter={() => setBubble("volume-2")}
                onClick={() => setBubble((prev) => (prev === "volume-2" ? null : "volume-2"))}
                aria-label="Reveal classified hint"
              >
                {bubble === "volume-2" && (
                  <span className={styles.speechBubbleSmall}>This says Volume 2 is classified. I&apos;m shocked. Obviously.</span>
                )}
              </button>
            </div>
            <p className={styles.volumeSummary}>
              The Kettle Desynchronisation Event is a deadpan spy-thriller graphic novel for 8–12 readers
              where 13-year-old MarTin takes on his first official S.E.N.I.L.E. case: a mysterious nationwide
              spike in kettles refusing to boil at precisely the temperature each morning. What begins as a
              &ldquo;Level 3 Infrastructure Incident&rdquo; spirals into briefings, field tests, and statistical
              panic as the agency scrambles to contain what they believe is a coordinated attack on normal
              life. Armed with a Portable Kettle Testing Kit and far too many spreadsheets, MarTin starts to
              question whether the threat is real - or whether the system&apos;s reaction is creating the crisis
              itself. As friendships strain and surveillance tightens, MarTin must decide what it truly means
              to protect the extremely normal.
            </p>
            <div className={styles.ctaRow}>
              <button type="button" className={styles.primaryCta} onClick={() => goToReader("case-001")}>
                Open Case 001
              </button>
              <button type="button" className={styles.linkCta} onClick={() => goToReader("case-001")}>
                Read an excerpt
              </button>
            </div>
          </article>

          <article className={styles.volumePanel}>
            <header className={styles.volumeHead}>
              <div className={styles.volumeMetaRow}>
                <p className={styles.volumeCode}>Volume 2 // REDACTED</p>
                <p className={styles.volumeStatus}>
                  STATUS // <span>In the Pipeline</span>
                </p>
              </div>
              <h2>Volume 2: THE DEVICE DEGRADATION DIRECTIVE</h2>
            </header>
            <div className={styles.coverWrap}>
              <Image
                src="/images/graphic novels/volume-3.webp"
                alt="Volume 2 cover"
                width={800}
                height={1200}
                className={styles.coverImage}
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
            <p className={styles.volumeSummary}>
              Device integrity incidents escalate from domestic inconvenience to operational concern as
              cross-household failures begin following a repeatable cadence pattern.
            </p>
            <div className={styles.ctaRow}>
              <button type="button" className={styles.secondaryCta} aria-disabled="true">
                REDACTED
              </button>
            </div>
          </article>

          <article className={styles.volumePanel}>
            <header className={styles.volumeHead}>
              <div className={styles.volumeMetaRow}>
                <p className={styles.volumeCode}>Case 002 // REDACTED</p>
                <p className={styles.volumeStatus}>
                  STATUS // <span>Coming Soon</span>
                </p>
              </div>
              <h2>Case 002: The Alarm Clock Conspiracy</h2>
            </header>
            <div className={styles.coverWrap}>
              <Image
                src="/images/graphic novels/case-002.webp"
                alt="Case 002 cover"
                width={800}
                height={1200}
                className={styles.coverImage}
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
            <p className={styles.volumeSummary}>
              Coordinated alarm timing drift produces mass routine desynchronisation, triggering delayed starts,
              missed intervals, and compounding morning-chain disruptions.
            </p>
            <div className={styles.ctaRow}>
              <button type="button" className={styles.secondaryCta} aria-disabled="true">
                REDACTED
              </button>
            </div>
          </article>
        </div>

        <section ref={readerRef} className={`${styles.readerDrawer} ${drawerOpen ? styles.readerDrawerOpen : ""}`}>
          <header className={styles.readerHeader}>
            <div>
              <p className={styles.readerKicker}>Inline Reader</p>
              <h3>{readerTitle}</h3>
            </div>
            <button type="button" className={styles.closeCta} onClick={() => setDrawerOpen(false)}>
              Close
            </button>
          </header>

          <div className={styles.readerViewport}>
            <button type="button" className={styles.readerNav} onClick={prevPage} aria-label="Previous excerpt page">
              ‹
            </button>
            <div className={styles.readerPage}>
              <Image
                src={activePages[pageIndex]}
                alt={`${readerTitle} page ${pageIndex + 1}`}
                width={900}
                height={1350}
                className={styles.readerImage}
                sizes="(max-width: 900px) 95vw, 780px"
              />
            </div>
            <button type="button" className={styles.readerNav} onClick={nextPage} aria-label="Next excerpt page">
              ›
            </button>
          </div>

          <div className={styles.readerFooter}>
            <p>
              Page {pageIndex + 1} / {activePages.length}
            </p>
            <div className={styles.readerLinks}>
              <a href={books[0]?.webtoonUrl ?? "https://www.webtoons.com/"} target="_blank" rel="noreferrer">
                Continue on Webtoon
              </a>
              <a href="/recruitment-terminal">Get notified</a>
              <a href="#top">Back to Archive Grid</a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
