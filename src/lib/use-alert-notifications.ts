import { useEffect, useRef } from "react";
import type { Widget } from "@/workspace/types";
import { DEFAULT_NOTIFY_MINUTES, reminderAlertPhase } from "@/lib/reminder-alert";
import { taskAlertPhase } from "@/lib/task-schedule";
import { reminderState, taskState } from "@/components/workspace/WidgetContent";

/**
 * Requests notification permission once, on first load. While the app
 * stays open, keeps the OS taskbar/dock badge in sync with how many
 * reminders/tasks are currently "due", and fires up to two native
 * notifications per item: one when it enters its configured lead-time
 * window ("pre", e.g. 15 minutes before) and one the moment it becomes
 * due. Neither repeats until the item is rescheduled or leaves the
 * window. There's no service worker or push backend, so nothing fires
 * while the app is fully closed — only while it's open, including
 * minimized/backgrounded.
 */
export function useAlertNotifications(widgets: Widget[]) {
  const notifiedPre = useRef<Set<string>>(new Set());
  const notifiedDue = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const notify = (id: string, title: string, body: string) => {
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      new Notification(title, { body, tag: id });
    };

    const tick = () => {
      const now = new Date();
      let dueCount = 0;

      const handle = (
        id: string,
        title: string,
        phase: "none" | "pre" | "due",
        minutesBefore: number,
      ) => {
        if (phase === "none") {
          notifiedPre.current.delete(id);
          notifiedDue.current.delete(id);
          return;
        }
        if (phase === "due") {
          dueCount += 1;
          if (!notifiedDue.current.has(id)) {
            notifiedDue.current.add(id);
            notify(id, title, "It's time.");
          }
          return;
        }
        // phase === "pre"
        if (!notifiedPre.current.has(id)) {
          notifiedPre.current.add(id);
          const label = minutesBefore === 0 ? "Coming up" : `In ${minutesBefore} minutes`;
          notify(id, title, label);
        }
      };

      for (const w of widgets) {
        if (w.content.kind === "reminders") {
          for (const r of w.content.items) {
            if (reminderState(r) === "completed" || reminderState(r) === "archived") continue;
            handle(
              r.id,
              r.title || "Reminder",
              reminderAlertPhase(r, now),
              r.notifyMinutesBefore ?? DEFAULT_NOTIFY_MINUTES,
            );
          }
        } else if (w.content.kind === "tasks") {
          for (const t of w.content.items) {
            if (taskState(t.status) === "completed") continue;
            handle(
              t.id,
              t.title || "Task",
              taskAlertPhase(t, now),
              t.notifyMinutesBefore ?? DEFAULT_NOTIFY_MINUTES,
            );
          }
        }
      }

      if ("setAppBadge" in navigator) {
        if (dueCount > 0) (navigator as any).setAppBadge(dueCount);
        else if ("clearAppBadge" in navigator) (navigator as any).clearAppBadge();
      }
    };

    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, [widgets]);
}
