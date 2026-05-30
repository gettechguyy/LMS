"use client";

import { ClipboardList, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MOCK_ASSIGNMENTS } from "@/lib/data/mock-features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusMap = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
  in_progress: { label: "In Progress", icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-500/10" },
  submitted: { label: "Submitted", icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-500/10" },
  graded: { label: "Graded", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
};

export default function AssignmentsPage() {
  const pending = MOCK_ASSIGNMENTS.filter((a) => ["pending", "in_progress"].includes(a.status));
  const completed = MOCK_ASSIGNMENTS.filter((a) => ["submitted", "graded"].includes(a.status));
  const totalPoints = MOCK_ASSIGNMENTS.reduce((s, a) => s + a.points, 0);
  const earnedPoints = MOCK_ASSIGNMENTS.filter((a) => a.status === "graded").reduce(
    (s, a) => s + ((a as { grade?: number }).grade ?? 0),
    0
  );

  function AssignmentCard({ assignment }: { assignment: (typeof MOCK_ASSIGNMENTS)[0] }) {
    const config = statusMap[assignment.status];
    const Icon = config.icon;
    const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === "pending";

    return (
      <Card className={cn("border-border/60", isOverdue && "border-destructive/50")}>
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
          <div>
            <CardTitle className="text-base">{assignment.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{assignment.course}</p>
          </div>
          <Badge className={cn(config.bg, config.color, "border-0")}>{config.label}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className={cn("h-4 w-4", config.color)} />
              Due {formatDate(assignment.dueDate)}
            </span>
            <span className="font-medium">{assignment.points} pts</span>
          </div>
          {"grade" in assignment && assignment.grade != null && (
            <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Grade: {assignment.grade}%
            </div>
          )}
          <Button size="sm" variant={assignment.status === "pending" ? "default" : "outline"} className="w-full">
            {assignment.status === "graded"
              ? "View feedback"
              : assignment.status === "submitted"
                ? "View submission"
                : assignment.status === "in_progress"
                  ? "Continue"
                  : "Start assignment"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Track deadlines and submit your work"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <ClipboardList className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pending.length}</p>
              <p className="text-sm text-muted-foreground">Active assignments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completed.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Points earned</span>
              <span className="font-medium">
                {earnedPoints}/{totalPoints}
              </span>
            </div>
            <Progress value={(earnedPoints / totalPoints) * 100} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6 grid gap-4 sm:grid-cols-2">
          {pending.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </TabsContent>
        <TabsContent value="completed" className="mt-6 grid gap-4 sm:grid-cols-2">
          {completed.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
