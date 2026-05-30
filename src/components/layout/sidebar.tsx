"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
  Pin,
  PinOff,
  GraduationCap,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { SIDEBAR_NAV, ADMIN_NAV, INSTRUCTOR_NAV, MENTOR_NAV } from "@/types";
import type { SessionUser } from "@/types";
import {
  useSidebarStore,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from "@/stores/sidebar-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const ROLE_HIERARCHY = { student: 1, mentor: 2, instructor: 3, admin: 4 } as const;

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
  GraduationCap,
  BarChart3,
};

function NavIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? LayoutDashboard;
  return <Icon className="h-5 w-5 shrink-0" />;
}

interface SidebarNavItemProps {
  href: string;
  title: string;
  icon: string;
  isActive: boolean;
  isExpanded: boolean;
  onNavigate?: () => void;
}

function SidebarNavItem({
  href,
  title,
  icon,
  isActive,
  isExpanded,
  onNavigate,
}: SidebarNavItemProps) {
  const content = (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-600/15 to-indigo-600/15 dark:from-violet-500/20 dark:to-indigo-500/20"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span
        className={cn(
          "relative z-10 flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          isActive
            ? "gradient-primary text-white shadow-md"
            : "bg-sidebar-accent/50 group-hover:bg-sidebar-accent"
        )}
      >
        <NavIcon name={icon} />
      </span>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="relative z-10 overflow-hidden whitespace-nowrap"
          >
            {title}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (!isExpanded) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

interface SidebarContentProps {
  user: SessionUser;
  isExpanded: boolean;
  onNavigate?: () => void;
}

function SidebarContent({ user, isExpanded, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { isPinned, togglePinned, toggleCollapsed } = useSidebarStore();
  const roleNav =
    user.role === "admin"
      ? ADMIN_NAV
      : user.role === "instructor"
        ? INSTRUCTOR_NAV
        : user.role === "mentor"
          ? MENTOR_NAV
          : [];
  const navItems = [...SIDEBAR_NAV, ...roleNav];

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary shadow-lg">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="overflow-hidden"
            >
              <p className="whitespace-nowrap text-sm font-bold gradient-text">
                The Tech Guy
              </p>
              <p className="whitespace-nowrap text-xs text-muted-foreground">LMS Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              title={item.title}
              icon={item.icon}
              isActive={
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              }
              isExpanded={isExpanded}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "mb-3 flex items-center gap-3 rounded-lg bg-sidebar-accent/40 p-2",
            !isExpanded && "justify-center"
          )}
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.firstName} />}
            <AvatarFallback className="gradient-primary text-xs text-white">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          {isExpanded && (
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs capitalize text-muted-foreground">{user.role}</p>
            </div>
          )}
        </div>

        <div className={cn("flex gap-1", isExpanded ? "justify-between" : "flex-col")}>
          {isExpanded && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={togglePinned}
                >
                  {isPinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isPinned ? "Unpin sidebar" : "Pin sidebar"}
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleCollapsed}
              >
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform",
                    !isExpanded && "rotate-180"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Toggle sidebar <kbd className="ml-1 rounded bg-muted px-1">[</kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  user: SessionUser;
}

export function Sidebar({ user }: SidebarProps) {
  const {
    isCollapsed,
    isPinned,
    isMobileOpen,
    setHovered,
    setMobileOpen,
    isExpanded: checkExpanded,
  } = useSidebarStore();

  const isExpanded = checkExpanded();
  const width = isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <TooltipProvider delayDuration={0}>
      {/* Desktop sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border lg:block"
        style={{ width }}
        animate={{ width }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        onMouseEnter={() => {
          if (isCollapsed && !isPinned) setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <SidebarContent user={user} isExpanded={isExpanded} />
      </motion.aside>

      {/* Mobile sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SidebarContent
            user={user}
            isExpanded
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}