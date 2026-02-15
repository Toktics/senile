import type { Book, CaseFile, Character, Gadget, SiteCopy } from "@/content/types";

export const caseFiles: CaseFile[] = [
  {
    id: "case-001",
    caseNumber: "001",
    title: "The Vanishing Left Sock",
    threatLevel: "AMBER-3",
    status: "OPEN",
    publishDate: "2026-02-13",
    previewSnippets: ["laundry cycle", "single sock", "repeat location drift"],
    destination: { kind: "hosted" },
    image: {
      src: "/images/cases/case-001-cover.webp",
      alt: "Case 001 cover card showing a domestic anomaly evidence file",
      width: 900,
      height: 1350,
    },
    body: [
      "At 06:42 local time, Subject Household-11 reported a left sock failing to complete standard dryer egress.",
      "Search grid deployment found no thermal, magnetic, or pet-related extraction vector.",
      "A second left sock vanished at 09:10 while all doors were closed and all baskets remained stationary.",
      "Containment Protocol S-4 initiated. Family instructed to log all sock pairings for seven consecutive days.",
      "Working hypothesis: low-grade domestic anomaly with escalation potential if pair-collapse ratio exceeds 38%.",
    ],
  },
  {
    id: "case-002",
    caseNumber: "002",
    title: "Pillow Thermal Drift",
    threatLevel: "YELLOW-2",
    status: "REDACTED",
    publishDate: "2026-02-20",
    previewSnippets: ["surface temperature", "right side", "02:13 incident"],
    destination: { kind: "hosted" },
    image: {
      src: "/images/cases/case-002-redacted.webp",
      alt: "Redacted case card with sock anomaly image",
      width: 800,
      height: 1200,
    },
  },
  {
    id: "case-003",
    caseNumber: "003",
    title: "Kettle Boiling Latency",
    threatLevel: "AMBER-2",
    status: "REDACTED",
    publishDate: "2026-02-27",
    previewSnippets: ["boil time", "water unchanged", "operator agitation"],
    destination: { kind: "hosted" },
  },
  {
    id: "case-004",
    caseNumber: "004",
    title: "Remote Control Migration",
    threatLevel: "AMBER-1",
    status: "REDACTED",
    publishDate: "2026-03-05",
    previewSnippets: ["cushion depth", "line of sight", "recurring displacement"],
    destination: { kind: "hosted" },
  },
  {
    id: "case-005",
    caseNumber: "005",
    title: "Tea Spoon Echoes",
    threatLevel: "YELLOW-1",
    status: "REDACTED",
    publishDate: "2026-03-12",
    previewSnippets: ["drawer count", "metallic audio", "sink perimeter"],
    destination: { kind: "hosted" },
  },
  {
    id: "case-006",
    caseNumber: "006",
    title: "Toast Surface Divergence",
    threatLevel: "ORANGE-2",
    status: "REDACTED",
    publishDate: "2026-03-19",
    previewSnippets: ["left quadrant", "heat imbalance", "crumb pattern"],
    destination: { kind: "hosted" },
  },
  {
    id: "case-007",
    caseNumber: "007",
    title: "Door Hinge Whisper",
    threatLevel: "YELLOW-2",
    status: "REDACTED",
    publishDate: "2026-03-26",
    previewSnippets: ["auditory signature", "midnight cycle", "hallway pressure"],
    destination: { kind: "hosted" },
  },
  {
    id: "case-008",
    caseNumber: "008",
    title: "Battery-Level Mirage",
    threatLevel: "AMBER-2",
    status: "REDACTED",
    publishDate: "2026-04-02",
    previewSnippets: ["92% display", "rapid drop", "false confidence"],
    destination: { kind: "hosted" },
  },
  {
    id: "case-009",
    caseNumber: "009",
    title: "The Perpetual Loading Circle",
    threatLevel: "ORANGE-1",
    status: "REDACTED",
    publishDate: "2026-04-09",
    previewSnippets: ["buffering", "wifi stable", "psychological attrition"],
    destination: { kind: "hosted" },
  },
  {
    id: "case-010",
    caseNumber: "010",
    title: "Milk Carton Misalignment",
    threatLevel: "YELLOW-3",
    status: "REDACTED",
    publishDate: "2026-04-16",
    previewSnippets: ["fridge shelf", "cap orientation", "repeat skew"],
    destination: { kind: "hosted" },
  },
];

export const books: Book[] = [
  {
    id: "book-1",
    title: "S.E.N.I.L.E. Volume 1: Ripple Before Wave",
    status: "In Development",
    synopsis:
      "A provisional field operative enters the archive and uncovers the first chain of domestic anomalies with system-wide implications.",
    releaseWindow: "Target Window: Late 2026",
    webtoonUrl: "https://www.webtoons.com/",
  },
  {
    id: "book-2",
    title: "Classified Project // Volume 2",
    status: "Classified",
    synopsis: "Expansion of containment operations across multiple households and restricted internal sectors.",
    releaseWindow: "Window Pending Clearance",
  },
];

