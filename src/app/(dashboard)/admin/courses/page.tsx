"use client";

import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/panels/data-table";
import { StatusBadge } from "@/components/panels/role-badge";
import { Button } from "@/components/ui/button";
import { MOCK_COURSES } from "@/lib/data/mock-features";

const adminCourses = MOCK_COURSES.map((c) => ({
  id: c.id,
  title: c.title,
  instructor: c.instructor,
  status: c.is_free ? "published" : "published",
  students: c.students,
  price: c.price,
  level: c.level,
}));

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        description="Oversee all courses on the platform."
      >
        <Button asChild className="gradient-primary border-0 text-white">
          <Link href="/instructor/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add course
          </Link>
        </Button>
      </PageHeader>

      <DataTable
        title="All courses"
        data={adminCourses}
        columns={[
          {
            key: "title",
            header: "Course",
            cell: (row) => (
              <div>
                <p className="font-medium">{row.title}</p>
                <p className="text-xs capitalize text-muted-foreground">{row.level}</p>
              </div>
            ),
          },
          { key: "instructor", header: "Instructor", cell: (row) => row.instructor },
          {
            key: "students",
            header: "Students",
            cell: (row) => row.students.toLocaleString(),
          },
          {
            key: "price",
            header: "Price",
            cell: (row) => (row.price === 0 ? "Free" : `$${row.price}`),
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "actions",
            header: "Actions",
            cell: (row) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/courses/${MOCK_COURSES.find((c) => c.id === row.id)?.slug}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
