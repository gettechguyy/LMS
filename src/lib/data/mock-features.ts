export const MOCK_COURSES = [
  {
    id: "1",
    slug: "full-stack-web-development",
    title: "Full-Stack Web Development",
    description: "Master React, Node.js, and modern deployment from zero to production.",
    thumbnail: null,
    level: "intermediate",
    duration_hours: 42,
    price: 0,
    is_free: true,
    tags: ["React", "Node.js", "TypeScript"],
    instructor: "Alex Rivera",
    rating: 4.9,
    students: 2840,
    lessons: 86,
  },
  {
    id: "2",
    slug: "python-data-science",
    title: "Python for Data Science",
    description: "Pandas, NumPy, visualization, and ML fundamentals for analysts.",
    thumbnail: null,
    level: "beginner",
    duration_hours: 28,
    price: 49,
    is_free: false,
    tags: ["Python", "Pandas", "ML"],
    instructor: "Sarah Chen",
    rating: 4.8,
    students: 1920,
    lessons: 54,
  },
  {
    id: "3",
    slug: "cloud-devops-aws",
    title: "Cloud & DevOps with AWS",
    description: "CI/CD, containers, infrastructure as code, and cloud architecture.",
    thumbnail: null,
    level: "advanced",
    duration_hours: 36,
    price: 79,
    is_free: false,
    tags: ["AWS", "Docker", "Terraform"],
    instructor: "Mike Johnson",
    rating: 4.7,
    students: 1560,
    lessons: 62,
  },
  {
    id: "4",
    slug: "ui-ux-design-systems",
    title: "UI/UX & Design Systems",
    description: "Figma workflows, accessibility, and building scalable design systems.",
    thumbnail: null,
    level: "beginner",
    duration_hours: 18,
    price: 0,
    is_free: true,
    tags: ["Figma", "UX", "Accessibility"],
    instructor: "Emma Wilson",
    rating: 4.9,
    students: 3210,
    lessons: 38,
  },
  {
    id: "5",
    slug: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals",
    description: "Ethical hacking, network security, and incident response basics.",
    thumbnail: null,
    level: "intermediate",
    duration_hours: 24,
    price: 59,
    is_free: false,
    tags: ["Security", "Networking", "Linux"],
    instructor: "James Park",
    rating: 4.6,
    students: 980,
    lessons: 45,
  },
  {
    id: "6",
    slug: "mobile-react-native",
    title: "Mobile Apps with React Native",
    description: "Build cross-platform apps with Expo, navigation, and native APIs.",
    thumbnail: null,
    level: "intermediate",
    duration_hours: 30,
    price: 69,
    is_free: false,
    tags: ["React Native", "Expo", "Mobile"],
    instructor: "Alex Rivera",
    rating: 4.8,
    students: 1340,
    lessons: 48,
  },
];

export const MOCK_LESSONS = [
  { id: "l1", title: "Introduction & Setup", duration: 12, completed: true, type: "video" as const },
  { id: "l2", title: "Project Structure Overview", duration: 18, completed: true, type: "video" as const },
  { id: "l3", title: "Core Concepts Deep Dive", duration: 24, completed: false, type: "video" as const, current: true },
  { id: "l4", title: "Hands-on Lab: First Feature", duration: 35, completed: false, type: "video" as const },
  { id: "l5", title: "Reading: Best Practices", duration: 10, completed: false, type: "reading" as const },
  { id: "l6", title: "Module Quiz", duration: 15, completed: false, type: "quiz" as const },
];

export const MOCK_LIVE_CLASSES = [
  { id: "1", title: "React Server Components Q&A", instructor: "Alex Rivera", date: "2026-06-02T18:00:00Z", duration: 60, attendees: 124, status: "upcoming" as const },
  { id: "2", title: "AWS Architecture Workshop", instructor: "Mike Johnson", date: "2026-06-04T20:00:00Z", duration: 90, attendees: 89, status: "upcoming" as const },
  { id: "3", title: "Career Panel: Breaking into Tech", instructor: "Sarah Chen", date: "2026-05-28T17:00:00Z", duration: 75, attendees: 210, status: "live" as const },
  { id: "4", title: "Python Data Viz Masterclass", instructor: "Emma Wilson", date: "2026-05-25T19:00:00Z", duration: 60, attendees: 156, status: "recorded" as const },
];

