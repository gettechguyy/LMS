import { AuthLogo } from "@/components/auth/auth-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-background to-indigo-50 dark:from-violet-950/30 dark:via-background dark:to-indigo-950/20" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-center px-6 py-8 sm:justify-start">
          <AuthLogo />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
