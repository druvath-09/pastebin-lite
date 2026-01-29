export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ FIX: await params
  const { id } = await context.params;

  // 1️⃣ Fetch paste
  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  // 2️⃣ Not found
  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // 3️⃣ Expired by time
  if (paste.expiresAt && paste.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  // 4️⃣ Exceeded max views
  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  // 5️⃣ Increment views
  await prisma.paste.update({
    where: { id },
    data: {
      views: { increment: 1 },
    },
  });

  // 6️⃣ Return content
  return NextResponse.json(
  {
    content: paste.content,
    remaining_views:
      paste.maxViews === null
        ? null
        : paste.maxViews - (paste.views + 1),
    expires_at: paste.expiresAt,
  },
  { status: 200 }
);
}
