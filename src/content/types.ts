export type CaseStatus = "OPEN" | "REDACTED" | "CONTAINED" | "UNDER REVIEW";
export type AgentVisibility = "PUBLIC" | "PARTIALLY_REDACTED" | "RESTRICTED";

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CaseFile {
  id: string;
  caseNumber: string;
  title: string;
  threatLevel: string;
  status: CaseStatus;
  publishDate: string;
  previewSnippets: string[];
  destination: {
    kind: "hosted" | "external";
    href?: string;
  };
  image?: MediaAsset;
  body?: string[];
}

export interface Book {
  id: string;
  title: string;
  status: string;
  synopsis: string;
  releaseWindow: string;
  webtoonUrl?: string;
  kickstarterUrl?: string;
}

export interface Character {
  id: string;
  name: string;
  codename: string;
  clearanceLevel: string;
  psychologicalNotes: string;
  knownAssignments: string[];
  visibility: AgentVisibility;
  redactedNotes: string[];
  portrait?: MediaAsset;
}

export interface Gadget {
  id: string;
  name: string;
  tags: string[];
  technicalDescription: string;
  usageProtocol: string;
  image?: MediaAsset;
}

export interface SiteCopy {
  recruitmentHeadline: string;
  recruitmentPitch: string;
  recruitmentConfirmation: string;
  subtleAnnouncement: string;
}
