-- PostgreSQL folds unquoted identifiers to lowercase (lms_users).
-- Rename existing tables to quoted identifiers so the LMS_ prefix is preserved.
-- Skip this migration on fresh installs where 001 already uses quoted names.

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'organizations', 'roles', 'permissions', 'role_permissions',
    'users', 'user_organizations', 'sessions', 'password_reset_tokens',
    'email_verification_tokens', 'onboarding_progress', 'categories', 'tags',
    'courses', 'course_tags', 'modules', 'lessons', 'course_enrollments',
    'lesson_progress', 'bookmarks', 'lesson_notes', 'certificates',
    'live_classes', 'live_attendance', 'quizzes', 'quiz_questions',
    'quiz_attempts', 'assignments', 'submissions', 'projects',
    'project_submissions', 'communities', 'posts', 'comments', 'reactions',
    'xp', 'badges', 'user_badges', 'levels', 'rewards', 'user_streaks',
    'resumes', 'job_applications', 'interviews', 'learning_roadmaps',
    'mentor_sessions', 'mentor_reviews', 'conversations',
    'conversation_participants', 'messages', 'notifications',
    'notification_preferences', 'ai_conversations', 'ai_recommendations',
    'audit_logs', 'subscriptions', 'payments', 'coupons', 'invoices',
    'api_keys', 'connected_accounts', 'support_tickets', 'system_settings'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF to_regclass('public.lms_' || t) IS NOT NULL
       AND to_regclass('public."LMS_' || t || '"') IS NULL THEN
      EXECUTE format('ALTER TABLE lms_%I RENAME TO %I', t, 'LMS_' || t);
    END IF;
  END LOOP;
END $$;
