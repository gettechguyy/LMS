"use client";

import { useState } from "react";
import { Users, Heart, MessageCircle, Send, Hash } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MOCK_COMMUNITY_POSTS } from "@/lib/data/mock-features";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getInitials, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  const [post, setPost] = useState("");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        description="Connect with learners, share insights, and grow together"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <p className="font-semibold">Share with the community</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="What's on your mind? Share a win, ask a question..."
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  className="gradient-primary border-0 text-white"
                  disabled={!post.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {MOCK_COMMUNITY_POSTS.map((item) => (
            <Card key={item.id} className="border-border/60">
              <CardHeader className="flex flex-row items-start gap-3 pb-3">
                <Avatar>
                  <AvatarFallback className="gradient-primary text-white text-xs">
                    {getInitials(item.author.split(" ")[0], item.author.split(" ")[1])}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.author}</p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(item.time)}</p>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm leading-relaxed">{item.content}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Hash className="mr-0.5 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="gap-4 border-t bg-muted/20 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setLiked((prev) => {
                      const next = new Set(prev);
                      if (next.has(item.id)) next.delete(item.id);
                      else next.add(item.id);
                      return next;
                    })
                  }
                >
                  <Heart
                    className={cn(
                      "mr-1 h-4 w-4",
                      liked.has(item.id) && "fill-red-500 text-red-500"
                    )}
                  />
                  {item.likes + (liked.has(item.id) ? 1 : 0)}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  {item.comments}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Trending topics
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {["nextjs", "python", "aws", "interview-prep", "study-group"].map((tag, i) => (
                <div key={tag} className="flex items-center justify-between text-sm">
                  <span className="text-primary">#{tag}</span>
                  <span className="text-muted-foreground">{120 - i * 15} posts</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
            <CardContent className="pt-6">
              <p className="font-semibold">Join a study group</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Connect with peers learning the same topics as you.
              </p>
              <Button className="mt-4 w-full" variant="outline">
                Browse groups
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
