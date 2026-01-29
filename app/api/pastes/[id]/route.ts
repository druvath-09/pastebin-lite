export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  if (paste.expiresAt && paste.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  await prisma.paste.update({
    where: { id },
    data: {
      views: { increment: 1 },
    },
  });

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
