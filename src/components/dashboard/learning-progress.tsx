"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface ProgressDataPoint {
  day: string;
  hours: number;
  lessons: number;
}

interface LearningProgressProps {
  data?: ProgressDataPoint[];
}

const DEFAULT_DATA: ProgressDataPoint[] = [
  { day: "Mon", hours: 2.5, lessons: 3 },
  { day: "Tue", hours: 1.8, lessons: 2 },
  { day: "Wed", hours: 3.2, lessons: 4 },
  { day: "Thu", hours: 2.0, lessons: 2 },
  { day: "Fri", hours: 4.1, lessons: 5 },
  { day: "Sat", hours: 1.5, lessons: 1 },
  { day: "Sun", hours: 2.8, lessons: 3 },
];

export function LearningProgress({ data = DEFAULT_DATA }: LearningProgressProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "hsl(240 3.7% 15.9%)" : "hsl(240 5.9% 90%)";
  const textColor = isDark ? "hsl(240 5% 64.9%)" : "hsl(240 3.8% 46.1%)";

  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);
  const totalLessons = data.reduce((sum, d) => sum + d.lessons, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Learning Progress</CardTitle>
              <CardDescription>Your study activity this week</CardDescription>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-bold text-primary">{totalHours.toFixed(1)}h</span>
                <span className="ml-1 text-muted-foreground">studied</span>
              </div>
              <div>
                <span className="font-bold text-primary">{totalLessons}</span>
                <span className="ml-1 text-muted-foreground">lessons</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(262 83% 58%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: textColor, fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: textColor, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "hsl(240 10% 5.5%)" : "hsl(0 0% 100%)",
                    border: `1px solid ${gridColor}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: textColor }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(262 83% 58%)"
                  strokeWidth={2}
                  fill="url(#hoursGradient)"
                  name="Hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
