"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  title,
  data,
  columns,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  emptyMessage = "No results found.",
}: DataTableProps<T>) {
  return (
    <Card className="border-border/50">
      {(title || onSearchChange) && (
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {onSearchChange && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(!title && !onSearchChange && "pt-6")}>
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/40">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/30 transition-colors last:border-0 hover:bg-muted/30"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3", col.className)}>
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
