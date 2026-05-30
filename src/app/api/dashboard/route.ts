import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { DashboardRepository, NotificationRepository } from "@/lib/repositories";
import { handleError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dashboardRepo = new DashboardRepository();
    const notificationRepo = new NotificationRepository();

    const [stats, activity, notifications] = await Promise.all([
      dashboardRepo.getStats(session.id),
      dashboardRepo.getRecentActivity(session.id),
      notificationRepo.getForUser(session.id, 10),
    ]);

    return NextResponse.json({
      success: true,
      data: { stats, activity, notifications, user: session },
    });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}
