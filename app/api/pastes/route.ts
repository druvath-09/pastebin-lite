export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { content, ttl_seconds, max_views } = body;

    // 🔴 Validation
    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be an integer >= 1" },
        { status: 400 }
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "max_views must be an integer >= 1" },
        { status: 400 }
      );
    }

    // 🔹 Generate paste ID
    const id = crypto.randomUUID();

    // 🔹 Calculate expiry
    let expiresAt: Date | null = null;
    if (ttl_seconds) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    // 🔹 Save to DB
    await prisma.paste.create({
      data: {
        id,
        content,
        expiresAt,
        maxViews: max_views ?? null,
      },
    });

    // 🔹 Build URL
    const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/p/${id}`;

    return NextResponse.json(
      { id, url },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
