import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function AuthLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-violet-500/25 transition-transform group-hover:scale-105">
        <GraduationCap className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight">The Tech Guy</span>
        <span className="text-xs text-muted-foreground">Learning Platform</span>
      </div>
    </Link>
  );
}
