export type UserRole = "student" | "instructor" | "mentor" | "admin";

export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export type SubscriptionPlan = "free" | "pro" | "enterprise";

export type CourseStatus = "draft" | "published" | "archived";

export type LessonType = "video" | "pdf" | "reading" | "embedded" | "quiz";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "course"
  | "assignment"
  | "message"
  | "achievement";

export interface LMSUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  is_email_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface LMSOrganization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  plan: SubscriptionPlan;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface LMSCourse {
  id: string;
  organization_id: string;
  instructor_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  trailer_url: string | null;
  category_id: string | null;
  price: number;
  is_free: boolean;
  status: CourseStatus;
  level: string;
  duration_hours: number;
  tags: string[];
  metadata: Record<string, unknown>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: UserRole;
  organizationId: string | null;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  type: "access" | "refresh";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OnboardingData {
  step: number;
  role?: UserRole;
  goals?: string[];
  experience?: string;
  skills?: Record<string, number>;
  preferences?: {
    learningStyle?: string;
    pace?: string;
    topics?: string[];
  };
  roadmap?: Record<string, unknown>;
}

export const ROLES: UserRole[] = ["student", "instructor", "mentor", "admin"];

export const ONBOARDING_STEPS = [
  { id: 1, title: "Welcome", description: "Get started with The Tech Guy LMS" },
  { id: 2, title: "Role Selection", description: "Choose your learning path" },
  { id: 3, title: "Goals", description: "What do you want to achieve?" },
  { id: 4, title: "Experience", description: "Tell us about your background" },
  { id: 5, title: "Skills Assessment", description: "Evaluate your current skills" },
  { id: 6, title: "Learning Preferences", description: "Customize your experience" },
  { id: 7, title: "Learning Roadmap", description: "Your personalized path" },
  { id: 8, title: "Complete", description: "Ready to start learning!" },
];

export const SIDEBAR_NAV = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Courses", href: "/courses", icon: "BookOpen" },
  { title: "Live Classes", href: "/live-classes", icon: "Video" },
  { title: "Assignments", href: "/assignments", icon: "ClipboardList" },
  { title: "Projects", href: "/projects", icon: "FolderKanban" },
  { title: "Career Center", href: "/career", icon: "Briefcase" },
  { title: "Community", href: "/community", icon: "Users" },
  { title: "Achievements", href: "/achievements", icon: "Trophy" },
  { title: "Messages", href: "/messages", icon: "MessageSquare" },
  { title: "Resources", href: "/resources", icon: "Library" },
  { title: "Settings", href: "/settings", icon: "Settings" },
];

export const ADMIN_NAV = [
  { title: "Admin", href: "/admin", icon: "Shield" },
];

export const INSTRUCTOR_NAV = [
  { title: "Instructor", href: "/instructor", icon: "GraduationCap" },
];

export const MENTOR_NAV = [
  { title: "Mentor", href: "/mentor", icon: "Users" },
];

export const SUBSCRIPTION_PLANS = {
  free: { name: "Free", price: 0, features: ["3 courses", "Community access", "Basic analytics"] },
  pro: { name: "Pro", price: 29, features: ["Unlimited courses", "Live classes", "Certificates", "AI assistant"] },
  enterprise: { name: "Enterprise", price: 99, features: ["Everything in Pro", "Custom branding", "SSO", "Dedicated support"] },
};
