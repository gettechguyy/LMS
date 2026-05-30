import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  isPinned: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setPinned: (pinned: boolean) => void;
  togglePinned: () => void;
  setHovered: (hovered: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
  isExpanded: () => boolean;
}

export const SIDEBAR_WIDTH_EXPANDED = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 72;

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      isPinned: true,
      isHovered: false,
      isMobileOpen: false,

      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),

      setPinned: (pinned) => set({ isPinned: pinned }),

      togglePinned: () => set((state) => ({ isPinned: !state.isPinned })),

      setHovered: (hovered) => set({ isHovered: hovered }),

      setMobileOpen: (open) => set({ isMobileOpen: open }),

      toggleMobileOpen: () =>
        set((state) => ({ isMobileOpen: !state.isMobileOpen })),

      isExpanded: () => {
        const { isCollapsed, isPinned, isHovered } = get();
        if (!isCollapsed) return true;
        if (isPinned) return false;
        return isHovered;
      },
    }),
    {
      name: "lms-sidebar",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        isPinned: state.isPinned,
      }),
    }
  )
);

export function getSidebarWidth(isExpanded: boolean): number {
  return isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;
}
