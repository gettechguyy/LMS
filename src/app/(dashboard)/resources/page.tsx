"use client";

import { useState } from "react";
import { Library, Download, Search, FileText, FileArchive, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MOCK_RESOURCES } from "@/lib/data/mock-features";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  Guide: BookOpen,
  ZIP: FileArchive,
};

const categories = ["All", "Web Dev", "Cloud", "Data Science", "Career"];

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = MOCK_RESOURCES.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resource Library"
        description="Download guides, templates, cheat sheets, and more"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((resource) => {
          const Icon = typeIcons[resource.type] ?? FileText;
          return (
            <Card
              key={resource.id}
              className="group border-border/60 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate group-hover:text-primary">
                    {resource.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{resource.type}</Badge>
                    <span>{resource.size}</span>
                    <span>·</span>
                    <span>{resource.category}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {resource.downloads.toLocaleString()} downloads
                  </p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed py-16">
          <Library className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-medium">No resources found</p>
        </div>
      )}
    </div>
  );
}
