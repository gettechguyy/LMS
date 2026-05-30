"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Target,
  Briefcase,
  Sliders,
  Sparkles,
  Map,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import {
  saveOnboardingStepAction,
  completeOnboardingAction,
  getOnboardingProgressAction,
} from "@/actions/onboarding";
import { ONBOARDING_STEPS, type UserRole } from "@/types";
import { MOCK_ROADMAP } from "@/lib/data/mock-features";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const GOALS = [
  "Land my first tech job",
  "Switch careers into tech",
  "Get promoted",
  "Learn new skills",
  "Build side projects",
  "Prepare for certifications",
  "Start freelancing",
  "Teach others",
];

const EXPERIENCE_LEVELS = [
  { value: "none", label: "Complete beginner", desc: "New to tech" },
  { value: "some", label: "Some exposure", desc: "Tutorials & hobby projects" },
  { value: "intermediate", label: "Intermediate", desc: "1-3 years experience" },
  { value: "advanced", label: "Advanced", desc: "3+ years professional" },
];

const SKILL_AREAS = ["JavaScript", "Python", "React", "SQL", "Cloud/DevOps", "UI/UX"];

const LEARNING_STYLES = [
  { value: "visual", label: "Visual", desc: "Videos & diagrams" },
  { value: "hands-on", label: "Hands-on", desc: "Projects & labs" },
  { value: "reading", label: "Reading", desc: "Docs & articles" },
  { value: "mixed", label: "Mixed", desc: "Combination of all" },
];

const PACE_OPTIONS = [
  { value: "relaxed", label: "Relaxed", desc: "5-8 hrs/week" },
  { value: "moderate", label: "Moderate", desc: "10-15 hrs/week" },
  { value: "intensive", label: "Intensive", desc: "20+ hrs/week" },
];

