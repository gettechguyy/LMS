"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isFree, setIsFree] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          level: form.get("level"),
          price: isFree ? 0 : Number(form.get("price") ?? 0),
          isFree,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create course");
      }

      const json = await res.json();
      toast({ title: "Course created", description: "Your course draft has been saved." });
      router.push("/instructor/courses");
    } catch (error) {
      toast({
        title: "Could not create course",
        description: error instanceof Error ? error.message : "Try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/instructor/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to courses
        </Link>
      </Button>

      <PageHeader
        title="Create Course"
        description="Set up a new course. You can add modules and lessons after saving."
      />

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Course details</CardTitle>
          <CardDescription>Basic information visible to students</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g. Advanced React Patterns" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="What will students learn?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select name="level" defaultValue="beginner">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div>
                <p className="font-medium">Free course</p>
                <p className="text-sm text-muted-foreground">No payment required to enroll</p>
              </div>
              <Switch checked={isFree} onCheckedChange={setIsFree} />
            </div>

            {!isFree && (
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input id="price" name="price" type="number" min={0} step={0.01} placeholder="49.00" />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="gradient-primary flex-1 border-0 text-white">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create draft
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/instructor/courses">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
