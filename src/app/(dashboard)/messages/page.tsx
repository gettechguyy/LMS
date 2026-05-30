"use client";

import { useState } from "react";
import { Search, Send, MoreVertical } from "lucide-react";
import { MOCK_MESSAGES } from "@/lib/data/mock-features";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getInitials, formatRelativeTime, cn } from "@/lib/utils";

const CHAT_MESSAGES: Record<string, Array<{ from: "me" | "them"; text: string; time: string }>> = {
  "1": [
    { from: "them", text: "Hey! Did you finish the API assignment?", time: "2:30 PM" },
    { from: "me", text: "Almost done! Just working on the auth middleware.", time: "2:45 PM" },
    { from: "them", text: "Thanks for the help with the API!", time: "2:30 PM" },
  ],
  "2": [
    { from: "them", text: "Are you joining the live class tomorrow?", time: "11:00 AM" },
  ],
  "3": [
    { from: "them", text: "Check out the new DevOps resources in the library.", time: "4:45 PM" },
  ],
  "4": [
    { from: "them", text: "Your roadmap has been updated based on your latest assessment.", time: "9:00 AM" },
  ],
};

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(MOCK_MESSAGES[0].id);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filtered = MOCK_MESSAGES.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  const active = MOCK_MESSAGES.find((m) => m.id === activeId);
  const messages = CHAT_MESSAGES[activeId] ?? [];

  return (
    <div className="-m-4 flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border lg:-m-6 lg:h-[calc(100vh-5rem)]">
      <aside className="flex w-full flex-col border-r md:w-80 lg:w-96">
        <div className="border-b p-4">
          <h1 className="text-lg font-bold">Messages</h1>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setActiveId(conv.id)}
              className={cn(
                "flex w-full items-center gap-3 border-b p-4 text-left transition-colors hover:bg-muted/50",
                activeId === conv.id && "bg-primary/5"
              )}
            >
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="text-xs">
                    {getInitials(conv.name.split(" ")[0], conv.name.split(" ")[1])}
                  </AvatarFallback>
                </Avatar>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate font-medium text-sm">{conv.name}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {formatRelativeTime(conv.time)}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </ScrollArea>
      </aside>

      <div className="hidden flex-1 flex-col md:flex">
        {active ? (
          <>
            <header className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(active.name.split(" ")[0], active.name.split(" ")[1])}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{active.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {active.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </header>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn("flex", msg.from === "me" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                        msg.from === "me"
                          ? "gradient-primary text-white"
                          : "bg-muted"
                      )}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={cn(
                          "mt-1 text-[10px]",
                          msg.from === "me" ? "text-white/70" : "text-muted-foreground"
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <footer className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      setMessage("");
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="shrink-0 gradient-primary border-0 text-white"
                  disabled={!message.trim()}
                  onClick={() => setMessage("")}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
