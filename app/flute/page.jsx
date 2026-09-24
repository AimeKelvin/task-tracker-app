import React from "react";
import { notFound } from "next/navigation";
import FluteStudio from "../../src/flute/Studio";
export default function FlutePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <><meta name="flute-project" content="f2e73143-e849-4716-898e-22a62d9decab" /><FluteStudio /></>;
}
