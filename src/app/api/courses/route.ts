import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { CourseRepository } from "@/lib/repositories";
import { handleError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const slug = searchParams.get("slug");

    const repo = new CourseRepository();

    if (slug) {
      const course = await repo.findBySlug(slug);
      return NextResponse.json({ success: true, data: course });
    }

    const courses = await repo.findPublished(page, 12, categoryId);
    return NextResponse.json({ success: true, ...courses });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["instructor", "admin"].includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const repo = new CourseRepository();

    const course = await repo.create({
      title: body.title,
      description: body.description,
      instructorId: session.id,
      organizationId: session.organizationId!,
      categoryId: body.categoryId,
      price: body.price,
      isFree: body.isFree,
      level: body.level,
    });

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}
