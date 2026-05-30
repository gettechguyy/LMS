"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  Settings,
  Building2,
  Check,
} from "lucide-react";
import { cn, getInitials, formatRelativeTime } from "@/lib/utils";
import type { SessionUser } from "@/types";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavbarProps {
  user: SessionUser;
  notifications?: NotificationItem[];
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const WORKSPACES = [
  { id: "default", name: "The Tech Guy Academy", plan: "Pro" },
  { id: "personal", name: "Personal Learning", plan: "Free" },
];

const MOCK_MESSAGES = [
  { id: "1", from: "Sarah Chen", preview: "Great work on the React assignment!", time: "2m ago", unread: true },
  { id: "2", from: "Mike Johnson", preview: "Can we schedule a mentor session?", time: "1h ago", unread: true },
  { id: "3", from: "Course Bot", preview: "New module available in TypeScript Mastery", time: "3h ago", unread: false },
];

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { href, label };
  });
}

export function Navbar({ user, notifications = [] }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { toggleMobileOpen } = useSidebarStore();
  const { setCommandPaletteOpen } = useUIStore();
  const breadcrumbs = buildBreadcrumbs(pathname);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const unreadMessages = MOCK_MESSAGES.filter((m) => m.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleMobileOpen}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <nav className="hidden min-w-0 flex-1 items-center gap-1 text-sm md:flex">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <Link
              href={crumb.href}
              className={cn(
                "truncate transition-colors hover:text-primary",
                index === breadcrumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {crumb.label}
            </Link>
          </div>
        ))}
      </nav>

      {/* Workspace selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden gap-2 sm:flex">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="max-w-[140px] truncate">The Tech Guy Academy</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {WORKSPACES.map((workspace) => (
            <DropdownMenuItem key={workspace.id} className="gap-2">
              <Building2 className="h-4 w-4" />
              <div className="flex-1">
                <p className="text-sm">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">{workspace.plan}</p>
              </div>
              {workspace.id === "default" && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-auto flex items-center gap-2">
        {/* Search / Command palette trigger */}
        <Button
          variant="outline"
          className="relative hidden h-9 w-64 justify-start gap-2 text-muted-foreground sm:flex"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme switch */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light">
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Messages */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-white">
                  {unreadMessages}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Messages
              {unreadMessages > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadMessages} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-64">
              {MOCK_MESSAGES.map((msg) => (
                <DropdownMenuItem key={msg.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{msg.from}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{msg.preview}</p>
                  {msg.unread && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/messages" className="w-full justify-center text-primary">
                View all messages
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-64">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">{notification.title}</span>
                      {!notification.is_read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.created_at)}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.firstName} />}
                <AvatarFallback className="gradient-primary text-xs text-white">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
              <Link href="/api/auth/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
