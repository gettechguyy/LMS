"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [maintenance, setMaintenance] = useState(false);
  const [registrations, setRegistrations] = useState(true);

  function handleSave() {
    toast({
      title: "Settings saved",
      description: "System configuration has been updated.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure platform-wide options and integrations."
      >
        <Button onClick={handleSave} className="gradient-primary border-0 text-white">
          Save changes
        </Button>
      </PageHeader>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Branding and public-facing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization name</Label>
                  <Input id="orgName" defaultValue="The Tech Guy Academy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support email</Label>
                  <Input id="supportEmail" type="email" defaultValue="support@techguylms.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Textarea id="tagline" defaultValue="Learn. Build. Launch your tech career." rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Platform controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance mode</p>
                  <p className="text-sm text-muted-foreground">Disable public access for updates</p>
                </div>
                <Switch checked={maintenance} onCheckedChange={setMaintenance} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Open registrations</p>
                  <p className="text-sm text-muted-foreground">Allow new user signups</p>
                </div>
                <Switch checked={registrations} onCheckedChange={setRegistrations} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>SMTP configuration</CardTitle>
              <CardDescription>Used for verification and password reset emails</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SMTP host</Label>
                <Input placeholder="smtp.example.com" />
              </div>
              <div className="space-y-2">
                <Label>SMTP port</Label>
                <Input placeholder="587" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>From address</Label>
                <Input placeholder="The Tech Guy LMS &lt;noreply@techguylms.com&gt;" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Security policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session timeout (minutes)</Label>
                <Input type="number" defaultValue={15} />
              </div>
              <div className="space-y-2">
                <Label>Max login attempts</Label>
                <Input type="number" defaultValue={5} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-medium">Require email verification</p>
                  <p className="text-sm text-muted-foreground">Before accessing courses</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
