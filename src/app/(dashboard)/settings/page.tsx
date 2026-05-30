"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { Loader2, User, Shield, Bell, Palette, CreditCard } from "lucide-react";
import { profileSchema, changePasswordSchema, type ProfileInput } from "@/lib/validators/auth";
import { z } from "zod";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { SUBSCRIPTION_PLANS } from "@/types";
import { cn } from "@/lib/utils";

const notificationSchema = z.object({
  courseUpdates: z.boolean(),
  assignments: z.boolean(),
  messages: z.boolean(),
  marketing: z.boolean(),
});

type NotificationInput = z.infer<typeof notificationSchema>;
type PasswordInput = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "John", lastName: "Doe", avatar: "" },
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const notificationForm = useForm<NotificationInput>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      courseUpdates: true,
      assignments: true,
      messages: true,
      marketing: false,
    },
  });

  async function onProfileSubmit(values: ProfileInput) {
    setProfileLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setProfileLoading(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  }

  async function onPasswordSubmit(values: PasswordInput) {
    setPasswordLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setPasswordLoading(false);
    passwordForm.reset();
    toast({ title: "Password updated", description: "Your password has been changed." });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 max-w-md">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={profileForm.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={profileLoading} className="gradient-primary border-0 text-white">
                    {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>Ensure your account stays secure</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm new password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form
                  onSubmit={notificationForm.handleSubmit(() => {
                    toast({ title: "Preferences saved" });
                  })}
                  className="space-y-6"
                >
                  {[
                    { name: "courseUpdates" as const, label: "Course updates", desc: "New lessons and announcements" },
                    { name: "assignments" as const, label: "Assignments", desc: "Deadlines and grades" },
                    { name: "messages" as const, label: "Messages", desc: "Direct messages and mentions" },
                    { name: "marketing" as const, label: "Marketing", desc: "Tips, offers, and product news" },
                  ].map((item) => (
                    <FormField
                      key={item.name}
                      control={notificationForm.control}
                      name={item.name}
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>{item.label}</Label>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      )}
                    />
                  ))}
                  <Button type="submit" className="gradient-primary border-0 text-white">
                    Save preferences
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the platform looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-center capitalize transition-all",
                      theme === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>You are on the Pro plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="gradient-primary border-0 text-white">Pro</Badge>
                <span className="text-2xl font-bold">$29/mo</span>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-3">
                {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                  <Card
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      key === "pro" && "border-primary ring-1 ring-primary"
                    )}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      <p className="text-2xl font-bold">
                        {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {plan.features.map((f) => (
                          <li key={f}>• {f}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline">Manage billing</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