export const MOCK_ASSIGNMENTS = [
  { id: "1", title: "Build a REST API", course: "Full-Stack Web Development", dueDate: "2026-06-05T23:59:00Z", status: "pending" as const, points: 100 },
  { id: "2", title: "Data Analysis Report", course: "Python for Data Science", dueDate: "2026-06-08T23:59:00Z", status: "in_progress" as const, points: 80 },
  { id: "3", title: "Deploy to AWS", course: "Cloud & DevOps with AWS", dueDate: "2026-05-29T23:59:00Z", status: "submitted" as const, points: 120 },
  { id: "4", title: "Design System Components", course: "UI/UX & Design Systems", dueDate: "2026-06-12T23:59:00Z", status: "graded" as const, points: 90, grade: 92 },
];

export const MOCK_PROJECTS = [
  { id: "1", title: "E-Commerce Dashboard", description: "Real-time analytics dashboard with charts and filters.", tech: ["React", "TypeScript", "Recharts"], likes: 234, author: "Alex Rivera", image: "from-violet-500 to-purple-600" },
  { id: "2", title: "ML Price Predictor", description: "House price prediction model with interactive UI.", tech: ["Python", "scikit-learn", "Streamlit"], likes: 189, author: "Sarah Chen", image: "from-cyan-500 to-blue-600" },
  { id: "3", title: "DevOps Pipeline", description: "Full CI/CD pipeline with GitHub Actions and AWS.", tech: ["Terraform", "Docker", "AWS"], likes: 156, author: "Mike Johnson", image: "from-amber-500 to-orange-600" },
];

export const MOCK_COMMUNITY_POSTS = [
  { id: "1", author: "Alex Rivera", avatar: null, content: "Just completed the Full-Stack capstone! The deployment module was incredibly helpful. Who else is building with Next.js 15?", likes: 42, comments: 12, time: "2026-05-29T10:30:00Z", tags: ["nextjs", "capstone"] },
  { id: "2", author: "Sarah Chen", avatar: null, content: "Sharing my data viz cheat sheet for the Python course. Hope it helps fellow learners!", likes: 89, comments: 24, time: "2026-05-28T15:20:00Z", tags: ["python", "resources"] },
  { id: "3", author: "James Park", avatar: null, content: "Looking for study partners for the AWS certification prep. Drop a comment if interested!", likes: 31, comments: 18, time: "2026-05-27T09:00:00Z", tags: ["aws", "study-group"] },
];

export const MOCK_BADGES = [
  { id: "1", name: "First Steps", description: "Complete your first lesson", icon: "🎯", earned: true, date: "2026-05-10" },
  { id: "2", name: "Week Warrior", description: "7-day learning streak", icon: "🔥", earned: true, date: "2026-05-20" },
  { id: "3", name: "Course Crusher", description: "Complete 3 courses", icon: "🏆", earned: false },
  { id: "4", name: "Community Star", description: "50 helpful comments", icon: "⭐", earned: false },
  { id: "5", name: "Quiz Master", description: "Score 100% on 5 quizzes", icon: "🧠", earned: true, date: "2026-05-25" },
];

export const MOCK_MESSAGES = [
  { id: "1", name: "Alex Rivera", lastMessage: "Thanks for the help with the API!", time: "2026-05-29T14:30:00Z", unread: 2, online: true },
  { id: "2", name: "Sarah Chen", lastMessage: "Are you joining the live class tomorrow?", time: "2026-05-29T11:00:00Z", unread: 0, online: true },
  { id: "3", name: "Mike Johnson", lastMessage: "Check out the new DevOps resources", time: "2026-05-28T16:45:00Z", unread: 1, online: false },
  { id: "4", name: "Mentor Support", lastMessage: "Your roadmap has been updated", time: "2026-05-27T09:00:00Z", unread: 0, online: false },
];

export const MOCK_RESOURCES = [
  { id: "1", title: "React 19 Cheat Sheet", type: "PDF", size: "2.4 MB", category: "Web Dev", downloads: 1240 },
  { id: "2", title: "AWS Architecture Patterns", type: "Guide", size: "5.1 MB", category: "Cloud", downloads: 890 },
  { id: "3", title: "Python Data Science Templates", type: "ZIP", size: "12 MB", category: "Data Science", downloads: 2100 },
  { id: "4", title: "Interview Prep Workbook", type: "PDF", size: "3.8 MB", category: "Career", downloads: 3200 },
];

export const MOCK_ROADMAP = {
  phases: [
    { name: "Foundation", weeks: "1-4", topics: ["HTML/CSS", "JavaScript Basics", "Git & CLI"] },
    { name: "Frontend", weeks: "5-10", topics: ["React", "TypeScript", "State Management"] },
    { name: "Backend", weeks: "11-16", topics: ["Node.js", "APIs", "Databases"] },
    { name: "Capstone", weeks: "17-20", topics: ["Full-Stack Project", "Deployment", "Portfolio"] },
  ],
};
