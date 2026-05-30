import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          <DashboardShell user={session}>{children}</DashboardShell>
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
