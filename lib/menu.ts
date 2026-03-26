import fs from "fs";
import path from "path";

export interface MenuItem {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  image: string;
  allergies: string[];
  variants: string[];
  visible: boolean;
}

const filePath = path.join(process.cwd(), "data", "menu.json");

export function readMenu(): MenuItem[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as MenuItem[];
}

export function writeMenu(items: MenuItem[]): void {
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
}

export function getVisibleMenu(): MenuItem[] {
  return readMenu().filter((i) => i.visible);
}
