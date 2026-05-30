"use client";

import { Briefcase, FileText, Send, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

const RESUME_SECTIONS = [
  { name: "Contact & Summary", complete: true },
  { name: "Experience", complete: true },
  { name: "Education", complete: true },
  { name: "Skills", complete: false },
  { name: "Projects", complete: false },
];

const APPLICATIONS = [
  { company: "TechCorp", role: "Frontend Developer", status: "interview", date: "2026-05-28" },
  { company: "DataFlow Inc", role: "Full-Stack Engineer", status: "applied", date: "2026-05-25" },
  { company: "CloudNine", role: "DevOps Engineer", status: "offer", date: "2026-05-20" },
  { company: "StartupXYZ", role: "Junior Developer", status: "rejected", date: "2026-05-15" },
];

const INTERVIEWS = [
  { company: "TechCorp", role: "Frontend Developer", date: "2026-06-03T14:00:00Z", type: "Technical", prep: 75 },
  { company: "InnovateLabs", role: "React Developer", date: "2026-06-05T10:00:00Z", type: "Behavioral", prep: 40 },
];

const statusColors: Record<string, string> = {
  applied: "bg-blue-500/10 text-blue-700",
  interview: "bg-violet-500/10 text-violet-700",
  offer: "bg-emerald-500/10 text-emerald-700",
  rejected: "bg-muted text-muted-foreground",
};

export default function CareerPage() {
  const resumeProgress = Math.round(
    (RESUME_SECTIONS.filter((s) => s.complete).length / RESUME_SECTIONS.length) * 100
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Center"
        description="Build your resume, track applications, and prepare for interviews"
      />

      <Tabs defaultValue="resume">
        <TabsList>
          <TabsTrigger value="resume" className="gap-1.5">
            <FileText className="h-4 w-4" />
            Resume
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-1.5">
            <Send className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="interviews" className="gap-1.5">
            <Calendar className="h-4 w-4" />
            Interviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resume builder</CardTitle>
                <CardDescription>Complete all sections for a standout resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Completion</span>
                    <span className="font-medium">{resumeProgress}%</span>
                  </div>
                  <Progress value={resumeProgress} />
                </div>
                <ul className="space-y-2">
                  {RESUME_SECTIONS.map((section) => (
                    <li
                      key={section.name}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <span className="text-sm font-medium">{section.name}</span>
                      <Badge variant={section.complete ? "default" : "outline"}>
                        {section.complete ? "Done" : "Incomplete"}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <Button className="w-full gradient-primary border-0 text-white">
                  Edit resume
                </Button>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 font-medium">Resume preview</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete your resume sections to see a live preview here.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <div className="space-y-3">
            {APPLICATIONS.map((app) => (
              <Card key={app.company + app.role}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{app.role}</p>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      Applied {formatDate(app.date)}
                    </span>
                    <Badge className={statusColors[app.status]}>{app.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="mt-4" variant="outline">
            Track new application
          </Button>
        </TabsContent>

        <TabsContent value="interviews" className="mt-6 grid gap-4 sm:grid-cols-2">
          {INTERVIEWS.map((interview) => (
            <Card key={interview.company}>
              <CardHeader>
                <CardTitle className="text-base">{interview.role}</CardTitle>
                <CardDescription>{interview.company}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(interview.date)} · {interview.type}
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Prep progress</span>
                    <span>{interview.prep}%</span>
                  </div>
                  <Progress value={interview.prep} />
                </div>
                <Button className="w-full" variant="outline">
                  Start prep module
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
