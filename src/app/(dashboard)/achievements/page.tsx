"use client";

import { Trophy, Zap, Flame, Star, Lock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MOCK_BADGES } from "@/lib/data/mock-features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LEVELS = [
  { level: 1, xp: 0, title: "Novice" },
  { level: 2, xp: 500, title: "Apprentice" },
  { level: 3, xp: 1500, title: "Scholar" },
  { level: 4, xp: 3500, title: "Expert" },
  { level: 5, xp: 7000, title: "Master" },
];

export default function AchievementsPage() {
  const currentXp = 2450;
  const currentLevel = LEVELS.filter((l) => currentXp >= l.xp).pop() ?? LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.xp > currentXp) ?? LEVELS[LEVELS.length - 1];
  const xpToNext = nextLevel.xp - currentXp;
  const levelProgress =
    nextLevel.xp > currentLevel.xp
      ? ((currentXp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100
      : 100;
  const streak = 12;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        description="Track your progress, badges, and learning streaks"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{currentXp.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <Trophy className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">Lv. {currentLevel.level}</p>
              <p className="text-sm text-muted-foreground">{currentLevel.title}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10">
              <Flame className="h-7 w-7 text-rose-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">{streak}</p>
              <p className="text-sm text-muted-foreground">Day streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
              <Star className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">
                {MOCK_BADGES.filter((b) => b.earned).length}/{MOCK_BADGES.length}
              </p>
              <p className="text-sm text-muted-foreground">Badges earned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Level progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Level {currentLevel.level} — {currentLevel.title}
            </span>
            <span className="text-muted-foreground">
              {xpToNext > 0 ? `${xpToNext} XP to Level ${nextLevel.level}` : "Max level"}
            </span>
          </div>
          <Progress value={levelProgress} className="h-3" />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Badges</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MOCK_BADGES.map((badge) => (
            <Card
              key={badge.id}
              className={cn(
                "text-center transition-all",
                badge.earned ? "border-primary/30" : "opacity-60 grayscale"
              )}
            >
              <CardContent className="flex flex-col items-center pt-6 pb-4">
                <span className="text-4xl">{badge.earned ? badge.icon : "🔒"}</span>
                <p className="mt-3 font-semibold text-sm">{badge.name}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {badge.description}
                </p>
                {badge.earned && badge.date && (
                  <Badge variant="secondary" className="mt-3 text-[10px]">
                    Earned {badge.date}
                  </Badge>
                )}
                {!badge.earned && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Locked
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="h-5 w-5 text-rose-500" />
            Streak calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "h-8 w-8 rounded-md",
                  i < streak ? "bg-gradient-to-br from-rose-500 to-orange-500" : "bg-muted"
                )}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Keep learning daily to maintain your streak and earn bonus XP!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
