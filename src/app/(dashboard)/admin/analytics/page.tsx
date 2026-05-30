"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartCard, BarChartPanel, DonutChart, RevenueAreaChart } from "@/components/panels/chart-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_PLATFORM_ANALYTICS, MOCK_REVENUE_DATA } from "@/lib/data/mock-panels";
import { Activity, Eye, Clock, Target } from "lucide-react";

async function fetchAnalytics() {
  const res = await fetch("/api/admin/analytics");
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics-full"],
    queryFn: fetchAnalytics,
  });

  if (isLoading) return <LoadingSkeleton variant="dashboard" />;

  const analytics = MOCK_PLATFORM_ANALYTICS;
  const revenue = data?.revenueChart ?? MOCK_REVENUE_DATA;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Deep insights into engagement, traffic, and course performance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Completion Rate" value={analytics.completionRate} suffix="%" icon={Target} gradient="from-violet-600 to-indigo-600" />
        <MetricCard title="Avg Session" value={analytics.avgSessionMinutes} suffix=" min" icon={Clock} gradient="from-cyan-500 to-blue-600" />
        <MetricCard title="Course Views" value={analytics.courseViews} icon={Eye} gradient="from-emerald-500 to-teal-600" />
        <MetricCard title="Active (7d)" value={analytics.activeUsers7d} icon={Activity} change={14} gradient="from-amber-500 to-orange-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue & Enrollments" description="Last 6 months">
          <RevenueAreaChart data={revenue} />
        </ChartCard>
        <ChartCard title="Traffic Sources" description="Where learners discover courses">
          <DonutChart
            data={analytics.trafficBySource.map((s) => ({ name: s.source, value: s.value }))}
          />
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {analytics.trafficBySource.map((s, i) => (
              <span key={s.source} className="text-xs text-muted-foreground">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" style={{ opacity: 0.4 + i * 0.15 }} />
                {s.source} ({s.value}%)
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Weekly Engagement" description="Platform activity index">
        <BarChartPanel
          data={[
            { week: "W1", engagement: 72 },
            { week: "W2", engagement: 68 },
            { week: "W3", engagement: 81 },
            { week: "W4", engagement: 79 },
          ]}
          dataKey="engagement"
          xKey="week"
        />
      </ChartCard>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Top courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.topCourses.map((course) => (
            <div key={course.title} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{course.title}</span>
                <span className="text-muted-foreground">
                  {course.enrollments.toLocaleString()} enrollments
                  {course.revenue > 0 && ` · $${course.revenue.toLocaleString()}`}
                </span>
              </div>
              <Progress value={Math.min(100, (course.enrollments / 3500) * 100)} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
