"use client";

import Link from "next/link";
import { Calendar, Star, Users, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/panels/role-badge";
import { MOCK_MENTOR_SESSIONS, MOCK_MENTOR_REVIEWS } from "@/lib/data/mock-panels";
import { format } from "date-fns";

const upcoming = MOCK_MENTOR_SESSIONS.filter((s) => s.status === "scheduled");
const avgRating =
  MOCK_MENTOR_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_MENTOR_REVIEWS.length;

export default function MentorDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor Dashboard"
        description="Upcoming sessions, reviews, and student outcomes."
      >
        <Button asChild className="gradient-primary border-0 text-white">
          <Link href="/mentor/sessions">Schedule session</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Upcoming" value={upcoming.length} icon={Calendar} gradient="from-violet-600 to-indigo-600" />
        <MetricCard title="Avg Rating" value={Math.round(avgRating * 10) / 10} icon={Star} gradient="from-amber-500 to-orange-600" />
        <MetricCard title="Students" value={12} icon={Users} change={4} gradient="from-emerald-500 to-teal-600" />
        <MetricCard title="Reviews" value={MOCK_MENTOR_REVIEWS.length} icon={MessageSquare} gradient="from-blue-500 to-cyan-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming sessions</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/mentor/sessions">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium">{session.student}</p>
                  <p className="text-sm text-muted-foreground">{session.topic}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(session.scheduled_at), "MMM d, yyyy · h:mm a")} · {session.duration} min
                  </p>
                </div>
                <StatusBadge status={session.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_MENTOR_REVIEWS.map((review) => (
              <div key={review.id} className="rounded-lg border border-border/50 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{review.student}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.review}</p>
                <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
