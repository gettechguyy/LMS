"use client";

import { useState } from "react";
import { FolderKanban, Heart, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MOCK_PROJECTS } from "@/lib/data/mock-features";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const filtered = MOCK_PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Gallery"
        description="Showcase your work and get inspired by the community"
      >
        <Button className="gradient-primary border-0 text-white">Submit project</Button>
      </PageHeader>

      <Input
        placeholder="Search projects or technologies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <Card
            key={project.id}
            className="group overflow-hidden border-border/60 transition-all hover:shadow-lg"
          >
            <div className={cn("h-40 bg-gradient-to-br", project.image)} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">by {project.author}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setLiked((prev) => {
                    const next = new Set(prev);
                    if (next.has(project.id)) next.delete(project.id);
                    else next.add(project.id);
                    return next;
                  })
                }
              >
                <Heart
                  className={cn(
                    "mr-1 h-4 w-4",
                    liked.has(project.id) && "fill-red-500 text-red-500"
                  )}
                />
                {project.likes + (liked.has(project.id) ? 1 : 0)}
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1 h-4 w-4" />
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed py-16">
          <FolderKanban className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-medium">No projects found</p>
          <p className="text-sm text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
