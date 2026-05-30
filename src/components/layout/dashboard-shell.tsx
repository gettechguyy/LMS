"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SessionUser } from "@/types";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { useSidebarStore, getSidebarWidth } from "@/stores/sidebar-store";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface DashboardShellProps {
  user: SessionUser;
  children: React.ReactNode;
  notifications?: NotificationItem[];
}

export function DashboardShell({ user, children, notifications }: DashboardShellProps) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const isPinned = useSidebarStore((state) => state.isPinned);
  const isHovered = useSidebarStore((state) => state.isHovered);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  const isExpanded = !isCollapsed || (!isPinned && isHovered);
  const sidebarWidth = getSidebarWidth(isExpanded);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const contentMargin = isDesktop ? sidebarWidth : 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "[" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleCollapsed]);

  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar user={user} />

      <motion.div
        className="flex min-h-screen flex-col"
        animate={{ marginLeft: contentMargin }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        style={{ marginLeft: contentMargin }}
      >
        <Navbar user={user} notifications={notifications} />
        <main className={cn("flex-1 p-4 lg:p-6")}>{children}</main>
      </motion.div>

      <CommandPalette />
    </div>
  );
}
