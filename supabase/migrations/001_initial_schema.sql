-- ============================================================================
-- The Tech Guy LMS - Complete Database Schema
-- Supabase PostgreSQL with Row Level Security
-- Custom JWT Auth (NOT Supabase Auth)
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS CONTEXT
-- ============================================================================

CREATE OR REPLACE FUNCTION set_app_context(
  p_user_id UUID,
  p_organization_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', p_user_id::TEXT, TRUE);
  IF p_organization_id IS NOT NULL THEN
    PERFORM set_config('app.current_organization_id', p_organization_id::TEXT, TRUE);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_user_id() RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID;
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_current_organization_id() RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_organization_id', TRUE), '')::UUID;
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ORGANIZATIONS & PERMISSIONS (Multi-tenant)
-- ============================================================================

CREATE TABLE "LMS_organizations" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo TEXT,
  description TEXT,
  plan VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  settings JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_roles" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_permissions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_role_permissions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES "LMS_roles"(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES "LMS_permissions"(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE "LMS_users" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'mentor', 'admin')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_user_organizations" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES "LMS_organizations"(id) ON DELETE CASCADE,
  role_id UUID REFERENCES "LMS_roles"(id),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

CREATE TABLE "LMS_sessions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_password_reset_tokens" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_email_verification_tokens" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_onboarding_progress" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE UNIQUE,
  current_step INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- COURSES
-- ============================================================================

CREATE TABLE "LMS_categories" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  parent_id UUID REFERENCES "LMS_categories"(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_tags" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_courses" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES "LMS_organizations"(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES "LMS_users"(id),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  thumbnail TEXT,
  trailer_url TEXT,
  category_id UUID REFERENCES "LMS_categories"(id),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  level VARCHAR(50) DEFAULT 'beginner',
  duration_hours DECIMAL(6,2) DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

CREATE TABLE "LMS_course_tags" (
  course_id UUID NOT NULL REFERENCES "LMS_courses"(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES "LMS_tags"(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

CREATE TABLE "LMS_modules" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES "LMS_courses"(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_lessons" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES "LMS_modules"(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'video' CHECK (type IN ('video', 'pdf', 'reading', 'embedded', 'quiz')),
  content TEXT,
  video_url TEXT,
  pdf_url TEXT,
  embedded_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  transcript TEXT,
  resources JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_course_enrollments" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES "LMS_courses"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

CREATE TABLE "LMS_lesson_progress" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES "LMS_lessons"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  watch_time_seconds INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  last_position_seconds INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lesson_id, user_id)
);

CREATE TABLE "LMS_bookmarks" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES "LMS_lessons"(id) ON DELETE CASCADE,
  timestamp_seconds INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id, timestamp_seconds)
);

CREATE TABLE "LMS_lesson_notes" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES "LMS_lessons"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_certificates" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES "LMS_courses"(id) ON DELETE CASCADE,
  verification_code VARCHAR(50) NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pdf_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  UNIQUE(user_id, course_id)
);

-- ============================================================================
-- LIVE CLASSES
-- ============================================================================

CREATE TABLE "LMS_live_classes" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES "LMS_organizations"(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES "LMS_users"(id),
  course_id UUID REFERENCES "LMS_courses"(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  meeting_url TEXT,
  recording_url TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  max_attendees INTEGER,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_live_attendance" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  live_class_id UUID NOT NULL REFERENCES "LMS_live_classes"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 0,
  UNIQUE(live_class_id, user_id)
);

-- ============================================================================
-- QUIZZES
-- ============================================================================

CREATE TABLE "LMS_quizzes" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES "LMS_lessons"(id) ON DELETE CASCADE,
  course_id UUID REFERENCES "LMS_courses"(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER,
  passing_score DECIMAL(5,2) NOT NULL DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_quiz_questions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES "LMS_quizzes"(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'mcq' CHECK (type IN ('mcq', 'multiple_answer', 'coding', 'true_false')),
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer JSONB NOT NULL DEFAULT '[]',
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_quiz_attempts" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES "LMS_quizzes"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  score DECIMAL(5,2),
  is_passed BOOLEAN,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_taken_seconds INTEGER
);

-- ============================================================================
-- ASSIGNMENTS & PROJECTS
-- ============================================================================

CREATE TABLE "LMS_assignments" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES "LMS_courses"(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  instructions TEXT,
  due_date TIMESTAMPTZ,
  max_score DECIMAL(5,2) NOT NULL DEFAULT 100,
  rubric JSONB NOT NULL DEFAULT '{}',
  allow_late BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_submissions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES "LMS_assignments"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  score DECIMAL(5,2),
  feedback TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'revision_requested')),
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_projects" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES "LMS_courses"(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  technologies TEXT[],
  github_url TEXT,
  demo_url TEXT,
  thumbnail TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_project_submissions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES "LMS_projects"(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES "LMS_users"(id),
  score DECIMAL(5,2),
  feedback TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- COMMUNITY
-- ============================================================================

CREATE TABLE "LMS_communities" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES "LMS_organizations"(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  avatar TEXT,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  member_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

CREATE TABLE "LMS_posts" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES "LMS_communities"(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  title VARCHAR(500),
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'post' CHECK (type IN ('post', 'announcement', 'question')),
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_comments" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES "LMS_posts"(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES "LMS_comments"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_reactions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  post_id UUID REFERENCES "LMS_posts"(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES "LMS_comments"(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'like' CHECK (type IN ('like', 'love', 'celebrate', 'insightful')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL)
);

-- ============================================================================
-- GAMIFICATION
-- ============================================================================

CREATE TABLE "LMS_xp" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL DEFAULT 0,
  source VARCHAR(100) NOT NULL,
  source_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_badges" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  criteria JSONB NOT NULL DEFAULT '{}',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_user_badges" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES "LMS_badges"(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE "LMS_levels" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level INTEGER NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  xp_required INTEGER NOT NULL,
  perks JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_rewards" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  xp_cost INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_user_streaks" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- CAREER CENTER
-- ============================================================================

CREATE TABLE "LMS_resumes" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
  content JSONB NOT NULL DEFAULT '{}',
  is_primary BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_job_applications" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'offered', 'rejected', 'accepted')),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_interviews" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES "LMS_users"(id),
  type VARCHAR(50) NOT NULL DEFAULT 'mock' CHECK (type IN ('mock', 'technical', 'behavioral', 'system_design')),
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  feedback JSONB NOT NULL DEFAULT '{}',
  score DECIMAL(5,2),
  recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_learning_roadmaps" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  milestones JSONB NOT NULL DEFAULT '[]',
  progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MENTOR FEATURES
-- ============================================================================

CREATE TABLE "LMS_mentor_sessions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  meeting_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_mentor_reviews" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES "LMS_mentor_sessions"(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MESSAGING
-- ============================================================================

CREATE TABLE "LMS_conversations" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  name VARCHAR(255),
  created_by UUID REFERENCES "LMS_users"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_conversation_participants" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES "LMS_conversations"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE "LMS_messages" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES "LMS_conversations"(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE "LMS_notifications" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  title VARCHAR(500) NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_notification_preferences" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  preferences JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- AI FEATURES
-- ============================================================================

CREATE TABLE "LMS_ai_conversations" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'assistant' CHECK (type IN ('assistant', 'quiz_generator', 'roadmap', 'study_planner', 'feedback', 'interview_coach')),
  title VARCHAR(500),
  messages JSONB NOT NULL DEFAULT '[]',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_ai_recommendations" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ADMIN & BILLING
-- ============================================================================

CREATE TABLE "LMS_audit_logs" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES "LMS_users"(id),
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  resource_id UUID,
  details JSONB NOT NULL DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_subscriptions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES "LMS_organizations"(id),
  plan VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  billing_cycle VARCHAR(50) NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_payments" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES "LMS_subscriptions"(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_coupons" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_percent DECIMAL(5,2),
  discount_amount DECIMAL(10,2),
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_invoices" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES "LMS_subscriptions"(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  invoice_number VARCHAR(100) NOT NULL UNIQUE,
  pdf_url TEXT,
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_api_keys" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_connected_accounts" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE TABLE "LMS_support_tickets" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "LMS_users"(id) ON DELETE CASCADE,
  subject VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES "LMS_users"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "LMS_system_settings" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_users_email ON "LMS_users"(email);
CREATE INDEX idx_users_role ON "LMS_users"(role);
CREATE INDEX idx_users_status ON "LMS_users"(status);
CREATE INDEX idx_sessions_user ON "LMS_sessions"(user_id);
CREATE INDEX idx_sessions_expires ON "LMS_sessions"(expires_at);
CREATE INDEX idx_courses_org ON "LMS_courses"(organization_id);
CREATE INDEX idx_courses_instructor ON "LMS_courses"(instructor_id);
CREATE INDEX idx_courses_status ON "LMS_courses"(status);
CREATE INDEX idx_courses_slug ON "LMS_courses"(slug);
CREATE INDEX idx_modules_course ON "LMS_modules"(course_id);
CREATE INDEX idx_lessons_module ON "LMS_lessons"(module_id);
CREATE INDEX idx_enrollments_user ON "LMS_course_enrollments"(user_id);
CREATE INDEX idx_enrollments_course ON "LMS_course_enrollments"(course_id);
CREATE INDEX idx_lesson_progress_user ON "LMS_lesson_progress"(user_id);
CREATE INDEX idx_notifications_user ON "LMS_notifications"(user_id, is_read);
CREATE INDEX idx_messages_conversation ON "LMS_messages"(conversation_id, created_at);
CREATE INDEX idx_posts_community ON "LMS_posts"(community_id, created_at);
CREATE INDEX idx_xp_user ON "LMS_xp"(user_id);
CREATE INDEX idx_audit_logs_user ON "LMS_audit_logs"(user_id);
CREATE INDEX idx_audit_logs_created ON "LMS_audit_logs"(created_at);
CREATE INDEX idx_live_classes_scheduled ON "LMS_live_classes"(scheduled_at);
CREATE INDEX idx_subscriptions_user ON "LMS_subscriptions"(user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER trg_organizations_updated BEFORE UPDATE ON "LMS_organizations" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON "LMS_users" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_onboarding_updated BEFORE UPDATE ON "LMS_onboarding_progress" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON "LMS_courses" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_modules_updated BEFORE UPDATE ON "LMS_modules" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_lessons_updated BEFORE UPDATE ON "LMS_lessons" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_assignments_updated BEFORE UPDATE ON "LMS_assignments" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_submissions_updated BEFORE UPDATE ON "LMS_submissions" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON "LMS_projects" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_communities_updated BEFORE UPDATE ON "LMS_communities" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON "LMS_posts" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_comments_updated BEFORE UPDATE ON "LMS_comments" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_conversations_updated BEFORE UPDATE ON "LMS_conversations" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_messages_updated BEFORE UPDATE ON "LMS_messages" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_subscriptions_updated BEFORE UPDATE ON "LMS_subscriptions" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_support_tickets_updated BEFORE UPDATE ON "LMS_support_tickets" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_resumes_updated BEFORE UPDATE ON "LMS_resumes" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_job_applications_updated BEFORE UPDATE ON "LMS_job_applications" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_interviews_updated BEFORE UPDATE ON "LMS_interviews" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_learning_roadmaps_updated BEFORE UPDATE ON "LMS_learning_roadmaps" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ai_conversations_updated BEFORE UPDATE ON "LMS_ai_conversations" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_live_classes_updated BEFORE UPDATE ON "LMS_live_classes" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quizzes_updated BEFORE UPDATE ON "LMS_quizzes" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_lesson_notes_updated BEFORE UPDATE ON "LMS_lesson_notes" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_notification_prefs_updated BEFORE UPDATE ON "LMS_notification_preferences" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE "LMS_users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_course_enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_onboarding_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_lesson_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LMS_ai_conversations" ENABLE ROW LEVEL SECURITY;

-- Users: read own profile, admins read all
CREATE POLICY users_select_own ON "LMS_users" FOR SELECT USING (
  id = get_current_user_id() OR
  EXISTS (SELECT 1 FROM "LMS_users" WHERE id = get_current_user_id() AND role = 'admin')
);

CREATE POLICY users_update_own ON "LMS_users" FOR UPDATE USING (
  id = get_current_user_id()
);

-- Courses: published visible to all authenticated, drafts to instructor/admin
CREATE POLICY courses_select ON "LMS_courses" FOR SELECT USING (
  status = 'published' OR
  instructor_id = get_current_user_id() OR
  EXISTS (SELECT 1 FROM "LMS_users" WHERE id = get_current_user_id() AND role IN ('admin', 'instructor'))
);

CREATE POLICY courses_insert ON "LMS_courses" FOR INSERT WITH CHECK (
  instructor_id = get_current_user_id() OR
  EXISTS (SELECT 1 FROM "LMS_users" WHERE id = get_current_user_id() AND role = 'admin')
);

CREATE POLICY courses_update ON "LMS_courses" FOR UPDATE USING (
  instructor_id = get_current_user_id() OR
  EXISTS (SELECT 1 FROM "LMS_users" WHERE id = get_current_user_id() AND role = 'admin')
);

-- Enrollments: users see own enrollments
CREATE POLICY enrollments_select ON "LMS_course_enrollments" FOR SELECT USING (
  user_id = get_current_user_id() OR
  EXISTS (SELECT 1 FROM "LMS_courses" c WHERE c.id = course_id AND c.instructor_id = get_current_user_id())
);

CREATE POLICY enrollments_insert ON "LMS_course_enrollments" FOR INSERT WITH CHECK (
  user_id = get_current_user_id()
);

-- Notifications: own only
CREATE POLICY notifications_select ON "LMS_notifications" FOR SELECT USING (
  user_id = get_current_user_id()
);

CREATE POLICY notifications_update ON "LMS_notifications" FOR UPDATE USING (
  user_id = get_current_user_id()
);

-- Messages: participants only
CREATE POLICY messages_select ON "LMS_messages" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "LMS_conversation_participants" cp
    WHERE cp.conversation_id = "LMS_messages".conversation_id
    AND cp.user_id = get_current_user_id()
  )
);

CREATE POLICY messages_insert ON "LMS_messages" FOR INSERT WITH CHECK (
  sender_id = get_current_user_id()
);

-- Onboarding: own only
CREATE POLICY onboarding_select ON "LMS_onboarding_progress" FOR SELECT USING (
  user_id = get_current_user_id()
);

CREATE POLICY onboarding_update ON "LMS_onboarding_progress" FOR UPDATE USING (
  user_id = get_current_user_id()
);

CREATE POLICY onboarding_insert ON "LMS_onboarding_progress" FOR INSERT WITH CHECK (
  user_id = get_current_user_id()
);

-- Lesson progress: own only
CREATE POLICY lesson_progress_all ON "LMS_lesson_progress" FOR ALL USING (
  user_id = get_current_user_id()
);

-- Submissions: own or instructor
CREATE POLICY submissions_select ON "LMS_submissions" FOR SELECT USING (
  user_id = get_current_user_id() OR
  EXISTS (
    SELECT 1 FROM "LMS_assignments" a
    JOIN "LMS_courses" c ON c.id = a.course_id
    WHERE a.id = assignment_id AND c.instructor_id = get_current_user_id()
  )
);

-- Posts: community members
CREATE POLICY posts_select ON "LMS_posts" FOR SELECT USING (TRUE);

CREATE POLICY posts_insert ON "LMS_posts" FOR INSERT WITH CHECK (
  author_id = get_current_user_id()
);

-- AI conversations: own only
CREATE POLICY ai_conversations_all ON "LMS_ai_conversations" FOR ALL USING (
  user_id = get_current_user_id()
);

-- Service role bypasses RLS by default in Supabase
