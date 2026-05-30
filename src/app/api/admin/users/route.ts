import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { AdminRepository } from "@/lib/repositories";
import { handleError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
    const search = searchParams.get("search") ?? undefined;
    const role = searchParams.get("role") ?? undefined;

    const repo = new AdminRepository();
    const result = await repo.listUsers(page, pageSize, search, role);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}
