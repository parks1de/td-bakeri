import fs from "fs";
import path from "path";

export type DaySchedule = { open: string; close: string } | null;

export interface HoursConfig {
  override: "open" | "closed" | null;
  schedule: Record<string, DaySchedule>;
}

const filePath = path.join(process.cwd(), "data", "hours.json");

export function readHours(): HoursConfig {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as HoursConfig;
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

export function getOpenStatus(): {
  isOpen: boolean;
  label: string;
  source: "override" | "schedule";
} {
  const config = readHours();

  if (config.override === "open") {
    return { isOpen: true, label: "Apen na (manuelt)", source: "override" };
  }
  if (config.override === "closed") {
    return { isOpen: false, label: "Stengt na (manuelt)", source: "override" };
  }

  const now = new Date();
  const dayKey = dayNames[now.getDay()];
  const hours = config.schedule[dayKey];

  if (!hours) {
    return { isOpen: false, label: "Stengt i dag", source: "schedule" };
  }

  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      label: `Apen til kl. ${hours.close}`,
      source: "schedule",
    };
  }

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      label: `Apner kl. ${hours.open}`,
      source: "schedule",
    };
  }

  return { isOpen: false, label: "Stengt for i dag", source: "schedule" };
}
