import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;

  const res = await fetch(
    `http://localhost:3000/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <pre>{data.content}</pre>
    </main>
  );
}
