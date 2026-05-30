"use client";

import Link from "next/link";
import { BookOpen, Users, TrendingUp, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DataTable } from "@/components/panels/data-table";
import { ChartCard, BarChartPanel } from "@/components/panels/chart-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MOCK_INSTRUCTOR_COURSES, MOCK_STUDENT_PROGRESS } from "@/lib/data/mock-panels";

const totalStudents = MOCK_INSTRUCTOR_COURSES.reduce((s, c) => s + c.students, 0);
const avgCompletion = Math.round(
  MOCK_INSTRUCTOR_COURSES.filter((c) => c.completion > 0).reduce((s, c) => s + c.completion, 0) /
    MOCK_INSTRUCTOR_COURSES.filter((c) => c.completion > 0).length
);

export default function InstructorDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Instructor Dashboard"
        description="Track your courses and student progress."
      >
        <Button asChild className="gradient-primary border-0 text-white">
          <Link href="/instructor/courses/new">Create course</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="My Courses" value={MOCK_INSTRUCTOR_COURSES.length} icon={BookOpen} gradient="from-violet-600 to-indigo-600" />
        <MetricCard title="Total Students" value={totalStudents} icon={Users} change={8} gradient="from-blue-500 to-cyan-600" />
        <MetricCard title="Avg Completion" value={avgCompletion} suffix="%" icon={TrendingUp} gradient="from-emerald-500 to-teal-600" />
        <MetricCard title="Avg Rating" value={4.8} icon={Star} gradient="from-amber-500 to-orange-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly activity" description="Lesson views across your courses">
          <BarChartPanel
            data={[
              { day: "Mon", views: 120 },
              { day: "Tue", views: 98 },
              { day: "Wed", views: 145 },
              { day: "Thu", views: 132 },
              { day: "Fri", views: 168 },
              { day: "Sat", views: 89 },
              { day: "Sun", views: 76 },
            ]}
            dataKey="views"
            xKey="day"
          />
        </ChartCard>

        <DataTable
          title="Course overview"
          data={MOCK_INSTRUCTOR_COURSES.map((c) => ({ ...c, id: c.id }))}
          columns={[
            {
              key: "title",
              header: "Course",
              cell: (row) => <span className="font-medium">{row.title}</span>,
            },
            {
              key: "students",
              header: "Students",
              cell: (row) => row.students.toLocaleString(),
            },
            {
              key: "completion",
              header: "Completion",
              cell: (row) => (
                <div className="flex items-center gap-2">
                  <Progress value={row.completion} className="h-2 w-20" />
                  <span className="text-xs text-muted-foreground">{row.completion}%</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      <DataTable
        title="Student progress"
        data={MOCK_STUDENT_PROGRESS}
        columns={[
          { key: "name", header: "Student", cell: (row) => <span className="font-medium">{row.name}</span> },
          { key: "course", header: "Course", cell: (row) => row.course },
          {
            key: "progress",
            header: "Progress",
            cell: (row) => (
              <div className="flex items-center gap-2">
                <Progress value={row.progress} className="h-2 w-24" />
                <span className="text-xs">{row.progress}%</span>
              </div>
            ),
          },
          {
            key: "lastActive",
            header: "Last active",
            cell: (row) => <span className="text-muted-foreground">{row.lastActive}</span>,
          },
        ]}
      />
    </div>
  );
}
