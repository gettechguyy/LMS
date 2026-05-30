import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const onboardingSchema = z.object({
  step: z.number().min(1).max(8),
  data: z.record(z.unknown()).optional(),
});

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(500),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  categoryId: z.string().uuid().optional(),
  price: z.number().min(0).default(0),
  isFree: z.boolean().default(true),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  tags: z.array(z.string()).optional(),
});

export const moduleSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const lessonSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  type: z.enum(["video", "pdf", "reading", "embedded", "quiz"]).default("video"),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  durationMinutes: z.number().int().min(0).default(0),
  sortOrder: z.number().int().min(0).default(0),
});

export const profileSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  avatar: z.string().url().optional().or(z.literal("")),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
