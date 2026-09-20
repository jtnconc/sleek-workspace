import type { ToolId } from "@/workspace/types";

const STORAGE_KEY = "enabled-tools";
const ALL_TOOLS: ToolId[] = ["notes", "quote", "rates"];

function readStored(): ToolId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ALL_TOOLS;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return ALL_TOOLS;
    const filtered = ALL_TOOLS.filter((id) => parsed.includes(id));
    return filtered.length > 0 ? filtered : ALL_TOOLS;
  } catch {
    return ALL_TOOLS;
  }
}

let enabled: ToolId[] = readStored();
const listeners = new Set<() => void>();

export function getEnabledTools(): ToolId[] {
  return enabled;
}

export function isToolEnabled(id: ToolId): boolean {
  return enabled.includes(id);
}

/** Toggles a tool on/off. Always keeps at least one tool enabled — a
 * request that would disable the last remaining tool is ignored. */
export function setToolEnabled(id: ToolId, on: boolean) {
  const next = on ? Array.from(new Set([...enabled, id])) : enabled.filter((t) => t !== id);
  if (next.length === 0) return;
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
  listeners.forEach((fn) => fn());
}

export function subscribeEnabledTools(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
