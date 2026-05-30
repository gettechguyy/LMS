import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { CourseRepository, NotificationRepository, logAudit } from "@/lib/repositories";
import { handleError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const courseRepo = new CourseRepository();
    const enrollment = await courseRepo.enroll(body.courseId, session.id);

    const notificationRepo = new NotificationRepository();
    await notificationRepo.create({
      userId: session.id,
      type: "course",
      title: "Enrollment successful",
      message: "You have been enrolled in the course. Start learning now!",
      link: body.courseSlug ? `/courses/${body.courseSlug}/learn` : "/courses",
    });

    await logAudit(session.id, "enroll", "course", body.courseId);

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}
