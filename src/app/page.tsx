import Link from "next/link";
import { ArrowRight, BookOpen, Users, Trophy, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-white font-bold text-sm">
              TG
            </div>
            <span className="font-semibold text-lg">The Tech Guy LMS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="gradient-primary border-0">
              <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            <Zap className="mr-1 h-3 w-3" /> Now with AI-powered learning
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Master Tech Skills with{" "}
            <span className="gradient-text">The Tech Guy LMS</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The modern learning platform built for developers, designers, and tech professionals.
            Courses, live classes, mentorship, and career tools — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="gradient-primary border-0 h-12 px-8 text-base">
              <Link href="/signup">Start Learning Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" /> 10,000+ learners
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> 200+ courses
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" /> 4.9/5 rating
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From structured courses to AI-powered mentorship — built for the modern learner.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "Expert-Led Courses", desc: "Video lessons, projects, and quizzes from industry professionals." },
              { icon: Users, title: "Live Classes", desc: "Interactive sessions with real-time Q&A and recordings." },
              { icon: Trophy, title: "Gamification", desc: "Earn XP, badges, and climb the leaderboard as you learn." },
              { icon: Shield, title: "Career Center", desc: "Resume builder, mock interviews, and job application tracking." },
              { icon: Zap, title: "AI Assistant", desc: "Personalized roadmaps, quiz generation, and study planning." },
              { icon: Star, title: "Certificates", desc: "Verifiable certificates with QR codes to showcase your skills." },
            ].map((feature) => (
              <div key={feature.title} className="group rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg">Start free, upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Free", price: "$0", features: ["3 courses", "Community access", "Basic analytics"], popular: false },
              { name: "Pro", price: "$29", features: ["Unlimited courses", "Live classes", "Certificates", "AI assistant"], popular: true },
              { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Custom branding", "SSO", "Dedicated support"], popular: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-xl border p-8 ${plan.popular ? "border-primary shadow-lg shadow-primary/10 relative" : "bg-card"}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary border-0">Most Popular</Badge>
                )}
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${plan.popular ? "gradient-primary border-0" : ""}`} variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl gradient-primary p-12 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to level up your career?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of learners building the skills that matter.
            </p>
            <Button size="lg" variant="secondary" asChild className="h-12 px-8">
              <Link href="/signup">Start Learning Today <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white font-bold text-xs">TG</div>
            <span className="font-semibold">The Tech Guy LMS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} The Tech Guy LMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
