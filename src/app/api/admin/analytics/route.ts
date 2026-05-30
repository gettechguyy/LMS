import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { AdminRepository } from "@/lib/repositories";
import { handleError } from "@/lib/errors";
import { MOCK_REVENUE_DATA, MOCK_USER_GROWTH } from "@/lib/data/mock-panels";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const repo = new AdminRepository();
    const stats = await repo.getAnalytics();

    return NextResponse.json({
      success: true,
      data: {
        stats,
        revenueChart: MOCK_REVENUE_DATA,
        userGrowth: MOCK_USER_GROWTH,
      },
    });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}
