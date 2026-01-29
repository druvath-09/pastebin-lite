import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params; // ✅ unwrap params

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    notFound();
  }

  const now = Date.now();

  if (
    (paste.expiresAt && now > paste.expiresAt.getTime()) ||
    (paste.maxViews !== null && paste.views >= paste.maxViews)
  ) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <pre>{paste.content}</pre>
    </main>
  );
}
