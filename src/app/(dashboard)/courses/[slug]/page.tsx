"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Play,
  CheckCircle2,
  Award,
} from "lucide-react";
import { MOCK_COURSES } from "@/lib/data/mock-features";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CURRICULUM = [
  { module: "Getting Started", lessons: 4, duration: "1h 20m" },
  { module: "Core Concepts", lessons: 12, duration: "4h 30m" },
  { module: "Hands-on Projects", lessons: 8, duration: "6h 15m" },
  { module: "Advanced Topics", lessons: 10, duration: "5h 45m" },
  { module: "Capstone & Deployment", lessons: 6, duration: "3h 30m" },
];

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { toast } = useToast();
  const course = MOCK_COURSES.find((c) => c.slug === slug);

  if (!course) notFound();

  function handleEnroll() {
    toast({
      title: "Enrolled successfully!",
      description: `You're now enrolled in ${course!.title}.`,
    });
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-violet-500/10 via-background to-indigo-500/10 p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="capitalize">{course.level}</Badge>
              {course.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {course.rating} rating
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {course.students.toLocaleString()} students
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {course.duration_hours} hours
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {course.lessons} lessons
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Instructor: <span className="font-medium text-foreground">{course.instructor}</span>
            </p>
          </div>
          <Card className="h-fit border-border/60 shadow-lg">
            <CardContent className="space-y-4 pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {course.is_free ? "Free" : formatCurrency(course.price)}
                </p>
                {!course.is_free && (
                  <p className="text-sm text-muted-foreground line-through">$99</p>
                )}
              </div>
              <Button
                className="w-full gradient-primary border-0 text-white"
                size="lg"
                onClick={handleEnroll}
              >
                Enroll Now
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/courses/${slug}/learn`}>
                  <Play className="mr-2 h-4 w-4" />
                  Preview course
                </Link>
              </Button>
              <Separator />
              <ul className="space-y-2 text-sm">
                {["Lifetime access", "Certificate of completion", "Downloadable resources", "Community support"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What you&apos;ll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Build production-ready applications",
                  "Master industry best practices",
                  "Deploy to cloud platforms",
                  "Work with modern tooling",
                  "Collaborate using Git workflows",
                  "Prepare for technical interviews",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Curriculum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CURRICULUM.map((mod, i) => (
                <div
                  key={mod.module}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30"
                >
                  <div>
                    <p className="font-medium">
                      {i + 1}. {mod.module}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mod.lessons} lessons · {mod.duration}
                    </p>
                  </div>
                  <Award className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Not started</span>
                <span className="font-medium">0%</span>
              </div>
              <Progress value={0} />
            </div>
            <p className="text-sm text-muted-foreground">
              Enroll to track your progress and earn your certificate.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
