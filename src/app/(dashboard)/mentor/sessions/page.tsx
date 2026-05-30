"use client";

import { useState } from "react";
import { Calendar, Plus, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/panels/data-table";
import { StatusBadge } from "@/components/panels/role-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MOCK_MENTOR_SESSIONS } from "@/lib/data/mock-panels";
import { format } from "date-fns";

export default function MentorSessionsPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState(MOCK_MENTOR_SESSIONS);
  const [open, setOpen] = useState(false);

  function scheduleSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newSession = {
      id: String(Date.now()),
      student: form.get("student") as string,
      topic: form.get("topic") as string,
      scheduled_at: new Date(form.get("datetime") as string).toISOString(),
      duration: Number(form.get("duration") ?? 60),
      status: "scheduled" as const,
    };
    setSessions((prev) => [newSession, ...prev]);
    setOpen(false);
    toast({ title: "Session scheduled", description: `Meeting with ${newSession.student} booked.` });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Session Scheduling"
        description="Book and manage 1:1 mentorship sessions."
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule session</DialogTitle>
            </DialogHeader>
            <form onSubmit={scheduleSession} className="space-y-4">
              <div className="space-y-2">
                <Label>Student name</Label>
                <Input name="student" required placeholder="Emma Wilson" />
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input name="topic" required placeholder="Career roadmap review" />
              </div>
              <div className="space-y-2">
                <Label>Date & time</Label>
                <Input name="datetime" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input name="duration" type="number" defaultValue={60} min={15} step={15} />
              </div>
              <Button type="submit" className="w-full gradient-primary border-0 text-white">
                Schedule
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              This week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{sessions.filter((s) => s.status === "scheduled").length}</p>
            <p className="text-sm text-muted-foreground">Scheduled sessions</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 md:col-span-2">
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Meeting links are generated automatically and sent to students via notification.
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="All sessions"
        data={sessions}
        columns={[
          { key: "student", header: "Student", cell: (row) => <span className="font-medium">{row.student}</span> },
          { key: "topic", header: "Topic", cell: (row) => row.topic },
          {
            key: "when",
            header: "Scheduled",
            cell: (row) => format(new Date(row.scheduled_at), "MMM d, yyyy h:mm a"),
          },
          {
            key: "duration",
            header: "Duration",
            cell: (row) => `${row.duration} min`,
          },
          {
            key: "status",
            header: "Status",
            cell: (row) => <StatusBadge status={row.status} />,
          },
        ]}
      />
    </div>
  );
}
