-- ============================================================================
-- The Tech Guy LMS - Seed Data
-- ============================================================================

-- Default Organization
INSERT INTO "LMS_organizations" (id, name, slug, description, plan) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'The Tech Guy Academy', 'tech-guy-academy', 'Official learning platform for tech professionals', 'enterprise');

-- System Roles
INSERT INTO "LMS_roles" (id, name, slug, description, is_system) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Student', 'student', 'Default learner role', TRUE),
  ('b0000000-0000-0000-0000-000000000002', 'Instructor', 'instructor', 'Course creator and teacher', TRUE),
  ('b0000000-0000-0000-0000-000000000003', 'Mentor', 'mentor', 'Career and interview mentor', TRUE),
  ('b0000000-0000-0000-0000-000000000004', 'Admin', 'admin', 'Platform administrator', TRUE);

-- Permissions
INSERT INTO "LMS_permissions" (id, name, slug, resource, action, description) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'View Courses', 'courses.view', 'courses', 'view', 'View published courses'),
  ('c0000000-0000-0000-0000-000000000002', 'Create Courses', 'courses.create', 'courses', 'create', 'Create new courses'),
  ('c0000000-0000-0000-0000-000000000003', 'Edit Courses', 'courses.edit', 'courses', 'edit', 'Edit own courses'),
  ('c0000000-0000-0000-0000-000000000004', 'Delete Courses', 'courses.delete', 'courses', 'delete', 'Delete own courses'),
  ('c0000000-0000-0000-0000-000000000005', 'Manage Users', 'users.manage', 'users', 'manage', 'Manage all users'),
  ('c0000000-0000-0000-0000-000000000006', 'View Analytics', 'analytics.view', 'analytics', 'view', 'View platform analytics'),
  ('c0000000-0000-0000-0000-000000000007', 'Manage Billing', 'billing.manage', 'billing', 'manage', 'Manage subscriptions and payments'),
  ('c0000000-0000-0000-0000-000000000008', 'Grade Assignments', 'assignments.grade', 'assignments', 'grade', 'Grade student submissions'),
  ('c0000000-0000-0000-0000-000000000009', 'Conduct Interviews', 'interviews.conduct', 'interviews', 'conduct', 'Conduct mock interviews'),
  ('c0000000-0000-0000-0000-000000000010', 'Manage Community', 'community.manage', 'community', 'manage', 'Moderate community posts');

-- Role Permissions
INSERT INTO "LMS_role_permissions" (role_id, permission_id) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003'),
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004'),
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000008'),
  ('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000009'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000006'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000007'),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000010');

-- Demo Users (password: Password123!)
-- bcrypt hash for 'Password123!'
INSERT INTO "LMS_users" (id, email, password_hash, first_name, last_name, role, status, is_email_verified, onboarding_completed) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'admin@techguylms.com', '$2a$12$TQakKnLfXCtXL6iBTQH5XeFYI2vxlIjKYuvOvSb6HeBE7rYXzAMrm', 'Admin', 'User', 'admin', 'active', TRUE, TRUE),
  ('d0000000-0000-0000-0000-000000000002', 'instructor@techguylms.com', '$2a$12$TQakKnLfXCtXL6iBTQH5XeFYI2vxlIjKYuvOvSb6HeBE7rYXzAMrm', 'Sarah', 'Chen', 'instructor', 'active', TRUE, TRUE),
  ('d0000000-0000-0000-0000-000000000003', 'mentor@techguylms.com', '$2a$12$TQakKnLfXCtXL6iBTQH5XeFYI2vxlIjKYuvOvSb6HeBE7rYXzAMrm', 'Michael', 'Rodriguez', 'mentor', 'active', TRUE, TRUE),
  ('d0000000-0000-0000-0000-000000000004', 'student@techguylms.com', '$2a$12$TQakKnLfXCtXL6iBTQH5XeFYI2vxlIjKYuvOvSb6HeBE7rYXzAMrm', 'Alex', 'Johnson', 'student', 'active', TRUE, TRUE);

