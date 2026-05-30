"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, BookOpen, Lightbulb, Code } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  { icon: BookOpen, text: "Explain React Server Components" },
  { icon: Code, text: "Help me debug this API error" },
  { icon: Lightbulb, text: "Create a study plan for AWS" },
  { icon: Sparkles, text: "Quiz me on JavaScript closures" },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "assistant",
    content:
      "Hi! I'm your AI learning assistant. I can help explain concepts, debug code, create study plans, and quiz you on any topic. What would you like to learn today?",
  },
];

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("react") || lower.includes("server component")) {
    return "React Server Components (RSC) run on the server and send rendered HTML to the client. They reduce JavaScript bundle size and enable direct data fetching without client-side API calls. Use `'use client'` only when you need interactivity, browser APIs, or hooks like useState.";
  }
  if (lower.includes("aws") || lower.includes("study plan")) {
    return "Here's a 4-week AWS study plan:\n\n**Week 1:** IAM, EC2 basics, VPC fundamentals\n**Week 2:** S3, RDS, Lambda intro\n**Week 3:** CloudFormation, CI/CD with CodePipeline\n**Week 4:** Practice exams + hands-on capstone project\n\nI recommend 10-15 hours/week with the Cloud & DevOps course in your catalog.";
  }
  if (lower.includes("debug") || lower.includes("api")) {
    return "Common API debugging steps:\n1. Check HTTP status code and response body\n2. Verify authentication headers/tokens\n3. Log request payload on server side\n4. Use browser Network tab or curl\n5. Confirm CORS settings if calling from browser\n\nShare your specific error and I can help further!";
  }
  if (lower.includes("quiz") || lower.includes("closure")) {
    return "**Quiz: JavaScript Closures**\n\n1. What is a closure?\n2. Will this log 0, 1, 2 or 3, 3, 3?\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n```\n3. How would you fix it with let or IIFE?\n\nReply with your answers!";
  }
  return "That's a great question! Based on your learning profile, I'd recommend reviewing the relevant module in your course catalog and practicing with hands-on exercises. Could you share more details so I can give a more specific answer?";
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(text),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <PageHeader
        title="AI Learning Assistant"
        description="Get instant help with concepts, code, and study planning"
      />

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-card">
        <ScrollArea className="flex-1 p-4">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                    msg.role === "user"
                      ? "gradient-primary text-white"
                      : "bg-muted"
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="border-t px-4 py-3">
            <p className="mb-2 text-xs text-muted-foreground">Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Button
                  key={s.text}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => sendMessage(s.text)}
                >
                  <s.icon className="mr-1.5 h-3.5 w-3.5" />
                  {s.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        <footer className="border-t p-4">
          <div className="mx-auto flex max-w-3xl gap-2">
            <Textarea
              placeholder="Ask anything about your courses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[48px] max-h-32 resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <Button
              size="icon"
              className="h-12 w-12 shrink-0 gradient-primary border-0 text-white"
              disabled={!input.trim() || isTyping}
              onClick={() => sendMessage(input)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-muted-foreground">
            AI responses are for learning assistance. Verify critical information with course materials.
          </p>
        </footer>
      </div>
    </div>
  );
}
