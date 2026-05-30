"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Award, Flame } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar?: string | null;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
}

const DEFAULT_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, id: "1", name: "Alex Rivera", xp: 4850, streak: 21 },
  { rank: 2, id: "2", name: "Sarah Chen", xp: 4320, streak: 14 },
  { rank: 3, id: "3", name: "Mike Johnson", xp: 3890, streak: 7 },
  { rank: 4, id: "4", name: "Emma Wilson", xp: 3450, streak: 12 },
  { rank: 5, id: "5", name: "James Park", xp: 2980, streak: 5 },
];

const RANK_ICONS = [
  { icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Medal, color: "text-slate-400", bg: "bg-slate-400/10" },
  { icon: Award, color: "text-amber-700", bg: "bg-amber-700/10" },
];

export function Leaderboard({ entries = DEFAULT_ENTRIES }: LeaderboardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Leaderboard</CardTitle>
        <Badge variant="secondary" className="text-xs">
          This Week
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const rankStyle = RANK_ICONS[entry.rank - 1];
            const [firstName, ...rest] = entry.name.split(" ");
            const lastName = rest.join(" ");

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5 transition-colors",
                  entry.isCurrentUser
                    ? "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 ring-1 ring-primary/20"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex w-8 items-center justify-center">
                  {rankStyle ? (
                    <div className={cn("rounded-full p-1.5", rankStyle.bg)}>
                      <rankStyle.icon className={cn("h-4 w-4", rankStyle.color)} />
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                <Avatar className="h-9 w-9">
                  {entry.avatar && <AvatarImage src={entry.avatar} alt={entry.name} />}
                  <AvatarFallback className="text-xs">
                    {getInitials(firstName, lastName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="ml-1.5 text-xs text-primary">(You)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{entry.xp.toLocaleString()} XP</span>
                    <span className="flex items-center gap-0.5">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {entry.streak}d
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