-- User Organizations
INSERT INTO "LMS_user_organizations" (user_id, organization_id, role_id, is_default) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', TRUE),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', TRUE),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', TRUE),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', TRUE);

-- Categories
INSERT INTO "LMS_categories" (id, name, slug, description, icon) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Web Development', 'web-development', 'Frontend and backend web technologies', 'Globe'),
  ('e0000000-0000-0000-0000-000000000002', 'Data Science', 'data-science', 'Machine learning and data analysis', 'BarChart'),
  ('e0000000-0000-0000-0000-000000000003', 'DevOps', 'devops', 'CI/CD, cloud, and infrastructure', 'Cloud'),
  ('e0000000-0000-0000-0000-000000000004', 'Mobile Development', 'mobile-development', 'iOS and Android development', 'Smartphone'),
  ('e0000000-0000-0000-0000-000000000005', 'Career Development', 'career-development', 'Interview prep and career growth', 'Briefcase');

-- Tags
INSERT INTO "LMS_tags" (name, slug) VALUES
  ('JavaScript', 'javascript'), ('React', 'react'), ('Node.js', 'nodejs'),
  ('Python', 'python'), ('TypeScript', 'typescript'), ('AWS', 'aws'),
  ('Docker', 'docker'), ('SQL', 'sql'), ('Machine Learning', 'machine-learning');

