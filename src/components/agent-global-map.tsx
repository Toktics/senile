"use client";

import Image from "next/image";
import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type { Character } from "@/content/types";
import styles from "@/components/agent-global-map.module.css";

type CountryNode = {
  id: string;
  label: string;
  top: string;
  left: string;
  agentIds?: string[];
  labelOffsetX?: number;
  labelOffsetY?: number;
};

const countryNodes: CountryNode[] = [
  { id: "usa", label: "USA", top: "36%", left: "18%", agentIds: ["agent-director"] },
  { id: "mexico", label: "MEXICO", top: "50%", left: "21%" },
  { id: "canada", label: "CANADA", top: "22%", left: "18%", agentIds: ["agent-file-12"] },
  {
    id: "england",
    label: "ENGLAND",
    top: "31%",
    left: "46%",
    agentIds: ["agent-sana", "agent-mt"],
    labelOffsetX: -26,
    labelOffsetY: 14,
  },
  {
    id: "scotland",
    label: "SCOTLAND",
    top: "24%",
    left: "45%",
    agentIds: ["agent-martin"],
    labelOffsetX: -38,
    labelOffsetY: 6,
  },
  {
    id: "france",
    label: "FRANCE",
    top: "37%",
    left: "47%",
    agentIds: ["agent-vale"],
    labelOffsetX: -18,
    labelOffsetY: 18,
  },
  {
    id: "germany",
    label: "GERMANY",
    top: "33%",
    left: "51%",
    agentIds: ["agent-bragg"],
    labelOffsetX: 40,
    labelOffsetY: 14,
  },
  { id: "russia", label: "RUSSIA", top: "23%", left: "64%", agentIds: ["agent-hinge"] },
  { id: "india", label: "INDIA", top: "54%", left: "67%", agentIds: ["agent-file-10"] },
  { id: "china", label: "CHINA", top: "42%", left: "75%", agentIds: ["agent-ohm"] },
  { id: "australia", label: "AUSTRALIA", top: "73%", left: "83%", agentIds: ["agent-harrow"] },
  { id: "japan", label: "JAPAN", top: "37%", left: "84%", agentIds: ["agent-file-11"] },
  { id: "brazil", label: "BRAZIL", top: "69%", left: "33%" },
  { id: "south-africa", label: "SOUTH AFRICA", top: "80%", left: "57%" },
];

const agentAvatarById: Record<string, string> = {
  "agent-sana": "/images/agents/1_GRIFFITHS.webp",
  "agent-martin": "/images/agents/2_KELVIN.webp",
  "agent-vale": "/images/agents/3_VALE.webp",
  "agent-mt": "/images/agents/4_MT.webp",
  "agent-bragg": "/images/agents/5_BRAGG.webp",
  "agent-hinge": "/images/agents/6_HINGE.webp",
  "agent-ohm": "/images/agents/7_OHM.webp",
  "agent-harrow": "/images/agents/8_HARROW.webp",
  "agent-director": "/images/agents/9_THE_DIRECTOR.webp",
};

const agentDossierById: Record<string, string> = {
  "agent-sana": "/images/agents/1.webp",
  "agent-martin": "/images/agents/2.webp",
  "agent-vale": "/images/agents/3.webp",
  "agent-mt": "/images/agents/4.webp",
  "agent-bragg": "/images/agents/5.webp",
  "agent-hinge": "/images/agents/6.webp",
  "agent-ohm": "/images/agents/7.webp",
  "agent-harrow": "/images/agents/8.webp",
  "agent-director": "/images/agents/9.webp",
};

const CLUSTER_TO_SPREAD_ZOOM = 1.22;

function markerOffset(index: number, total: number, spreadRadius: number) {
  if (total <= 1 || spreadRadius <= 0) {
    return { x: 0, y: 0 };
  }

  // Keep small-country stacks tight so agents stay visually inside the same country.
  if (total === 2) {
    return { x: index === 0 ? -spreadRadius : spreadRadius, y: 0 };
  }

  if (total === 3) {
    if (index === 0) return { x: 0, y: -spreadRadius };
    if (index === 1) return { x: -spreadRadius, y: spreadRadius };
    return { x: spreadRadius, y: spreadRadius };
  }

  const ringSize = 8;
  const ring = Math.floor(index / ringSize) + 1;
  const idxInRing = index % ringSize;
  const countInRing = Math.min(ringSize, total - (ring - 1) * ringSize);
  const angle = (idxInRing / countInRing) * Math.PI * 2 - Math.PI / 2;
  const radius = spreadRadius + (ring - 1) * 12;

  return {
    x: Math.round(Math.cos(angle) * radius),
    y: Math.round(Math.sin(angle) * radius),
  };
}

