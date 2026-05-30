"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

const CHART_COLORS = [
  "hsl(262 83% 58%)",
  "hsl(221 83% 53%)",
  "hsl(173 58% 39%)",
  "hsl(43 96% 56%)",
  "hsl(346 77% 50%)",
];

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  delay?: number;
  headerExtra?: React.ReactNode;
}

export function ChartCard({ title, description, children, delay = 0, headerExtra }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="border-border/50">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerExtra}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return {
    gridColor: isDark ? "hsl(240 3.7% 15.9%)" : "hsl(240 5.9% 90%)",
    textColor: isDark ? "hsl(240 5% 64.9%)" : "hsl(240 3.8% 46.1%)",
    tooltipStyle: {
      backgroundColor: isDark ? "hsl(240 10% 5.5%)" : "hsl(0 0% 100%)",
      border: `1px solid ${isDark ? "hsl(240 3.7% 15.9%)" : "hsl(240 5.9% 90%)"}`,
      borderRadius: "8px",
      fontSize: "12px",
    },
  };
}

export function RevenueAreaChart({
  data,
}: {
  data: Array<{ month: string; revenue: number; enrollments?: number }>;
}) {
  const { gridColor, textColor, tooltipStyle } = useChartTheme();
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(262 83% 58%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
          <Area type="monotone" dataKey="revenue" stroke="hsl(262 83% 58%)" strokeWidth={2} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChartPanel({
  data,
  dataKey,
  xKey = "month",
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  xKey?: string;
}) {
  const { gridColor, textColor, tooltipStyle } = useChartTheme();
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={dataKey} fill="hsl(262 83% 58%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MultiLineChart({
  data,
  lines,
}: {
  data: Record<string, string | number>[];
  lines: Array<{ key: string; color: string; name: string }>;
}) {
  const { gridColor, textColor, tooltipStyle } = useChartTheme();
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          {lines.map((line) => (
            <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} dot={false} name={line.name} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const { tooltipStyle } = useChartTheme();
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" nameKey="name">
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
