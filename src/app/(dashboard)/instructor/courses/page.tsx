"use client";

import Link from "next/link";
import { Plus, Pencil, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/panels/data-table";
import { StatusBadge } from "@/components/panels/role-badge";
import { Button } from "@/components/ui/button";
import { MOCK_INSTRUCTOR_COURSES } from "@/lib/data/mock-panels";

export default function InstructorCoursesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description="Create, edit, and publish your courses."
      >
        <Button asChild className="gradient-primary border-0 text-white">
          <Link href="/instructor/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            New course
          </Link>
        </Button>
      </PageHeader>

      <DataTable
        title="Your courses"
        data={MOCK_INSTRUCTOR_COURSES}
        columns={[
          {
            key: "title",
            header: "Course",
            cell: (row) => (
              <div>
                <p className="font-medium">{row.title}</p>
                <p className="text-xs text-muted-foreground">/{row.slug}</p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "students",
            header: "Students",
            cell: (row) => row.students.toLocaleString(),
          },
          {
            key: "revenue",
            header: "Revenue",
            cell: (row) => (row.revenue > 0 ? `$${row.revenue.toLocaleString()}` : "Free"),
          },
          {
            key: "actions",
            header: "Actions",
            cell: (row) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" title="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" asChild title="Analytics">
                  <Link href="/instructor/analytics">
                    <BarChart3 className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