interface OnboardingState {
  role?: UserRole;
  goals: string[];
  experience?: string;
  skills: Record<string, number>;
  preferences: {
    learningStyle?: string;
    pace?: string;
    topics: string[];
  };
}

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function OnboardingWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [data, setData] = useState<OnboardingState>({
    goals: [],
    skills: Object.fromEntries(SKILL_AREAS.map((s) => [s, 5])),
    preferences: { topics: [] },
  });

  const loadProgress = useCallback(async () => {
    const result = await getOnboardingProgressAction();
    if (result.success && result.data) {
      const progress = result.data as { step?: number; data?: Partial<OnboardingState> };
      if (progress.step) setStep(progress.step);
      const saved = progress.data;
      if (saved) {
        setData((prev) => ({
          ...prev,
          ...saved,
          goals: saved.goals ?? prev.goals,
          skills: { ...prev.skills, ...saved.skills },
          preferences: { ...prev.preferences, ...saved.preferences },
        }));
      }
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const progressPercent = (step / ONBOARDING_STEPS.length) * 100;

  async function autosave(nextStep: number, payload: Record<string, unknown>) {
    setSaving(true);
    await saveOnboardingStepAction(nextStep, payload);
    setSaving(false);
  }

  async function goNext(payload: Record<string, unknown> = {}) {
    const merged = { ...data, ...payload };
    setData(merged as OnboardingState);
    const next = Math.min(step + 1, 8);
    await autosave(next, merged);
    setStep(next);
  }

  async function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleComplete() {
    setCompleting(true);
    const result = await completeOnboardingAction();
    setCompleting(false);
    if (result.success) {
      toast({ title: "You're all set!", description: "Welcome to The Tech Guy LMS." });
      router.push("/dashboard");
      router.refresh();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  }

  function toggleGoal(goal: string) {
    setData((d) => ({
      ...d,
      goals: d.goals.includes(goal) ? d.goals.filter((g) => g !== goal) : [...d.goals, goal],
    }));
  }

  function toggleTopic(topic: string) {
    setData((d) => ({
      ...d,
      preferences: {
        ...d.preferences,
        topics: d.preferences.topics.includes(topic)
          ? d.preferences.topics.filter((t) => t !== topic)
          : [...d.preferences.topics, topic],
      },
    }));
  }

  const currentStepMeta = ONBOARDING_STEPS[step - 1];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {step} of {ONBOARDING_STEPS.length}
          </span>
          <span className="text-muted-foreground">{currentStepMeta?.title}</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
        >
          {step === 1 && (
            <Card className="border-border/60 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Welcome to The Tech Guy LMS</CardTitle>
                <CardDescription className="text-base">
                  Let&apos;s personalize your learning journey in just a few minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
                <p>We&apos;ll ask about your goals, experience, and preferences to build a custom roadmap.</p>
                <ul className="mx-auto max-w-xs space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Personalized course recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Custom learning roadmap
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    AI-powered study assistant
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Choose your role
                </CardTitle>
                <CardDescription>How will you primarily use the platform?</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {(["student", "instructor", "mentor"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, role }))}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50",
                      data.role === role ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <p className="font-semibold capitalize">{role}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {role === "student" && "Learn courses, earn certificates, grow your career"}
                      {role === "instructor" && "Create and teach courses, manage students"}
                      {role === "mentor" && "Guide learners, host sessions, share expertise"}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Your goals
                </CardTitle>
                <CardDescription>Select all that apply</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {GOALS.map((goal) => (
                  <label
                    key={goal}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      data.goals.includes(goal) ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    )}
                  >
                    <Checkbox checked={data.goals.includes(goal)} onCheckedChange={() => toggleGoal(goal)} />
                    <span className="text-sm font-medium">{goal}</span>
                  </label>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <CardTitle>Your experience level</CardTitle>
                <CardDescription>Help us match content to your background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {EXPERIENCE_LEVELS.map((level) => (
                  <label
                    key={level.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all",
                      data.experience === level.value ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <input
                      type="radio"
                      name="experience"
                      className="h-4 w-4 accent-primary"
                      checked={data.experience === level.value}
                      onChange={() => setData((d) => ({ ...d, experience: level.value }))}
                    />
                    <div>
                      <p className="font-medium">{level.label}</p>
                      <p className="text-sm text-muted-foreground">{level.desc}</p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 5 && (
            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  Skills assessment
                </CardTitle>
                <CardDescription>Rate your confidence (1–10) in each area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {SKILL_AREAS.map((skill) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Label>{skill}</Label>
                      <span className="font-semibold text-primary">{data.skills[skill] ?? 5}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={data.skills[skill] ?? 5}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          skills: { ...d.skills, [skill]: Number(e.target.value) },
                        }))
                      }
                      className="h-2 w-full cursor-pointer accent-primary"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 6 && (
            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <CardTitle>Learning preferences</CardTitle>
                <CardDescription>Customize how you learn best</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Learning style</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {LEARNING_STYLES.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            preferences: { ...d.preferences, learningStyle: style.value },
                          }))
                        }
                        className={cn(
                          "rounded-lg border p-3 text-left text-sm",
                          data.preferences.learningStyle === style.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        )}
                      >
                        <p className="font-medium">{style.label}</p>
                        <p className="text-muted-foreground">{style.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block">Learning pace</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {PACE_OPTIONS.map((pace) => (
                      <button
                        key={pace.value}
                        type="button"
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            preferences: { ...d.preferences, pace: pace.value },
                          }))
                        }
                        className={cn(
                          "rounded-lg border p-3 text-center text-sm",
                          data.preferences.pace === pace.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        )}
                      >
                        <p className="font-medium">{pace.label}</p>
                        <p className="text-xs text-muted-foreground">{pace.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block">Topics of interest</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Web Dev", "Data Science", "Cloud", "Mobile", "Security", "AI/ML", "Design"].map(
                      (topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-sm transition-colors",
                            data.preferences.topics.includes(topic)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:bg-muted"
                          )}
                        >
                          {topic}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 7 && (
            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Your learning roadmap
                </CardTitle>
                <CardDescription>
                  Generated based on your goals, experience, and skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_ROADMAP.phases.map((phase, i) => (
                  <div key={phase.name} className="relative flex gap-4">
                    {i < MOCK_ROADMAP.phases.length - 1 && (
                      <div className="absolute left-[15px] top-8 h-full w-0.5 bg-border" />
                    )}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold">{phase.name}</p>
                      <p className="text-xs text-muted-foreground">Weeks {phase.weeks}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {phase.topics.map((t) => (
                          <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 8 && (
            <Card className="border-border/60 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <Sparkles className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl">You&apos;re ready to learn!</CardTitle>
                <CardDescription>
                  Your personalized dashboard and roadmap are waiting for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                <p>Role: <span className="font-medium capitalize text-foreground">{data.role ?? "student"}</span></p>
                <p className="mt-1">{data.goals.length} goals selected · {data.preferences.topics.length} topics</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={goBack} disabled={step === 1 || saving}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {step < 8 ? (
            <Button
              className="gradient-primary border-0 text-white"
              onClick={() => goNext()}
              disabled={
                saving ||
                (step === 2 && !data.role) ||
                (step === 3 && data.goals.length === 0) ||
                (step === 4 && !data.experience)
              }
            >
              Continue
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="gradient-primary border-0 text-white"
              onClick={handleComplete}
              disabled={completing}
            >
              {completing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
