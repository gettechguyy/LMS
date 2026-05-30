import type { UserRole } from "@/types";

export const MOCK_ADMIN_USERS = [
  { id: "1", email: "alex@techguy.com", first_name: "Alex", last_name: "Rivera", role: "instructor" as UserRole, status: "active", created_at: "2025-11-01T10:00:00Z" },
  { id: "2", email: "sarah@techguy.com", first_name: "Sarah", last_name: "Chen", role: "instructor" as UserRole, status: "active", created_at: "2025-11-05T10:00:00Z" },
  { id: "3", email: "james@techguy.com", first_name: "James", last_name: "Park", role: "mentor" as UserRole, status: "active", created_at: "2025-12-01T10:00:00Z" },
  { id: "4", email: "emma@techguy.com", first_name: "Emma", last_name: "Wilson", role: "student" as UserRole, status: "active", created_at: "2026-01-10T10:00:00Z" },
  { id: "5", email: "mike@techguy.com", first_name: "Mike", last_name: "Johnson", role: "student" as UserRole, status: "suspended", created_at: "2026-02-15T10:00:00Z" },
  { id: "6", email: "admin@techguy.com", first_name: "Admin", last_name: "User", role: "admin" as UserRole, status: "active", created_at: "2025-10-01T10:00:00Z" },
];

export const MOCK_REVENUE_DATA = [
  { month: "Jan", revenue: 12400, enrollments: 89 },
  { month: "Feb", revenue: 15800, enrollments: 112 },
  { month: "Mar", revenue: 18200, enrollments: 134 },
  { month: "Apr", revenue: 22100, enrollments: 156 },
  { month: "May", revenue: 26400, enrollments: 178 },
  { month: "Jun", revenue: 29800, enrollments: 201 },
];

export const MOCK_USER_GROWTH = [
  { month: "Jan", students: 420, instructors: 12, mentors: 8 },
  { month: "Feb", students: 510, instructors: 14, mentors: 9 },
  { month: "Mar", students: 680, instructors: 16, mentors: 11 },
  { month: "Apr", students: 820, instructors: 18, mentors: 12 },
  { month: "May", students: 1040, instructors: 22, mentors: 15 },
  { month: "Jun", students: 1280, instructors: 24, mentors: 18 },
];

export const MOCK_PLATFORM_ANALYTICS = {
  completionRate: 68,
  avgSessionMinutes: 42,
  courseViews: 45200,
  activeUsers7d: 892,
  topCourses: [
    { title: "Full-Stack Web Development", enrollments: 2840, revenue: 0 },
    { title: "Python for Data Science", enrollments: 1920, revenue: 94080 },
    { title: "Cloud & DevOps with AWS", enrollments: 1560, revenue: 123240 },
    { title: "UI/UX & Design Systems", enrollments: 3210, revenue: 0 },
  ],
  trafficBySource: [
    { source: "Organic", value: 42 },
    { source: "Referral", value: 28 },
    { source: "Social", value: 18 },
    { source: "Paid", value: 12 },
  ],
};

export const MOCK_INSTRUCTOR_COURSES = [
  { id: "1", title: "Full-Stack Web Development", slug: "full-stack-web-development", status: "published", students: 2840, completion: 72, revenue: 0 },
  { id: "2", title: "Mobile Apps with React Native", slug: "mobile-react-native", status: "published", students: 1340, completion: 65, revenue: 92460 },
  { id: "3", title: "Advanced TypeScript Patterns", slug: "advanced-typescript", status: "draft", students: 0, completion: 0, revenue: 0 },
];

export const MOCK_STUDENT_PROGRESS = [
  { id: "1", name: "Emma Wilson", course: "Full-Stack Web Development", progress: 85, lastActive: "2026-05-29" },
  { id: "2", name: "Mike Johnson", course: "Full-Stack Web Development", progress: 42, lastActive: "2026-05-28" },
  { id: "3", name: "Lisa Park", course: "Mobile Apps with React Native", progress: 91, lastActive: "2026-05-30" },
  { id: "4", name: "David Kim", course: "Mobile Apps with React Native", progress: 23, lastActive: "2026-05-27" },
];

export const MOCK_COURSE_ANALYTICS = [
  { week: "W1", views: 420, completions: 89, quizzes: 156 },
  { week: "W2", views: 380, completions: 102, quizzes: 178 },
  { week: "W3", views: 510, completions: 118, quizzes: 201 },
  { week: "W4", views: 490, completions: 134, quizzes: 189 },
];

export const MOCK_MENTOR_SESSIONS = [
  { id: "1", student: "Emma Wilson", topic: "Career roadmap review", scheduled_at: "2026-06-02T14:00:00Z", duration: 60, status: "scheduled" as const },
  { id: "2", student: "Mike Johnson", topic: "Portfolio feedback", scheduled_at: "2026-06-03T16:00:00Z", duration: 45, status: "scheduled" as const },
  { id: "3", student: "Lisa Park", topic: "Interview prep", scheduled_at: "2026-05-28T10:00:00Z", duration: 60, status: "completed" as const },
  { id: "4", student: "David Kim", topic: "Project code review", scheduled_at: "2026-05-30T18:00:00Z", duration: 30, status: "scheduled" as const },
];

export const MOCK_MENTOR_REVIEWS = [
  { id: "1", student: "Lisa Park", rating: 5, review: "Incredibly helpful session on system design interviews!", date: "2026-05-28" },
  { id: "2", student: "Emma Wilson", rating: 4, review: "Great feedback on my resume and LinkedIn profile.", date: "2026-05-25" },
  { id: "3", student: "James Lee", rating: 5, review: "Clear action items and follow-up resources.", date: "2026-05-20" },
];

export const MOCK_MENTOR_STUDENTS = [
  { id: "1", name: "Emma Wilson", email: "emma@example.com", sessions: 4, avgRating: 4.8, lastSession: "2026-05-25", feedback: "Strong progress on frontend skills" },
  { id: "2", name: "Mike Johnson", email: "mike@example.com", sessions: 2, avgRating: 4.5, lastSession: "2026-05-20", feedback: "Needs more practice with APIs" },
  { id: "3", name: "Lisa Park", email: "lisa@example.com", sessions: 6, avgRating: 5.0, lastSession: "2026-05-28", feedback: "Ready for senior roles" },
  { id: "4", name: "David Kim", email: "david@example.com", sessions: 1, avgRating: 4.0, lastSession: "2026-05-15", feedback: "Just started mentorship track" },
];
