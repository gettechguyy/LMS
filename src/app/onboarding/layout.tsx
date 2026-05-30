import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AuthLogo } from "@/components/auth/auth-logo";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-background to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/10" />
      <div className="relative">
        <header className="border-b border-border/50 bg-background/60 px-6 py-4 backdrop-blur-xl">
          <AuthLogo />
        </header>
        {children}
      </div>
    </div>
  );
}
