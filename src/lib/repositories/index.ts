import { createHash, randomBytes } from "crypto";
import { createSupabaseAdmin } from "@/lib/supabase/client";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  signAccessToken,
  signRefreshToken,
  getRefreshExpiryDays,
} from "@/lib/auth/jwt";
import { AppError, logError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import type { SessionUser, UserRole } from "@/types";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export class UserRepository {
  private supabase = createSupabaseAdmin();

  async findByEmail(email: string) {
    const { data, error } = await this.supabase
      .from("LMS_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();
    if (error && error.code !== "PGRST116") throw new AppError(error.message, 500);
    return data;
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("LMS_users")
      .select("id, email, first_name, last_name, avatar, role, status, is_email_verified, onboarding_completed, created_at")
      .eq("id", id)
      .single();
    if (error) throw new AppError("User not found", 404);
    return data;
  }

  async create(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }) {
    const existing = await this.findByEmail(input.email);
    if (existing) throw new AppError("Email already registered", 409);

    const passwordHash = await hashPassword(input.password);

    const { data: org } = await this.supabase
      .from("LMS_organizations")
      .select("id")
      .eq("slug", "tech-guy-academy")
      .single();

    const { data: user, error } = await this.supabase
      .from("LMS_users")
      .insert({
        email: input.email.toLowerCase(),
        password_hash: passwordHash,
        first_name: input.firstName,
        last_name: input.lastName,
        role: input.role ?? "student",
        status: "active",
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    if (org) {
      const { data: studentRole } = await this.supabase
        .from("LMS_roles")
        .select("id")
        .eq("slug", input.role ?? "student")
        .single();

      await this.supabase.from("LMS_user_organizations").insert({
        user_id: user.id,
        organization_id: org.id,
        role_id: studentRole?.id,
        is_default: true,
      });
    }

    await this.supabase.from("LMS_onboarding_progress").insert({
      user_id: user.id,
      current_step: 1,
      data: {},
    });

    await this.supabase.from("LMS_notification_preferences").insert({
      user_id: user.id,
    });

    await this.supabase.from("LMS_user_streaks").insert({
      user_id: user.id,
    });

    const verificationToken = generateToken();
    await this.supabase.from("LMS_email_verification_tokens").insert({
      user_id: user.id,
      token_hash: hashToken(verificationToken),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    return { user, verificationToken };
  }

  async authenticate(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new AppError("Invalid email or password", 401);

    if (user.status === "suspended") {
      throw new AppError("Account suspended. Contact support.", 403);
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) throw new AppError("Invalid email or password", 401);

    await this.supabase
      .from("LMS_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", user.id);

    return user;
  }

  async createSession(userId: string, userAgent?: string, ipAddress?: string) {
    const user = await this.findById(userId);
    const refreshToken = generateToken();
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(
      Date.now() + getRefreshExpiryDays() * 24 * 60 * 60 * 1000
    );

    const { data: orgMembership } = await this.supabase
      .from("LMS_user_organizations")
      .select("organization_id")
      .eq("user_id", userId)
      .eq("is_default", true)
      .single();

    await this.supabase.from("LMS_sessions").insert({
      user_id: userId,
      refresh_token_hash: refreshTokenHash,
      user_agent: userAgent,
      ip_address: ipAddress,
      expires_at: expiresAt.toISOString(),
    });

    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
      organizationId: orgMembership?.organization_id,
    });

    const signedRefreshToken = await signRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
      organizationId: orgMembership?.organization_id,
    });

    return {
      accessToken,
      refreshToken: signedRefreshToken,
      rawRefreshToken: refreshToken,
      user: this.toSessionUser(user, orgMembership?.organization_id),
    };
  }

  async revokeSession(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    await this.supabase
      .from("LMS_sessions")
      .update({ is_revoked: true })
      .eq("refresh_token_hash", tokenHash);
  }

  async revokeAllSessions(userId: string) {
    await this.supabase
      .from("LMS_sessions")
      .update({ is_revoked: true })
      .eq("user_id", userId);
  }

  async createPasswordResetToken(email: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const token = generateToken();
    await this.supabase.from("LMS_password_reset_tokens").insert({
      user_id: user.id,
      token_hash: hashToken(token),
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });

    return { user, token };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = hashToken(token);
    const { data: resetToken } = await this.supabase
      .from("LMS_password_reset_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (!resetToken) throw new AppError("Invalid or expired reset token", 400);

    const passwordHash = await hashPassword(newPassword);

    await this.supabase
      .from("LMS_users")
      .update({ password_hash: passwordHash })
      .eq("id", resetToken.user_id);

    await this.supabase
      .from("LMS_password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", resetToken.id);

    await this.revokeAllSessions(resetToken.user_id);
  }

  async verifyEmail(token: string) {
    const tokenHash = hashToken(token);
    const { data: verifyToken } = await this.supabase
      .from("LMS_email_verification_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .is("verified_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (!verifyToken) throw new AppError("Invalid or expired verification token", 400);

    await this.supabase
      .from("LMS_users")
      .update({ is_email_verified: true })
      .eq("id", verifyToken.user_id);

    await this.supabase
      .from("LMS_email_verification_tokens")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", verifyToken.id);
  }

  toSessionUser(user: Record<string, unknown>, organizationId?: string): SessionUser {
    return {
      id: user.id as string,
      email: user.email as string,
      firstName: user.first_name as string,
      lastName: user.last_name as string,
      avatar: user.avatar as string | null,
      role: user.role as UserRole,
      organizationId: organizationId ?? null,
      isEmailVerified: user.is_email_verified as boolean,
      onboardingCompleted: user.onboarding_completed as boolean,
    };
  }
}

export class CourseRepository {
  private supabase = createSupabaseAdmin();

  async findPublished(page = 1, pageSize = 12, categoryId?: string) {
    let query = this.supabase
      .from("LMS_courses")
      .select("*, LMS_categories(name, slug), LMS_users!LMS_courses_instructor_id_fkey(first_name, last_name, avatar)", { count: "exact" })
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (categoryId) query = query.eq("category_id", categoryId);

    const { data, error, count } = await query;
    if (error) throw new AppError(error.message, 500);

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    };
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("LMS_courses")
      .select(`
        *,
        LMS_categories(name, slug),
        LMS_users!LMS_courses_instructor_id_fkey(first_name, last_name, avatar),
        LMS_modules(id, title, description, sort_order, is_published,
          LMS_lessons(id, title, type, duration_minutes, sort_order, is_preview, is_published)
        )
      `)
      .eq("slug", slug)
      .single();

    if (error) throw new AppError("Course not found", 404);
    return data;
  }

  async create(input: {
    title: string;
    description?: string;
    instructorId: string;
    organizationId: string;
    categoryId?: string;
    price?: number;
    isFree?: boolean;
    level?: string;
  }) {
    const slug = slugify(input.title) + "-" + Date.now().toString(36);

    const { data, error } = await this.supabase
      .from("LMS_courses")
      .insert({
        title: input.title,
        slug,
        description: input.description,
        instructor_id: input.instructorId,
        organization_id: input.organizationId,
        category_id: input.categoryId,
        price: input.price ?? 0,
        is_free: input.isFree ?? true,
        level: input.level ?? "beginner",
        status: "draft",
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return data;
  }

  async enroll(courseId: string, userId: string) {
    const { data: existing } = await this.supabase
      .from("LMS_course_enrollments")
      .select("id")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .single();

    if (existing) return existing;

    const { data, error } = await this.supabase
      .from("LMS_course_enrollments")
      .insert({ course_id: courseId, user_id: userId })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return data;
  }

  async getUserEnrollments(userId: string) {
    const { data, error } = await this.supabase
      .from("LMS_course_enrollments")
      .select(`
        *,
        LMS_courses(id, title, slug, thumbnail, level, duration_hours, status,
          LMS_users!LMS_courses_instructor_id_fkey(first_name, last_name)
        )
      `)
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return data ?? [];
  }
}

export class OnboardingRepository {
  private supabase = createSupabaseAdmin();

  async getProgress(userId: string) {
    const { data, error } = await this.supabase
      .from("LMS_onboarding_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw new AppError(error.message, 500);
    return data;
  }

  async saveProgress(userId: string, step: number, stepData: Record<string, unknown>) {
    const existing = await this.getProgress(userId);
    const mergedData = { ...(existing?.data ?? {}), ...stepData };

    if (existing) {
      const { data, error } = await this.supabase
        .from("LMS_onboarding_progress")
        .update({ current_step: step, data: mergedData })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw new AppError(error.message, 500);
      return data;
    }

    const { data, error } = await this.supabase
      .from("LMS_onboarding_progress")
      .insert({ user_id: userId, current_step: step, data: mergedData })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return data;
  }

  async complete(userId: string) {
    await this.supabase
      .from("LMS_onboarding_progress")
      .update({ completed_at: new Date().toISOString(), current_step: 8 })
      .eq("user_id", userId);

    await this.supabase
      .from("LMS_users")
      .update({ onboarding_completed: true })
      .eq("id", userId);

    const progress = await this.getProgress(userId);
    const data = progress?.data as Record<string, unknown> ?? {};

    if (data.roadmap) {
      await this.supabase.from("LMS_learning_roadmaps").insert({
        user_id: userId,
        title: "My Learning Roadmap",
        description: "Personalized path based on your goals",
        milestones: data.roadmap,
        is_ai_generated: true,
      });
    }
  }
}

export class NotificationRepository {
  private supabase = createSupabaseAdmin();

  async getForUser(userId: string, limit = 20) {
    const { data, error } = await this.supabase
      .from("LMS_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new AppError(error.message, 500);
    return data ?? [];
  }

  async getUnreadCount(userId: string) {
    const { count, error } = await this.supabase
      .from("LMS_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw new AppError(error.message, 500);
    return count ?? 0;
  }

  async markAsRead(id: string, userId: string) {
    await this.supabase
      .from("LMS_notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId);
  }

  async markAllAsRead(userId: string) {
    await this.supabase
      .from("LMS_notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
  }

  async create(input: {
    userId: string;
    type: string;
    title: string;
    message?: string;
    link?: string;
  }) {
    await this.supabase.from("LMS_notifications").insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
    });
  }
}

export class DashboardRepository {
  private supabase = createSupabaseAdmin();

  async getStats(userId: string) {
    const [enrollments, xp, streak, notifications] = await Promise.all([
      this.supabase
        .from("LMS_course_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      this.supabase
        .from("LMS_xp")
        .select("amount")
        .eq("user_id", userId),
      this.supabase
        .from("LMS_user_streaks")
        .select("*")
        .eq("user_id", userId)
        .single(),
      this.supabase
        .from("LMS_notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false),
    ]);

    const totalXp = (xp.data ?? []).reduce((sum, x) => sum + x.amount, 0);

    return {
      enrolledCourses: enrollments.count ?? 0,
      totalXp,
      currentStreak: streak.data?.current_streak ?? 0,
      unreadNotifications: notifications.count ?? 0,
    };
  }

  async getRecentActivity(userId: string) {
    const { data: enrollments } = await this.supabase
      .from("LMS_course_enrollments")
      .select("*, LMS_courses(title, slug)")
      .eq("user_id", userId)
      .order("last_accessed_at", { ascending: false })
      .limit(5);

    const { data: xpEvents } = await this.supabase
      .from("LMS_xp")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    return { enrollments: enrollments ?? [], xpEvents: xpEvents ?? [] };
  }
}

export class AdminRepository {
  private supabase = createSupabaseAdmin();

  async listUsers(page = 1, pageSize = 20, search?: string, role?: string) {
    let query = this.supabase
      .from("LMS_users")
      .select("id, email, first_name, last_name, avatar, role, status, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }
    if (role) query = query.eq("role", role);

    const { data, error, count } = await query;
    if (error) throw new AppError(error.message, 500);

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    };
  }

  async getAnalytics() {
    const [
      users,
      courses,
      enrollments,
      payments,
      mentors,
      instructors,
    ] = await Promise.all([
      this.supabase.from("LMS_users").select("*", { count: "exact", head: true }),
      this.supabase.from("LMS_courses").select("*", { count: "exact", head: true }),
      this.supabase.from("LMS_course_enrollments").select("*", { count: "exact", head: true }),
      this.supabase
        .from("LMS_payments")
        .select("amount")
        .eq("status", "completed"),
      this.supabase
        .from("LMS_users")
        .select("*", { count: "exact", head: true })
        .eq("role", "mentor"),
      this.supabase
        .from("LMS_users")
        .select("*", { count: "exact", head: true })
        .eq("role", "instructor"),
    ]);

    const totalRevenue = (payments.data ?? []).reduce(
      (sum, p) => sum + Number(p.amount ?? 0),
      0
    );

    const { data: recentEnrollments } = await this.supabase
      .from("LMS_course_enrollments")
      .select("enrolled_at")
      .gte("enrolled_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    return {
      totalUsers: users.count ?? 0,
      totalCourses: courses.count ?? 0,
      totalEnrollments: enrollments.count ?? 0,
      totalRevenue,
      mentorCount: mentors.count ?? 0,
      instructorCount: instructors.count ?? 0,
      enrollmentsLast30Days: recentEnrollments?.length ?? 0,
    };
  }
}

export async function logAudit(
  userId: string | null,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>
) {
  try {
    const supabase = createSupabaseAdmin();
    await supabase.from("LMS_audit_logs").insert({
      user_id: userId,
      action,
      resource,
      resource_id: resourceId,
      details: details ?? {},
    });
  } catch (error) {
    logError("audit", error);
  }
}
