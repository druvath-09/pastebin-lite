import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function PastePage({ params }: PageProps) {
  const res = await fetch(
    `http://localhost:3000/api/pastes/${params.id}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!res.ok) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <pre>{data.content}</pre>
      <p>Remaining views: {data.remaining_views}</p>
      <p>Expires at: {data.expires_at}</p>
    </main>
  );
}
