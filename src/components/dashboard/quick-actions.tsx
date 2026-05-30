"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Video,
  ClipboardList,
  MessageSquare,
  Trophy,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Browse Courses",
    href: "/courses",
    icon: BookOpen,
    gradient: "from-violet-600 to-indigo-600",
    description: "Explore new learning paths",
  },
  {
    label: "Join Live Class",
    href: "/live-classes",
    icon: Video,
    gradient: "from-rose-500 to-pink-600",
    description: "Attend upcoming sessions",
  },
  {
    label: "Submit Assignment",
    href: "/assignments",
    icon: ClipboardList,
    gradient: "from-amber-500 to-orange-600",
    description: "Complete pending work",
  },
  {
    label: "Ask Mentor",
    href: "/messages",
    icon: MessageSquare,
    gradient: "from-emerald-500 to-teal-600",
    description: "Get expert guidance",
  },
  {
    label: "View Achievements",
    href: "/achievements",
    icon: Trophy,
    gradient: "from-yellow-500 to-amber-600",
    description: "Track your milestones",
  },
  {
    label: "AI Assistant",
    href: "/resources",
    icon: Sparkles,
    gradient: "from-cyan-500 to-blue-600",
    description: "Get personalized help",
  },
];

export function QuickActions() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-border/50 p-3 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-105",
                    action.gradient
                  )}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
