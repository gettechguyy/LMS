"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validators/auth";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const token = searchParams.get("token") ?? "";

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setIsLoading(true);
    const result = await resetPasswordAction(values.token, values.password, values.confirmPassword);
    setIsLoading(false);

    if (result.success) {
      setDone(true);
      toast({ title: "Password updated", description: result.message });
      setTimeout(() => router.push("/login"), 2000);
    } else {
      toast({ variant: "destructive", title: "Reset failed", description: result.error });
    }
  }

  if (!token) {
    return (
      <Card className="glass border-border/60 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Invalid reset link</CardTitle>
          <CardDescription>This password reset link is missing or expired.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Request a new link
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="glass border-border/60 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Password reset!</CardTitle>
          <CardDescription>Redirecting you to sign in...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/60 shadow-xl shadow-violet-500/5">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
        <CardDescription>Choose a strong password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register("token")} value={token} />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" type="password" placeholder="••••••••" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" type="password" placeholder="••••••••" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full gradient-primary border-0 text-white hover:opacity-90" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reset password
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
