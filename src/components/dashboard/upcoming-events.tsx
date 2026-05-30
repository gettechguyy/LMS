"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Video, Users, MapPin } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UpcomingEvent {
  id: string;
  title: string;
  type: "live-class" | "deadline" | "workshop" | "mentor-session";
  date: string;
  time: string;
  instructor?: string;
  isOnline?: boolean;
}

interface UpcomingEventsProps {
  events?: UpcomingEvent[];
}

const DEFAULT_EVENTS: UpcomingEvent[] = [
  {
    id: "1",
    title: "React Advanced Patterns",
    type: "live-class",
    date: new Date(Date.now() + 86400000).toISOString(),
    time: "10:00 AM",
    instructor: "Sarah Chen",
    isOnline: true,
  },
  {
    id: "2",
    title: "TypeScript Assignment Due",
    type: "deadline",
    date: new Date(Date.now() + 172800000).toISOString(),
    time: "11:59 PM",
  },
  {
    id: "3",
    title: "System Design Workshop",
    type: "workshop",
    date: new Date(Date.now() + 259200000).toISOString(),
    time: "2:00 PM",
    instructor: "Mike Johnson",
    isOnline: true,
  },
  {
    id: "4",
    title: "1:1 Mentor Session",
    type: "mentor-session",
    date: new Date(Date.now() + 345600000).toISOString(),
    time: "4:30 PM",
    instructor: "Alex Rivera",
    isOnline: true,
  },
];

const TYPE_CONFIG = {
  "live-class": { label: "Live Class", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400", icon: Video },
  deadline: { label: "Deadline", color: "bg-red-500/10 text-red-600 dark:text-red-400", icon: Clock },
  workshop: { label: "Workshop", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: Users },
  "mentor-session": { label: "Mentor", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: Calendar },
};

export function UpcomingEvents({ events = DEFAULT_EVENTS }: UpcomingEventsProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Upcoming Events</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View Calendar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => {
            const config = TYPE_CONFIG[event.type];
            const EventIcon = config.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    config.color
                  )}
                >
                  <EventIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{event.title}</p>
                    <Badge variant="secondary" className={cn("shrink-0 text-[10px]", config.color)}>
                      {config.label}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </span>
                    {event.isOnline && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Online
                      </span>
                    )}
                  </div>
                  {event.instructor && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      with {event.instructor}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
