"use client";

import { loadArchiveState } from "@/lib/archive-state";
import { isRoomUnlocked, type RoomId } from "@/lib/archive-state";
import styles from "@/components/room-pages.module.css";

export function RoomGate({ roomId, children }: { roomId: RoomId; children: React.ReactNode }) {
  if (typeof window === "undefined") {
    return null;
  }

  const allowed = isRoomUnlocked(roomId, loadArchiveState());

  if (!allowed) {
    return (
      <div className={styles.pageWrap}>
        <section className={styles.gateCard}>
          <h2>CLEARANCE LEVEL INSUFFICIENT</h2>
          <p>Validate internal systems through Agency Overview before accessing this room.</p>
        </section>
      </div>
    );
  }

  return <>{children}</>;
}
