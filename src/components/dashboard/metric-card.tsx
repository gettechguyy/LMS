"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/shared/animated-counter";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change?: number;
  suffix?: string;
  prefix?: string;
  gradient?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  change,
  suffix,
  prefix,
  gradient = "from-violet-600 to-indigo-600",
  delay = 0,
}: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="group relative overflow-hidden border-border/50 transition-shadow hover:shadow-lg">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-[0.03] transition-opacity group-hover:opacity-[0.06] dark:opacity-[0.06] dark:group-hover:opacity-[0.1]",
            gradient
          )}
        />
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
              </p>
              {change !== undefined && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {change}% from last week
                  </span>
                </div>
              )}
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                gradient
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
