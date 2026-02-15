export const STORAGE_KEY = "senile-v1-state";

export type ArchiveState = {
  powerRestored: boolean;
  cupboardOpen: boolean;
  briefingOpen: boolean;
  onboarded: boolean;
  uvUnlocked: boolean;
  uvEnabled: boolean;
  cabinetUnlocked: boolean;
  keycardCollected: boolean;
  agencyOverviewUnlocked: boolean;
  agencyValidated: boolean;
  sublevelUnlocked: boolean;
  decoderUnlocked: boolean;
};

export const defaultState: ArchiveState = {
  powerRestored: false,
  cupboardOpen: false,
  briefingOpen: false,
  onboarded: false,
  uvUnlocked: false,
  uvEnabled: false,
  cabinetUnlocked: false,
  keycardCollected: false,
  agencyOverviewUnlocked: false,
  agencyValidated: false,
  sublevelUnlocked: false,
  decoderUnlocked: false,
};

function normalizeArchiveState(state: ArchiveState): ArchiveState {
  const next = { ...defaultState, ...state };

  // Progression states are monotonic: once issued/unlocked, keep dependent access stable.
  if (
    next.uvUnlocked ||
    next.uvEnabled ||
    next.cabinetUnlocked ||
    next.keycardCollected ||
    next.agencyOverviewUnlocked ||
    next.agencyValidated ||
    next.decoderUnlocked ||
    next.sublevelUnlocked
  ) {
    next.onboarded = true;
  }

  if (next.onboarded) {
    next.powerRestored = true;
  }

  if (next.uvEnabled) {
    next.uvUnlocked = true;
  }

  if (next.cabinetUnlocked) {
    next.uvUnlocked = true;
  }

  if (next.keycardCollected) {
    next.cabinetUnlocked = true;
  }

  if (next.agencyOverviewUnlocked) {
    next.cabinetUnlocked = true;
  }

  if (next.agencyValidated) {
    next.agencyOverviewUnlocked = true;
    next.keycardCollected = true;
  }

  if (next.decoderUnlocked) {
    next.agencyValidated = true;
  }

  if (next.sublevelUnlocked) {
    next.decoderUnlocked = true;
  }

  return next;
}

export function loadArchiveState(): ArchiveState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ArchiveState>;
    return normalizeArchiveState({ ...defaultState, ...parsed });
  } catch {
    return defaultState;
  }
}

export function saveArchiveState(state: ArchiveState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeArchiveState(state)));
  window.dispatchEvent(new Event("archive-state-change"));
}

export function clearArchiveState(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("archive-state-change"));
}

export type RoomId =
  | "case-room"
  | "agency-overview"
  | "agent-registry"
  | "equipment-division"
  | "graphic-novel-division"
  | "recruitment-terminal";

export function isRoomUnlocked(roomId: RoomId, state: ArchiveState): boolean {
  if (roomId === "graphic-novel-division" || roomId === "recruitment-terminal") {
    return true;
  }

  if (roomId === "case-room") {
    return state.onboarded;
  }

  if (roomId === "agency-overview") {
    return state.onboarded && state.agencyOverviewUnlocked;
  }

  if (roomId === "equipment-division") {
    return state.onboarded && state.agencyValidated;
  }

  if (roomId === "agent-registry") {
    return state.onboarded && state.decoderUnlocked;
  }

  return false;
}
