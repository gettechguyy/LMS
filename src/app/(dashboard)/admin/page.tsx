"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, BookOpen, DollarSign, TrendingUp, GraduationCap, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartCard, RevenueAreaChart, MultiLineChart } from "@/components/panels/chart-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_REVENUE_DATA, MOCK_USER_GROWTH } from "@/lib/data/mock-panels";

interface AnalyticsResponse {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    mentorCount: number;
    instructorCount: number;
    enrollmentsLast30Days: number;
  };
  revenueChart: typeof MOCK_REVENUE_DATA;
  userGrowth: typeof MOCK_USER_GROWTH;
}

async function fetchAdminAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch("/api/admin/analytics");
  if (!res.ok) throw new Error("Failed to load analytics");
  const json = await res.json();
  return json.data;
}

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: fetchAdminAnalytics,
  });

  if (isLoading) return <LoadingSkeleton variant="dashboard" />;

  if (error || !data) {
    return (
      <div className="py-20 text-center text-destructive">
        Failed to load admin dashboard. Ensure you have admin access.
      </div>
    );
  }

  const { stats } = data;
  const revenueData = data.revenueChart ?? MOCK_REVENUE_DATA;
  const userGrowth = data.userGrowth ?? MOCK_USER_GROWTH;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        description="Platform health, revenue, and user growth at a glance."
      >
        <Button asChild className="gradient-primary border-0 text-white">
          <Link href="/admin/users">Manage Users</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Total Users" value={stats.totalUsers} icon={Users} change={12} gradient="from-violet-600 to-indigo-600" />
        <MetricCard title="Courses" value={stats.totalCourses} icon={BookOpen} change={5} gradient="from-blue-500 to-cyan-600" />
        <MetricCard title="Enrollments" value={stats.totalEnrollments} icon={GraduationCap} change={18} gradient="from-emerald-500 to-teal-600" />
        <MetricCard title="Revenue" value={Math.round(stats.totalRevenue)} prefix="$" icon={DollarSign} change={22} gradient="from-amber-500 to-orange-600" />
        <MetricCard title="Instructors" value={stats.instructorCount} icon={UserCheck} gradient="from-rose-500 to-pink-600" />
        <MetricCard title="Mentors" value={stats.mentorCount} icon={Users} gradient="from-purple-500 to-violet-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue" description="Monthly revenue trend" delay={0.1}>
          <RevenueAreaChart data={revenueData} />
        </ChartCard>
        <ChartCard title="User Growth" description="Users by role over time" delay={0.15}>
          <MultiLineChart
            data={userGrowth}
            lines={[
              { key: "students", name: "Students", color: "hsl(262 83% 58%)" },
              { key: "instructors", name: "Instructors", color: "hsl(221 83% 53%)" },
              { key: "mentors", name: "Mentors", color: "hsl(173 58% 39%)" },
            ]}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.enrollmentsLast30Days}</p>
            <p className="text-sm text-muted-foreground">New enrollments</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" asChild><Link href="/admin/users">Users</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/courses">Courses</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/analytics">Analytics</Link></Button>
            <Button variant="outline" asChild><Link href="/admin/settings">Settings</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
