"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Circle,
  FileText,
  MessageSquare,
  FolderOpen,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { MOCK_COURSES, MOCK_LESSONS } from "@/lib/data/mock-features";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CourseLearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const course = MOCK_COURSES.find((c) => c.slug === slug);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLesson, setActiveLesson] = useState(
    MOCK_LESSONS.find((l) => l.current)?.id ?? MOCK_LESSONS[0].id
  );
  const [notes, setNotes] = useState("");

  if (!course) notFound();

  const completedCount = MOCK_LESSONS.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / MOCK_LESSONS.length) * 100);
  const current = MOCK_LESSONS.find((l) => l.id === activeLesson);

  return (
    <div className="-m-4 flex h-[calc(100vh-4rem)] flex-col lg:-m-6 lg:h-[calc(100vh-5rem)]">
      <header className="flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/courses/${slug}`}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{course.title}</p>
            <p className="truncate text-xs text-muted-foreground">{current?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <Progress value={progress} className="h-2 w-32" />
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="relative aspect-video bg-black">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/80 to-indigo-900/80">
              <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur transition-transform hover:scale-105">
                <Play className="h-10 w-10 fill-white text-white" />
              </div>
              <p className="mt-4 text-lg font-medium text-white">{current?.title}</p>
              <p className="text-sm text-white/70">{current?.duration} min</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList>
                <TabsTrigger value="notes" className="gap-1.5">
                  <FileText className="h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="discussion" className="gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  Discussion
                </TabsTrigger>
                <TabsTrigger value="resources" className="gap-1.5">
                  <FolderOpen className="h-4 w-4" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="quiz" className="gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  Quiz
                </TabsTrigger>
              </TabsList>
              <TabsContent value="notes" className="mt-4">
                <Textarea
                  placeholder="Take notes while you learn..."
                  className="min-h-[200px] resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button className="mt-2" size="sm" variant="outline">
                  Save notes
                </Button>
              </TabsContent>
              <TabsContent value="discussion" className="mt-4 space-y-4">
                {[
                  { author: "Alex R.", text: "Great explanation in this lesson!", time: "2h ago" },
                  { author: "Sarah C.", text: "Anyone stuck on the lab? Happy to help.", time: "5h ago" },
                ].map((post, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{post.author}</span>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                    <p className="mt-2 text-sm">{post.text}</p>
                  </div>
                ))}
                <Textarea placeholder="Join the discussion..." className="min-h-[80px]" />
                <Button size="sm" className="gradient-primary border-0 text-white">
                  Post comment
                </Button>
              </TabsContent>
              <TabsContent value="resources" className="mt-4 space-y-2">
                {["Lesson slides.pdf", "Code starter.zip", "Cheat sheet.pdf"].map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                  >
                    <span className="text-sm font-medium">{file}</span>
                    <Button size="sm" variant="ghost">
                      Download
                    </Button>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="quiz" className="mt-4">
                <div className="rounded-lg border p-6">
                  <h3 className="font-semibold">Lesson Quiz</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Test your understanding of {current?.title}
                  </p>
                  <ol className="mt-4 space-y-4 text-sm">
                    <li>
                      <p className="font-medium">1. What is the primary purpose of this module?</p>
                      <div className="mt-2 space-y-2">
                        {["Option A", "Option B", "Option C"].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 rounded border p-2 cursor-pointer hover:bg-muted/50">
                            <input type="radio" name="q1" className="accent-primary" />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </li>
                  </ol>
                  <Button className="mt-4 gradient-primary border-0 text-white">Submit quiz</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {sidebarOpen && (
          <aside className="w-80 shrink-0 border-l bg-muted/20">
            <div className="border-b p-4">
              <p className="text-sm font-semibold">Course content</p>
              <Progress value={progress} className="mt-2 h-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">
                {completedCount}/{MOCK_LESSONS.length} completed
              </p>
            </div>
            <ScrollArea className="h-[calc(100%-5rem)]">
              <div className="p-2 space-y-1">
                {MOCK_LESSONS.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLesson(lesson.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg p-3 text-left text-sm transition-colors",
                      activeLesson === lesson.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{lesson.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {lesson.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{lesson.duration}m</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}
      </div>
    </div>
  );
}
