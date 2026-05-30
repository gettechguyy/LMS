"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Flame, Bell, Zap } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ActivityFeed, buildActivityItems } from "@/components/dashboard/activity-feed";
import { LearningProgress } from "@/components/dashboard/learning-progress";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

interface DashboardData {
  stats: {
    enrolledCourses: number;
    totalXp: number;
    currentStreak: number;
    unreadNotifications: number;
  };
  activity: {
    enrollments: Array<{
      id: string;
      last_accessed_at?: string;
      created_at?: string;
      LMS_courses?: { title?: string };
    }>;
    xpEvents: Array<{
      id: string;
      amount: number;
      reason?: string;
      created_at: string;
    }>;
  };
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
  }>;
  user: {
    firstName: string;
    lastName: string;
    totalXp?: number;
  };
}

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  const json = await res.json();
  return json.data;
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-destructive">Failed to load dashboard</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  const activities = buildActivityItems(data.activity);
  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {greeting},{" "}
          <span className="gradient-text">{data.user.firstName}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your learning journey today.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Enrolled Courses"
          value={data.stats.enrolledCourses}
          icon={BookOpen}
          change={12}
          gradient="from-violet-600 to-indigo-600"
          delay={0}
        />
        <MetricCard
          title="Total XP"
          value={data.stats.totalXp}
          icon={Zap}
          change={8}
          gradient="from-amber-500 to-orange-600"
          delay={0.05}
        />
        <MetricCard
          title="Current Streak"
          value={data.stats.currentStreak}
          icon={Flame}
          suffix=" days"
          change={data.stats.currentStreak > 0 ? 5 : undefined}
          gradient="from-rose-500 to-pink-600"
          delay={0.1}
        />
        <MetricCard
          title="Notifications"
          value={data.stats.unreadNotifications}
          icon={Bell}
          gradient="from-cyan-500 to-blue-600"
          delay={0.15}
        />
      </div>

      {/* Charts + Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LearningProgress />
        </div>
        <Leaderboard
          entries={[
            { rank: 1, id: "1", name: "Alex Rivera", xp: 4850, streak: 21 },
            { rank: 2, id: "2", name: "Sarah Chen", xp: 4320, streak: 14 },
            { rank: 3, id: "3", name: "Mike Johnson", xp: 3890, streak: 7 },
            {
              rank: 4,
              id: "current",
              name: `${data.user.firstName} ${data.user.lastName}`,
              xp: data.stats.totalXp,
              streak: data.stats.currentStreak,
              isCurrentUser: true,
            },
            { rank: 5, id: "5", name: "James Park", xp: 2980, streak: 5 },
          ]}
        />
      </div>

      {/* Activity + Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed activities={activities} />
        <UpcomingEvents />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
