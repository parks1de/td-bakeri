import { sanityLiveClient } from "@/lib/sanityClient";

export type DaySchedule = { open: string; close: string } | null;

export interface HoursConfig {
  override: "open" | "closed" | null;
  schedule: Record<string, DaySchedule>;
}

const DEFAULT_SCHEDULE: Record<string, DaySchedule> = {
  mandag: null,
  tirsdag: { open: "09:00", close: "18:00" },
  onsdag: { open: "09:00", close: "18:00" },
  torsdag: { open: "09:00", close: "18:00" },
  fredag: { open: "09:00", close: "18:00" },
  lordag: { open: "09:00", close: "18:00" },
  sondag: { open: "09:00", close: "18:00" },
};

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
  statusKey:
    | "status_manual_open"
    | "status_manual_closed"
    | "status_closed_today"
    | "status_open"
    | "status_closed";
  time?: string;
  source: "override" | "schedule";
}

const HOURS_QUERY = `*[_type == "hoursConfig" && _id == "singleton-hoursConfig"][0]{
  manualOverride,
  schedule[]{ day, isClosed, openTime, closeTime }
}`;

export async function getHoursConfig(): Promise<HoursConfig> {
  try {
    const doc = await sanityLiveClient.fetch(HOURS_QUERY);
    if (!doc) return { override: null, schedule: DEFAULT_SCHEDULE };

    const schedule: Record<string, DaySchedule> = {};
    for (const entry of doc.schedule ?? []) {
      schedule[entry.day] = entry.isClosed
        ? null
        : { open: entry.openTime ?? "09:00", close: entry.closeTime ?? "18:00" };
    }

    return {
      override:
        !doc.manualOverride || doc.manualOverride === "auto"
          ? null
          : (doc.manualOverride as "open" | "closed"),
      schedule: Object.keys(schedule).length > 0 ? schedule : DEFAULT_SCHEDULE,
    };
  } catch {
    return { override: null, schedule: DEFAULT_SCHEDULE };
  }
}

export async function getOpenStatus(): Promise<OpenStatusResult> {
  const config = await getHoursConfig();

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
