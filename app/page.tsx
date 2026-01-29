"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("60");
  const [maxViews, setMaxViews] = useState("5");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // ✅ NEW
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setShareUrl(null);
    setCopied(false);

    const body: any = { content };
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
      setShareUrl(data.url);
      setContent("");
    } else {
      alert(data.error || "Something went wrong");
    }
  }

  // ✅ NEW
  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "monospace",
        padding: "2rem",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            marginBottom: "1rem",
          }}
        />

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label>TTL (seconds)</label>
            <input
              type="number"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label>Max views</label>
            <input
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#fff",
            color: "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {shareUrl && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#111",
            border: "1px solid #333",
          }}
        >
          <p>✅ Paste created</p>

          <input
            readOnly
            value={shareUrl}
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "#000",
              color: "#0f0",
              border: "1px solid #333",
            }}
          />

          <button
            onClick={handleCopy}
            style={{
              marginTop: "0.5rem",
              background: "#222",
              color: "#fff",
              border: "1px solid #333",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
            }}
          >
            Copy link
          </button>

          {/* ✅ NEW MESSAGE */}
          {copied && (
            <p style={{ marginTop: "0.4rem", color: "#0f0" }}>
              Copied to clipboard ✓
            </p>
          )}
        </div>
      )}
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100px",
  padding: "0.4rem",
  background: "#111",
  color: "#fff",
  border: "1px solid #333",
};
