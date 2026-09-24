"use client";
import React from "react";
import { ProjectPreview } from "@webprodigies/flute/preview";
import { sceneModules } from "./catalog";
// Host-owned development flag: no process, Vite or Electron globals in this adapter.
export function FluteProjectPreview({ children, enabled, active, ...props }) {
  if (!enabled) return children;
  return <ProjectPreview {...props} projectId="f2e73143-e849-4716-898e-22a62d9decab" enabled={enabled} active={active} sceneModules={sceneModules}>{children}</ProjectPreview>;
}
