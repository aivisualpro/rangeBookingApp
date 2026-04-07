"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function HeaderSearchPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const target = document.getElementById("route-header-search");
  if (!target) return null;

  return createPortal(children, target);
}

export function HeaderActionsPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const target = document.getElementById("route-header-actions");
  if (!target) return null;

  return createPortal(children, target);
}
