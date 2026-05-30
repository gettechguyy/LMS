"use client";

import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartCard, BarChartPanel, MultiLineChart } from "@/components/panels/chart-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, CheckCircle, HelpCircle, Users } from "lucide-react";
import { MOCK_COURSE_ANALYTICS, MOCK_INSTRUCTOR_COURSES } from "@/lib/data/mock-panels";

export default function InstructorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Analytics"
        description="Engagement, completions, and quiz performance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Views" value={1900} icon={Eye} change={12} gradient="from-violet-600 to-indigo-600" />
        <MetricCard title="Completions" value={443} icon={CheckCircle} change={9} gradient="from-emerald-500 to-teal-600" />
        <MetricCard title="Quiz Attempts" value={724} icon={HelpCircle} gradient="from-blue-500 to-cyan-600" />
        <MetricCard title="Active Students" value={4180} icon={Users} change={6} gradient="from-amber-500 to-orange-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly metrics" description="Views, completions, and quizzes">
          <MultiLineChart
            data={MOCK_COURSE_ANALYTICS.map((w) => ({ month: w.week, ...w }))}
            lines={[
              { key: "views", name: "Views", color: "hsl(262 83% 58%)" },
              { key: "completions", name: "Completions", color: "hsl(173 58% 39%)" },
              { key: "quizzes", name: "Quizzes", color: "hsl(221 83% 53%)" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Lesson engagement" description="Average watch time by module">
          <BarChartPanel
            data={[
              { module: "M1", rate: 92 },
              { module: "M2", rate: 78 },
              { module: "M3", rate: 65 },
              { module: "M4", rate: 54 },
            ]}
            dataKey="rate"
            xKey="module"
          />
        </ChartCard>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Completion by course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_INSTRUCTOR_COURSES.filter((c) => c.students > 0).map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{course.title}</span>
                <span className="text-muted-foreground">{course.completion}% avg completion</span>
              </div>
              <Progress value={course.completion} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
