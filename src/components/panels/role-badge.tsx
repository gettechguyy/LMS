import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const ROLE_STYLES: Record<UserRole, string> = {
  admin: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  instructor: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  mentor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  student: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
};

export function RoleBadge({ role, className }: { role: UserRole | string; className?: string }) {
  const style = ROLE_STYLES[role as UserRole] ?? ROLE_STYLES.student;
  return (
    <Badge variant="outline" className={cn("capitalize font-medium", style, className)}>
      {role}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    suspended: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    inactive: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
    published: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    draft: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    archived: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
    scheduled: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  };
  return (
    <Badge variant="outline" className={cn("capitalize font-medium", styles[status] ?? styles.inactive)}>
      {status}
    </Badge>
  );
}
