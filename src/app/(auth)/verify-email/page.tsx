"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { verifyEmailAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">(
    token ? "loading" : "pending"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    verifyEmailAction(token).then((result) => {
      if (result.success) {
        setStatus("success");
        setMessage(result.message ?? "Your email has been verified.");
      } else {
        setStatus("error");
        setMessage(result.error ?? "Verification failed.");
      }
    });
  }, [token]);

  if (status === "loading") {
    return (
      <Card className="glass border-border/60 shadow-xl">
        <CardContent className="flex flex-col items-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying your email...</p>
        </CardContent>
      </Card>
    );
  }

  if (status === "pending") {
    return (
      <Card className="glass border-border/60 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We sent a verification link to your inbox. Click the link in the email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full gradient-primary border-0 text-white">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const isSuccess = status === "success";

  return (
    <Card className="glass border-border/60 shadow-xl">
      <CardHeader className="text-center">
        <div
          className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full ${
            isSuccess ? "bg-emerald-500/10" : "bg-destructive/10"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          ) : (
            <XCircle className="h-7 w-7 text-destructive" />
          )}
        </div>
        <CardTitle className="text-2xl font-bold">
          {isSuccess ? "Email verified!" : "Verification failed"}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Button asChild variant={isSuccess ? "default" : "outline"}>
          <Link href={isSuccess ? "/dashboard" : "/login"}>
            {isSuccess ? "Continue to dashboard" : "Back to sign in"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
