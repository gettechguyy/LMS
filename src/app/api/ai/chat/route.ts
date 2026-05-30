import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { handleError } from "@/lib/errors";

type AIChatType =
  | "assistant"
  | "quiz_generator"
  | "roadmap"
  | "study_planner"
  | "feedback"
  | "interview_coach";

function generateAIResponse(message: string, type: AIChatType): string {
  const lower = message.toLowerCase();

  if (type === "quiz_generator") {
    if (lower.includes("javascript") || lower.includes("js")) {
      return "**JavaScript Quiz**\n\n1. What is the difference between `let` and `const`?\n2. Explain event bubbling vs capturing.\n3. What does `===` check that `==` does not?\n\nReply with your answers for instant feedback!";
    }
    return "**Quick Quiz**\n\n1. Define the core concept in one sentence.\n2. Give a real-world example.\n3. What is a common mistake beginners make?\n\nShare your answers!";
  }

  if (type === "roadmap") {
    return "**Personalized Roadmap**\n\n**Phase 1 (Weeks 1-4):** Foundations — core syntax, tooling, version control\n**Phase 2 (Weeks 5-10):** Applied skills — projects, APIs, testing\n**Phase 3 (Weeks 11-16):** Specialization — pick your track (web, data, cloud)\n**Phase 4 (Weeks 17-20):** Capstone + portfolio\n\nAdjust pace based on 10-15 hrs/week availability.";
  }

  if (type === "study_planner") {
    return "**Weekly Study Plan**\n\n| Day | Focus | Hours |\n|-----|-------|-------|\n| Mon | Video lessons + notes | 1.5h |\n| Tue | Hands-on lab | 2h |\n| Wed | Reading + flashcards | 1h |\n| Thu | Assignment work | 2h |\n| Fri | Review + quiz | 1h |\n| Sat | Project block | 3h |\n| Sun | Rest or catch-up | 0-1h |\n\nTotal: ~10-11 hours/week";
  }

  if (type === "feedback") {
    return "**Learning Feedback**\n\nStrengths: Consistent engagement, good quiz scores on fundamentals.\nImprove: Spend more time on practical labs before moving to advanced topics.\nNext step: Complete the current module assignment and schedule a mentor session for code review.";
  }

  if (type === "interview_coach") {
    if (lower.includes("system design")) {
      return "**System Design Tip:** Start with requirements (scale, latency, consistency), draw high-level boxes (client → API → DB), then deep-dive one component. Practice explaining trade-offs out loud.";
    }
    return "**Interview Coach:** Use STAR format for behavioral questions. For technical rounds, think aloud, clarify constraints, and write tests for your code. Want a mock question on your target role?";
  }

  // Default assistant
  if (lower.includes("react") || lower.includes("server component")) {
    return "React Server Components run on the server and stream HTML to the client, reducing bundle size. Use `'use client'` only when you need hooks, browser APIs, or event handlers.";
  }
  if (lower.includes("aws") || lower.includes("cloud")) {
    return "For AWS, start with IAM and VPC fundamentals, then EC2/S3, then serverless (Lambda) and IaC (CloudFormation/Terraform). Pair theory with the Cloud & DevOps course labs.";
  }
  if (lower.includes("debug") || lower.includes("error")) {
    return "Debugging checklist: reproduce consistently → check logs/Network tab → isolate with minimal repro → verify env vars and auth → add targeted logging. Share the exact error message for deeper help.";
  }
  if (lower.includes("python") || lower.includes("data")) {
    return "For data science in Python: master NumPy/Pandas, then visualization (Matplotlib/Seaborn), then scikit-learn basics. Jupyter notebooks in the course are great for practice.";
  }

  return "Great question! I recommend reviewing the matching module in your course catalog and trying a hands-on exercise. Add more context (topic, error message, or goal) and I can give a sharper answer.";
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const type: AIChatType = body.type ?? "assistant";
    const reply = generateAIResponse(message, type);

    return NextResponse.json({
      success: true,
      data: {
        role: "assistant",
        content: reply,
        type,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}
