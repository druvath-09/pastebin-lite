export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

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
      { error: "Paste expired" },
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
      id: paste.id,
      content: paste.content,
      views: paste.views + 1,
    },
    { status: 200 }
  );
}