export function AgentGlobalMap({ agents }: { agents: Character[] }) {
  const agentsById = useMemo(
    () => new Map(agents.map((agent) => [agent.id, agent])),
    [agents],
  );

  const firstCountryWithAgent = countryNodes.find((node) => node.agentIds?.length);
  const initialCountry = firstCountryWithAgent ?? countryNodes[0];
  const initialAgentId = firstCountryWithAgent?.agentIds?.[0];

  const [activeCountryId, setActiveCountryId] = useState(initialCountry.id);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(initialAgentId ?? null);
  const [fileOpen, setFileOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const mapSurfaceRef = useRef<HTMLDivElement | null>(null);
  const detailCardRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const activeCountry = useMemo(
    () => countryNodes.find((node) => node.id === activeCountryId) ?? initialCountry,
    [activeCountryId, initialCountry],
  );

  const activeAgent = activeAgentId ? (agentsById.get(activeAgentId) ?? null) : null;
  const selectedAvatarSrc = activeAgent ? agentAvatarById[activeAgent.id] : undefined;
  const selectedDossierSrc = activeAgent ? agentDossierById[activeAgent.id] : undefined;

  const clampPan = (nextX: number, nextY: number, targetZoom = zoom) => {
    const surface = mapSurfaceRef.current;
    if (!surface || targetZoom <= 1) {
      return { x: 0, y: 0 };
    }
    const maxX = (surface.clientWidth * (targetZoom - 1)) / 2;
    const maxY = (surface.clientHeight * (targetZoom - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, nextX)),
      y: Math.min(maxY, Math.max(-maxY, nextY)),
    };
  };

  const applyZoom = (nextZoom: number) => {
    const clamped = Math.min(2.4, Math.max(1, Number(nextZoom.toFixed(2))));
    setZoom(clamped);
    setPan((current) => clampPan(current.x, current.y, clamped));
    if (clamped <= 1) {
      setDragging(false);
      dragRef.current = null;
    }
  };

  const handleSelection = (countryId: string, agentId: string | null) => {
    setActiveCountryId(countryId);
    setActiveAgentId(agentId);
    setFileOpen(false);

    window.setTimeout(() => {
      const detail = detailCardRef.current;
      if (!detail) return;
      const rect = detail.getBoundingClientRect();
      const offscreenTop = rect.top < 0;
      const offscreenBottom = rect.bottom > window.innerHeight;
      if (offscreenTop || offscreenBottom) {
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  const handleMapPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMapPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || zoom <= 1) return;
    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    const next = clampPan(dragRef.current.panX + deltaX, dragRef.current.panY + deltaY);
    setPan(next);
  };

  const endDrag = () => {
    setDragging(false);
    dragRef.current = null;
  };

  const handleWheelZoom = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const next = zoom + (event.deltaY < 0 ? 0.12 : -0.12);
    applyZoom(next);
  };

  const spreadRadius = Math.min(16, Math.max(0, Math.round((zoom - CLUSTER_TO_SPREAD_ZOOM) * 34)));

  return (
    <section className={styles.mapSection} aria-label="Global deployment map">
      <div className={styles.mapFrame}>
        <div className={styles.mapToolbar}>
          <button type="button" className={styles.zoomButton} onClick={() => applyZoom(zoom - 0.2)}>
            -
          </button>
          <span className={styles.zoomReadout}>{Math.round(zoom * 100)}%</span>
          <button type="button" className={styles.zoomButton} onClick={() => applyZoom(zoom + 0.2)}>
            +
          </button>
          <button
            type="button"
            className={styles.zoomReset}
            onClick={() => {
              applyZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            Reset
          </button>
        </div>

        <div
          ref={mapSurfaceRef}
          className={`${styles.mapSurface} ${dragging ? styles.mapSurfaceDragging : ""}`}
          role="application"
          aria-label="Global map with agent markers"
          onPointerDown={handleMapPointerDown}
          onPointerMove={handleMapPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onWheel={handleWheelZoom}
        >
          <div className={styles.mapCanvas} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
            {countryNodes.map((node) => {
              const nodeAgents = (node.agentIds ?? [])
                .map((agentId) => agentsById.get(agentId))
                .filter((agent): agent is Character => Boolean(agent));
              const isCountryActive = node.id === activeCountryId;
              const showClusterBubble = nodeAgents.length > 1 && zoom < CLUSTER_TO_SPREAD_ZOOM;

              return (
                <div key={node.id} className={styles.nodeWrap} style={{ top: node.top, left: node.left }}>
                  <div className={styles.nodeMarkers}>
                    {nodeAgents.length === 0 && (
                      <button
                        type="button"
                        className={`${styles.nodeButton} ${styles.nodeButtonVacant} ${styles.nodeButtonFloating}`}
                        style={{ "--offset-x": "0px", "--offset-y": "0px" } as CSSProperties}
                        onClick={() => handleSelection(node.id, null)}
                        aria-label={`${node.label} - vacant`}
                      >
                        <span className={styles.vacantDot} aria-hidden="true" />
                      </button>
                    )}

                    {showClusterBubble && (
                      <button
                        type="button"
                        className={`${styles.nodeButton} ${styles.nodeButtonFilled} ${styles.clusterButton} ${
                          isCountryActive ? styles.nodeButtonActive : ""
                        }`}
                        onClick={() => {
                          const preferredAgentId =
                            isCountryActive && activeAgentId && nodeAgents.some((agent) => agent.id === activeAgentId)
                              ? activeAgentId
                              : nodeAgents[0]?.id ?? null;
                          handleSelection(node.id, preferredAgentId);
                        }}
                        aria-label={`${node.label} - ${nodeAgents.length} active agents`}
                      >
                        <span className={styles.clusterCount}>{nodeAgents.length}</span>
                      </button>
                    )}

                    {!showClusterBubble &&
                      nodeAgents.map((agent, index) => {
                        const avatarSrc = agentAvatarById[agent.id];
                        const isAgentActive = isCountryActive && agent.id === activeAgentId;
                        const offset = markerOffset(index, nodeAgents.length, spreadRadius);
                        const markerStyle = {
                          "--offset-x": `${offset.x}px`,
                          "--offset-y": `${offset.y}px`,
                        } as CSSProperties;

                        return (
                          <button
                            key={`${node.id}-${agent.id}`}
                            type="button"
                            className={`${styles.nodeButton} ${styles.nodeButtonFilled} ${styles.nodeButtonFloating} ${
                              isAgentActive ? styles.nodeButtonActive : ""
                            }`}
                            style={markerStyle}
                            onClick={() => handleSelection(node.id, agent.id)}
                            aria-label={`${node.label} - ${agent.name}`}
                          >
                            {avatarSrc ? (
                              <Image
                                src={avatarSrc}
                                alt={agent.name}
                                width={40}
                                height={40}
                                className={styles.nodePortrait}
                                sizes="40px"
                              />
                            ) : (
                              <span className={styles.vacantDot} aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                  </div>

                  <span
                    className={`${styles.nodeLabel} ${isCountryActive ? styles.nodeLabelActive : ""}`}
                    style={
                      {
                        "--label-offset-x": `${node.labelOffsetX ?? 0}px`,
                        "--label-offset-y": `${node.labelOffsetY ?? 0}px`,
                      } as CSSProperties
                    }
                  >
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <article ref={detailCardRef} className={styles.detailCard} aria-live="polite">
        <button
          type="button"
          className={styles.fileTab}
          onClick={() => setFileOpen((prev) => !prev)}
          aria-expanded={fileOpen}
          aria-controls="agent-file-panel"
        >
          {fileOpen ? "CLOSE FILE" : "OPEN FILE"}
        </button>
        <p className={styles.detailMeta}>Active Location // {activeCountry.label}</p>
        {activeAgent ? (
          <>
            <div className={styles.detailHead}>
              {selectedAvatarSrc && (
                <Image
                  src={selectedAvatarSrc}
                  alt={activeAgent.name}
                  width={88}
                  height={88}
                  className={styles.detailPortrait}
                  sizes="88px"
                />
              )}
              <div>
                <h3>{activeAgent.name}</h3>
                <p className={styles.detailRole}>{activeAgent.codename}</p>
                <p className={styles.detailClearance}>Clearance: {activeAgent.clearanceLevel}</p>
              </div>
            </div>
            <div className={`${styles.filePreview} ${fileOpen ? styles.filePreviewHidden : ""}`}>
              {activeAgent.visibility === "RESTRICTED" ? (
                <p>Director lock active. Restricted profile preview only.</p>
              ) : (
                <>
                  <p>{activeAgent.psychologicalNotes}</p>
                  <p>Known assignments: {activeAgent.knownAssignments.join(", ")}</p>
                </>
              )}
            </div>
            <div id="agent-file-panel" className={`${styles.filePanel} ${fileOpen ? styles.filePanelOpen : ""}`}>
              {selectedDossierSrc && (
                <div className={styles.fileImageWrap}>
                  <Image
                    src={selectedDossierSrc}
                    alt={`${activeAgent.name} dossier file`}
                    width={1080}
                    height={1600}
                    className={styles.fileImage}
                    sizes="(max-width: 900px) 100vw, 560px"
                  />
                </div>
              )}
              {activeAgent.visibility === "RESTRICTED" ? (
                <p className={styles.detailBody}>Profile restricted at director clearance.</p>
              ) : (
                <>
                  <p className={styles.detailBody}>{activeAgent.psychologicalNotes}</p>
                  <p className={styles.detailBody}>
                    Known assignments: {activeAgent.knownAssignments.join(", ")}
                  </p>
                  <div className={styles.redactionBlock}>
                    {activeAgent.redactedNotes.map((note) => (
                      <p key={note}>{note}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div>
            <div className={`${styles.filePreview} ${fileOpen ? styles.filePreviewHidden : ""}`}>
              <p>No active operative assigned yet. Country node reserved for future deployment.</p>
            </div>
            <div id="agent-file-panel" className={`${styles.filePanel} ${fileOpen ? styles.filePanelOpen : ""}`}>
              <p className={styles.detailBody}>
                No active operative assigned yet. Country node reserved for future deployment.
              </p>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
