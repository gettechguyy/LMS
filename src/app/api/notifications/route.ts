import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { NotificationRepository } from "@/lib/repositories";
import { handleError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repo = new NotificationRepository();
    const [notifications, unreadCount] = await Promise.all([
      repo.getForUser(session.id, 50),
      repo.getUnreadCount(session.id),
    ]);

    return NextResponse.json({
      success: true,
      data: { notifications, unreadCount },
    });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const repo = new NotificationRepository();

    if (body.markAll) {
      await repo.markAllAsRead(session.id);
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (!body.id) {
      return NextResponse.json({ error: "Notification id required" }, { status: 400 });
    }

    await repo.markAsRead(body.id, session.id);
    return NextResponse.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}
