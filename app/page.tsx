"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("60");      // default TTL
  const [maxViews, setMaxViews] = useState("5"); // default max views
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body: any = {
      content,
    };

    // only include if value exists
    if (ttl) body.ttl_seconds = Number(ttl);
    if (maxViews) body.max_views = Number(maxViews);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      router.push(`/p/${data.id}`);
    } else {
      alert("Failed to create paste");
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace", maxWidth: 600 }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Paste content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{ width: "100%" }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>TTL (seconds)</label>
          <input
            type="number"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            placeholder="default 60"
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Max views</label>
          <input
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            placeholder="default 5"
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>
    </main>
  );
}