export const characters: Character[] = [
  {
    id: "agent-martin",
    name: "Agent Kelvin",
    codename: "Field Anomaly Response",
    clearanceLevel: "Clearance C",
    psychologicalNotes:
      "Demonstrates high pattern recognition in low-importance events. Fatigue rises after unresolved kettle anomalies.",
    knownAssignments: ["Case 001", "Case 004"],
    visibility: "PUBLIC",
    redactedNotes: ["Sibling mentioned in intake transcript ██", "Personal object retention event ███"],
    portrait: {
      src: "/images/agents/agent-kelvin-card.webp",
      alt: "S.E.N.I.L.E personnel card for Agent Kelvin",
      width: 800,
      height: 1200,
    },
  },
  {
    id: "agent-sana",
    name: "Dr. Griffiths",
    codename: "Research Specialist",
    clearanceLevel: "Clearance B",
    psychologicalNotes: "Maintains calm under repetitive discomfort stimuli. Prefers controlled ambient temperatures.",
    knownAssignments: ["Case 002", "Case 006"],
    visibility: "PARTIALLY_REDACTED",
    redactedNotes: ["Transfer record from ███████ division", "Field incident log unavailable under Protocol 9"],
    portrait: {
      src: "/images/agents/dr-griffiths-card.webp",
      alt: "S.E.N.I.L.E personnel card for Dr. Griffiths",
      width: 800,
      height: 1200,
    },
  },
  {
    id: "agent-vale",
    name: "Agent Vale",
    codename: "Field Handler",
    clearanceLevel: "Clearance C",
    psychologicalNotes: "Stable under prolonged domestic anomaly pressure and repeat incident exposure.",
    knownAssignments: ["Case 003", "Case 005"],
    visibility: "PUBLIC",
    redactedNotes: ["Escalation transfer pending ███", "Operational file remains partially redacted ███"],
    portrait: {
      src: "/images/agents/agent-vale-card.webp",
      alt: "S.E.N.I.L.E personnel card for Agent Vale",
      width: 1024,
      height: 1536,
    },
  },
  {
    id: "agent-bragg",
    name: "Agent Bragg",
    codename: "Auditor / Signals Specialist",
    clearanceLevel: "Clearance A",
    psychologicalNotes: "Methodical in stressed environments. Prefers direct calibration and measurement.",
    knownAssignments: ["Case 004", "Case 007"],
    visibility: "PUBLIC",
    redactedNotes: ["Transfer note includes UK branch reference ███", "Debrief timeline sealed ███"],
    portrait: {
      src: "/images/agents/agent-bragg-card.webp",
      alt: "S.E.N.I.L.E personnel card for Agent Bragg",
      width: 800,
      height: 1200,
    },
  },
  {
    id: "agent-hinge",
    name: "Agent Hinge",
    codename: "Operations Liaison",
    clearanceLevel: "Clearance A",
    psychologicalNotes: "Handles inter-department briefing flow and restricted operational handoffs.",
    knownAssignments: ["Case 006", "Case 009"],
    visibility: "PARTIALLY_REDACTED",
    redactedNotes: ["Held classified debrief ███", "Cross-division annotation withheld ███"],
    portrait: {
      src: "/images/agents/agent-hinge-card.webp",
      alt: "S.E.N.I.L.E personnel card for Agent Hinge",
      width: 800,
      height: 1200,
    },
  },
  {
    id: "agent-director",
    name: "The Director",
    codename: "Directorate; Level Q",
    clearanceLevel: "Director-Level",
    psychologicalNotes: "Record access restricted.",
    knownAssignments: ["Founding Operations"],
    visibility: "RESTRICTED",
    redactedNotes: ["Profile locked by cabinet keycard clearance."],
    portrait: {
      src: "/images/agents/director-card.webp",
      alt: "Restricted silhouette card for The Director",
      width: 800,
      height: 1200,
    },
  },
];

export const gadgets: Gadget[] = [
  {
    id: "sock-resonance-scanner",
    name: "Sock Resonance Scanner",
    tags: ["sock", "laundry", "displacement"],
    technicalDescription:
      "Portable directional scanner tuned to fabric-pair resonance signatures within domestic containment radii.",
    usageProtocol:
      "Sweep clockwise from dryer perimeter, pause at basket edges, and log signal spikes over 12 resonance units.",
    image: {
      src: "/images/equipment/sock-resonance-scanner-card.webp",
      alt: "Equipment card for Sock Resonance Scanner",
      width: 800,
      height: 1200,
    },
  },
  {
    id: "thermal-pillow-stabiliser",
    name: "Thermal Pillow Stabiliser",
    tags: ["pillow", "temperature"],
    technicalDescription:
      "Low-noise thermal equalisation plate that suppresses unilateral heat drift during rest cycles.",
    usageProtocol:
      "Insert beneath affected pillow quadrant and monitor differential readings every 15 minutes.",
  },
  {
    id: "micro-object-recovery-unit",
    name: "Micro-Object Recovery Unit",
    tags: ["remote", "keys", "micro-object"],
    technicalDescription:
      "Compact magnetic and optical retrieval rig for items displaced beyond expected domestic vectors.",
    usageProtocol:
      "Deploy under sofa and shelf cavities before initiating full-room search escalation.",
  },
  {
    id: "sole-grip-paste",
    name: "Sole-Grip Paste",
    tags: ["slippers", "flooring", "stability"],
    technicalDescription:
      "Surface adhesive compound designed to reduce involuntary household slip events and trajectory drift.",
    usageProtocol:
      "Apply to footwear contact points in 2 mm strips. Replace after five anomaly-adjacent steps.",
  },
];

export const siteCopy: SiteCopy = {
  recruitmentHeadline: "Apply for Agent Clearance",
  recruitmentPitch:
    "Submit your details for provisional archive updates, containment notices, and field briefing releases.",
  recruitmentConfirmation:
    "Submission received. Clearance review has begun. Monitor your inbox for briefing protocol updates.",
  subtleAnnouncement: "Public Disclosure Bulletin: Case 001 remains open for active review.",
};