-- Demo Courses
INSERT INTO "LMS_courses" (id, organization_id, instructor_id, title, slug, description, short_description, category_id, price, is_free, status, level, duration_hours, published_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'Full Stack Web Development', 'full-stack-web-development', 'Master modern web development from frontend to backend. Learn React, Node.js, databases, and deployment.', 'Build production-ready web applications', 'e0000000-0000-0000-0000-000000000001', 49.99, FALSE, 'published', 'intermediate', 40, NOW()),
  ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'React Masterclass', 'react-masterclass', 'Deep dive into React 19, hooks, server components, and advanced patterns.', 'Advanced React patterns and best practices', 'e0000000-0000-0000-0000-000000000001', 0, TRUE, 'published', 'advanced', 20, NOW()),
  ('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'Python for Data Science', 'python-data-science', 'Learn Python, pandas, numpy, and machine learning fundamentals.', 'Data analysis and ML with Python', 'e0000000-0000-0000-0000-000000000002', 39.99, FALSE, 'published', 'beginner', 30, NOW());

-- Course Modules & Lessons
INSERT INTO "LMS_modules" (id, course_id, title, sort_order, is_published) VALUES
  ('10000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Getting Started', 1, TRUE),
  ('10000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'Frontend Fundamentals', 2, TRUE),
  ('10000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 'Backend Development', 3, TRUE);

INSERT INTO "LMS_lessons" (module_id, title, type, content, duration_minutes, sort_order, is_preview, is_published) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Welcome to the Course', 'video', 'Introduction to full stack development', 10, 1, TRUE, TRUE),
  ('10000000-0000-0000-0000-000000000001', 'Setting Up Your Environment', 'reading', 'Install Node.js, VS Code, and essential tools', 15, 2, FALSE, TRUE),
  ('10000000-0000-0000-0000-000000000002', 'HTML & CSS Refresher', 'video', 'Modern HTML5 and CSS3 techniques', 25, 1, FALSE, TRUE),
  ('10000000-0000-0000-0000-000000000002', 'JavaScript ES6+', 'video', 'Modern JavaScript features and patterns', 45, 2, FALSE, TRUE),
  ('10000000-0000-0000-0000-000000000002', 'React Fundamentals', 'video', 'Components, props, state, and hooks', 60, 3, FALSE, TRUE),
  ('10000000-0000-0000-0000-000000000003', 'Node.js & Express', 'video', 'Building REST APIs with Express', 50, 1, FALSE, TRUE),
  ('10000000-0000-0000-0000-000000000003', 'Database Design', 'reading', 'PostgreSQL schema design and queries', 30, 2, FALSE, TRUE);

-- Enrollments
INSERT INTO "LMS_course_enrollments" (course_id, user_id, progress) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 35.5),
  ('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 10);

-- Gamification
INSERT INTO "LMS_levels" (level, name, xp_required, perks) VALUES
  (1, 'Novice', 0, '{"badge": "novice"}'),
  (2, 'Apprentice', 500, '{"badge": "apprentice"}'),
  (3, 'Developer', 1500, '{"badge": "developer"}'),
  (4, 'Expert', 5000, '{"badge": "expert"}'),
  (5, 'Master', 15000, '{"badge": "master"}');

INSERT INTO "LMS_badges" (name, slug, description, xp_reward) VALUES
  ('First Steps', 'first-steps', 'Complete your first lesson', 50),
  ('Course Completer', 'course-completer', 'Complete your first course', 200),
  ('Streak Master', 'streak-master', 'Maintain a 7-day learning streak', 100),
  ('Quiz Champion', 'quiz-champion', 'Score 100% on a quiz', 75),
  ('Community Star', 'community-star', 'Receive 10 likes on a post', 50);

INSERT INTO "LMS_xp" (user_id, amount, source, description) VALUES
  ('d0000000-0000-0000-0000-000000000004', 250, 'lesson_complete', 'Completed 5 lessons'),
  ('d0000000-0000-0000-0000-000000000004', 50, 'badge', 'Earned First Steps badge');

INSERT INTO "LMS_user_streaks" (user_id, current_streak, longest_streak, last_activity_date) VALUES
  ('d0000000-0000-0000-0000-000000000004', 5, 12, CURRENT_DATE);

-- Community
INSERT INTO "LMS_communities" (id, organization_id, name, slug, description) VALUES
  ('20000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'General Discussion', 'general', 'General tech discussions and questions');

INSERT INTO "LMS_posts" (community_id, author_id, title, content, type) VALUES
  ('20000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 'Tips for React Interview Prep', 'Here are my top tips for preparing for React interviews...', 'post'),
  ('20000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'New Course: React Masterclass', 'Excited to announce our new React Masterclass course!', 'announcement');

-- Notifications
INSERT INTO "LMS_notifications" (user_id, type, title, message, link) VALUES
  ('d0000000-0000-0000-0000-000000000004', 'course', 'New lesson available', 'React Fundamentals is now available in Full Stack Web Development', '/courses/full-stack-web-development'),
  ('d0000000-0000-0000-0000-000000000004', 'achievement', 'Badge earned!', 'You earned the First Steps badge', '/achievements'),
  ('d0000000-0000-0000-0000-000000000004', 'info', 'Welcome to The Tech Guy LMS', 'Start your learning journey today!', '/dashboard');

-- System Settings
INSERT INTO "LMS_system_settings" (key, value, description) VALUES
  ('platform_name', '"The Tech Guy LMS"', 'Platform display name'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('registration_enabled', 'true', 'Allow new user registrations'),
  ('default_plan', '"free"', 'Default subscription plan for new users');

-- Subscriptions
INSERT INTO "LMS_subscriptions" (user_id, organization_id, plan, status, billing_cycle, current_period_end) VALUES
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'pro', 'active', 'monthly', NOW() + INTERVAL '30 days');

-- Live Classes
INSERT INTO "LMS_live_classes" (organization_id, instructor_id, course_id, title, description, scheduled_at, duration_minutes, status) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'Live Q&A: React Hooks Deep Dive', 'Interactive session on advanced React hooks patterns', NOW() + INTERVAL '2 days', 90, 'scheduled');

-- Assignments
INSERT INTO "LMS_assignments" (course_id, title, description, instructions, due_date, max_score) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'Build a Todo App', 'Create a full-stack todo application', 'Use React for frontend and Node.js for backend. Include CRUD operations.', NOW() + INTERVAL '7 days', 100);
