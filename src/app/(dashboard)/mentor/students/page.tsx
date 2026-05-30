"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/panels/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { MOCK_MENTOR_STUDENTS } from "@/lib/data/mock-panels";

export default function MentorStudentsPage() {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState(MOCK_MENTOR_STUDENTS[0]?.id);
  const [feedback, setFeedback] = useState("");

  const selected = MOCK_MENTOR_STUDENTS.find((s) => s.id === selectedId);

  function submitFeedback() {
    if (!feedback.trim() || !selected) return;
    toast({
      title: "Feedback sent",
      description: `Your notes for ${selected.name} have been saved.`,
    });
    setFeedback("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Reviews"
        description="Track mentee progress and provide written feedback."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            title="Your students"
            data={MOCK_MENTOR_STUDENTS}
            columns={[
              {
                key: "student",
                header: "Student",
                cell: (row) => (
                  <button
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                    className="flex items-center gap-3 text-left"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gradient-primary text-xs text-white">
                        {getInitials(row.name.split(" ")[0], row.name.split(" ")[1] ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                  </button>
                ),
              },
              {
                key: "sessions",
                header: "Sessions",
                cell: (row) => row.sessions,
              },
              {
                key: "rating",
                header: "Avg rating",
                cell: (row) => (
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {row.avgRating}
                  </span>
                ),
              },
              {
                key: "last",
                header: "Last session",
                cell: (row) => <span className="text-muted-foreground">{row.lastSession}</span>,
              },
            ]}
          />
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Feedback</CardTitle>
            {selected && (
              <p className="text-sm text-muted-foreground">Notes for {selected.name}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {selected && (
              <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                Previous: {selected.feedback}
              </p>
            )}
            <Textarea
              placeholder="Write constructive feedback for your student..."
              rows={6}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button
              onClick={submitFeedback}
              disabled={!feedback.trim()}
              className="w-full gradient-primary border-0 text-white"
            >
              <Send className="mr-2 h-4 w-4" />
              Send feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
