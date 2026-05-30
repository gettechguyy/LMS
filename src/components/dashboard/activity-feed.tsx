"use client";

import { motion } from "framer-motion";
import { BookOpen, Zap, Trophy, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/empty-state";

interface ActivityItem {
  id: string;
  type: "enrollment" | "xp" | "achievement" | "lesson";
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
}

const TYPE_ICONS = {
  enrollment: BookOpen,
  xp: Zap,
  achievement: Trophy,
  lesson: Clock,
};

const TYPE_COLORS = {
  enrollment: "from-blue-500 to-cyan-500",
  xp: "from-amber-500 to-orange-500",
  achievement: "from-violet-500 to-purple-500",
  lesson: "from-emerald-500 to-teal-500",
};

export function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No activity yet"
            description="Start learning to see your activity here."
            action={{ label: "Browse Courses", href: "/courses" }}
            className="py-8"
          />
        ) : (
          <ScrollArea className="h-[320px] pr-4">
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = TYPE_ICONS[activity.type] ?? Clock;
                const color = TYPE_COLORS[activity.type] ?? TYPE_COLORS.lesson;

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export function buildActivityItems(data: {
  enrollments?: Array<{
    id: string;
    last_accessed_at?: string;
    created_at?: string;
    LMS_courses?: { title?: string };
  }>;
  xpEvents?: Array<{
    id: string;
    amount: number;
    reason?: string;
    created_at: string;
  }>;
}): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const enrollment of data.enrollments ?? []) {
    items.push({
      id: `enrollment-${enrollment.id}`,
      type: "enrollment",
      title: "Continued learning",
      description: enrollment.LMS_courses?.title ?? "Course activity",
      timestamp: enrollment.last_accessed_at ?? enrollment.created_at ?? new Date().toISOString(),
    });
  }

  for (const xp of data.xpEvents ?? []) {
    items.push({
      id: `xp-${xp.id}`,
      type: "xp",
      title: `+${xp.amount} XP earned`,
      description: xp.reason ?? "Completed a learning activity",
      timestamp: xp.created_at,
    });
  }

  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);
}
