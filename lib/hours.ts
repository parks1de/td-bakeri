import fs from "fs";
import path from "path";

export type DaySchedule = { open: string; close: string } | null;

export interface HoursConfig {
  override: "open" | "closed" | null;
  schedule: Record<string, DaySchedule>;
}

const filePath = path.join(process.cwd(), "data", "hours.json");

export function readHours(): HoursConfig {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as HoursConfig;
  } catch {
    return {
      override: null,
      schedule: {
        mandag: null,
        tirsdag: { open: "09:00", close: "18:00" },
        onsdag:  { open: "09:00", close: "18:00" },
        torsdag: { open: "09:00", close: "18:00" },
        fredag:  { open: "09:00", close: "18:00" },
        lordag:  { open: "09:00", close: "18:00" },
        sondag:  { open: "09:00", close: "18:00" },
      },
    };
  }
}

export function writeHours(config: HoursConfig): void {
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");
}

const dayNames: Record<number, string> = {
  0: "sondag",
  1: "mandag",
  2: "tirsdag",
  3: "onsdag",
  4: "torsdag",
  5: "fredag",
  6: "lordag",
};

export interface OpenStatusResult {
  isOpen: boolean;
  /** i18n key — resolved by the client via tr(lang, statusKey) */
  statusKey:
    | "status_manual_open"
    | "status_manual_closed"
    | "status_closed_today"
    | "status_open"
    | "status_closed";
  /** time string e.g. "09:00" — used by client for "Opens at XX:XX" */
  time?: string;
  source: "override" | "schedule";
}

export function getOpenStatus(): OpenStatusResult {
  const config = readHours();

  if (config.override === "open") {
    return { isOpen: true, statusKey: "status_manual_open", source: "override" };
  }
  if (config.override === "closed") {
    return { isOpen: false, statusKey: "status_manual_closed", source: "override" };
  }

  const now = new Date();
  const dayKey = dayNames[now.getDay()];
  const hours = config.schedule[dayKey];

  if (!hours) {
    return { isOpen: false, statusKey: "status_closed_today", source: "schedule" };
  }

  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  const openMin = openH * 60 + openM;
  const closeMin = closeH * 60 + closeM;

  if (cur >= openMin && cur < closeMin) {
    return { isOpen: true, statusKey: "status_open", time: hours.close, source: "schedule" };
  }
  if (cur < openMin) {
    return { isOpen: false, statusKey: "status_closed", time: hours.open, source: "schedule" };
  }
  return { isOpen: false, statusKey: "status_closed_today", source: "schedule" };
}
