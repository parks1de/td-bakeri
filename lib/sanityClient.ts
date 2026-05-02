import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "u7hre29r",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const sanityWriteClient = createClient({
  projectId: "u7hre29r",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

// No CDN, no token — for reads that must be fresh (e.g. open/close status)
export const sanityLiveClient = createClient({
  projectId: "u7hre29r",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export interface SanityCategory {
  title: string;
  slug: string;
  icon: string;
  sortOrder: number;
}

export interface SanityMenuItem {
  _id: string;
  title: string;
  slug: string;
  category: SanityCategory;
  description: string;
  price: number;
  image: string | null;
  allergies: string[];
  variants: string[];
  available: boolean;
  eatIn: boolean;
  takeAway: boolean;
  featured: boolean;
}
