"use client";

import * as React from "react";

export type LayoutMode = "sidebar" | "topnav";
export type ContainerMode = "fluid" | "boxed";
export type DirectionMode = "ltr" | "rtl";

type SidebarState = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  layout: LayoutMode;
  setLayout: (layout: LayoutMode) => void;
  container: ContainerMode;
  setContainer: (container: ContainerMode) => void;
  direction: DirectionMode;
  setDirection: (direction: DirectionMode) => void;
};

const LAYOUT_STORAGE_KEY = "signal-layout";
const CONTAINER_STORAGE_KEY = "signal-container";
const DIRECTION_STORAGE_KEY = "signal-direction";

function applyLayoutClass(mode: LayoutMode) {
  const root = document.documentElement;
  root.classList.remove("layout-sidebar", "layout-topnav");
  root.classList.add(`layout-${mode}`);
}

function applyContainerClass(mode: ContainerMode) {
  const root = document.documentElement;
  root.classList.remove("container-fluid", "container-boxed");
  root.classList.add(`container-${mode}`);
}

function applyDirectionClass(mode: DirectionMode) {
  const root = document.documentElement;
  root.dir = mode;
  root.classList.remove("dir-ltr", "dir-rtl");
  root.classList.add(`dir-${mode}`);
}

const SidebarContext = React.createContext<SidebarState>({
  collapsed: false,
  setCollapsed: () => null,
  mobileOpen: false,
  setMobileOpen: () => null,
  layout: "sidebar",
  setLayout: () => null,
  container: "fluid",
  setContainer: () => null,
  direction: "ltr",
  setDirection: () => null,
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [layout, setLayoutState] = React.useState<LayoutMode>(() => {
    if (typeof window === "undefined") return "sidebar";
    return (localStorage.getItem(LAYOUT_STORAGE_KEY) as LayoutMode) || "sidebar";
  });

  const setLayout = React.useCallback((mode: LayoutMode) => {
    setLayoutState(mode);
    localStorage.setItem(LAYOUT_STORAGE_KEY, mode);
    applyLayoutClass(mode);
  }, []);

  const [container, setContainerState] = React.useState<ContainerMode>(() => {
    if (typeof window === "undefined") return "fluid";
    return (localStorage.getItem(CONTAINER_STORAGE_KEY) as ContainerMode) || "fluid";
  });

  const setContainer = React.useCallback((mode: ContainerMode) => {
    setContainerState(mode);
    localStorage.setItem(CONTAINER_STORAGE_KEY, mode);
    applyContainerClass(mode);
  }, []);

  const [direction, setDirectionState] = React.useState<DirectionMode>(() => {
    if (typeof window === "undefined") return "ltr";
    return (localStorage.getItem(DIRECTION_STORAGE_KEY) as DirectionMode) || "ltr";
  });

  const setDirection = React.useCallback((mode: DirectionMode) => {
    setDirectionState(mode);
    localStorage.setItem(DIRECTION_STORAGE_KEY, mode);
    applyDirectionClass(mode);
  }, []);

  const value = React.useMemo(
    () => ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, layout, setLayout, container, setContainer, direction, setDirection }),
    [collapsed, mobileOpen, layout, setLayout, container, setContainer, direction, setDirection]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export const useSidebar = () => React.useContext(SidebarContext);
