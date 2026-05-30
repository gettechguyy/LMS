"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  ClipboardList,
  FolderKanban,
  Briefcase,
  Users,
  Trophy,
  MessageSquare,
  Library,
  Settings,
  Shield,
  Search,
  Plus,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { SIDEBAR_NAV, ADMIN_NAV } from "@/types";
import { useUIStore } from "@/stores/ui-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  Video,
  ClipboardList,
  FolderKanban,
  Briefcase,
  Users,
  Trophy,
  MessageSquare,
  Library,
  Settings,
  Shield,
};

function NavCommandIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? LayoutDashboard;
  return <Icon className="h-4 w-4" />;
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { toggleCollapsed } = useSidebarStore();
  const { setTheme } = useTheme();

  const runCommand = useCallback(
    (command: () => void) => {
      setCommandPaletteOpen(false);
      command();
    },
    [setCommandPaletteOpen]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandPaletteOpen]);

  const allNav = [...SIDEBAR_NAV, ...ADMIN_NAV];

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search pages, actions, and more..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {allNav.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <NavCommandIcon name={item.icon} />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/courses"))}>
            <Plus className="h-4 w-4" />
            <span>Browse Courses</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/assignments"))}>
            <ClipboardList className="h-4 w-4" />
            <span>View Assignments</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/messages"))}>
            <MessageSquare className="h-4 w-4" />
            <span>Open Messages</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Preferences">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="h-4 w-4" />
            <span>Dark Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => toggleCollapsed())}>
            <Search className="h-4 w-4" />
            <span>Toggle Sidebar</span>
            <CommandShortcut>[</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
