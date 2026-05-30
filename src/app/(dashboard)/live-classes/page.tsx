"use client";

import { Video, Calendar, Users, Radio } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MOCK_LIVE_CLASSES } from "@/lib/data/mock-features";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusConfig = {
  upcoming: { label: "Upcoming", variant: "secondary" as const, color: "text-blue-600" },
  live: { label: "Live Now", variant: "default" as const, color: "text-red-500" },
  recorded: { label: "Recorded", variant: "outline" as const, color: "text-muted-foreground" },
};

export default function LiveClassesPage() {
  const upcoming = MOCK_LIVE_CLASSES.filter((c) => c.status === "upcoming");
  const live = MOCK_LIVE_CLASSES.filter((c) => c.status === "live");
  const recorded = MOCK_LIVE_CLASSES.filter((c) => c.status === "recorded");

  function ClassCard({ cls }: { cls: (typeof MOCK_LIVE_CLASSES)[0] }) {
    const config = statusConfig[cls.status];
    return (
      <Card className="overflow-hidden border-border/60 transition-shadow hover:shadow-lg">
        <div className="relative h-32 bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="h-10 w-10 text-primary/50" />
          </div>
          {cls.status === "live" && (
            <Badge className="absolute left-3 top-3 animate-pulse bg-red-500">
              <Radio className="mr-1 h-3 w-3" />
              LIVE
            </Badge>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">{cls.title}</CardTitle>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">with {cls.instructor}</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(cls.date)} · {cls.duration} min
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {cls.attendees} registered
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className={cn(
              "w-full",
              cls.status === "live" && "gradient-primary border-0 text-white"
            )}
            variant={cls.status === "live" ? "default" : "outline"}
          >
            {cls.status === "live" ? "Join now" : cls.status === "recorded" ? "Watch replay" : "Register"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Classes"
        description="Join interactive sessions with instructors and peers"
      />

      {live.length > 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <p className="mb-3 flex items-center gap-2 font-semibold text-red-600">
            <Radio className="h-4 w-4 animate-pulse" />
            Happening now
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {live.map((cls) => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="recorded">Recordings ({recorded.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((cls) => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recorded" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recorded.map((cls) => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
