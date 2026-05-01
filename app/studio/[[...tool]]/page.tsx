"use client";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999999, background: "#fff" }}>
      <NextStudio config={config} />
    </div>
  );
}