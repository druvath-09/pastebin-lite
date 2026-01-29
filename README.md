# Pastebin Lite

A minimal Pastebin-like web application that allows users to store and share text content using a shareable link. Pastes can optionally expire based on time (TTL) or number of views.

This project was built as part of the **Aganitha Cognitive Solutions – Full Stack Developer Take Home Exercise (2026)**.

---

## 🚀 Features

- Create text pastes via API or UI
- Generate a unique, shareable link for each paste
- Optional expiration using:
  - Time-to-live (TTL in seconds)
  - Maximum number of views
- Automatic expiry handling
- Read-only public paste view
- Simple, minimal UI for creating and sharing pastes

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Hosting:** Vercel
- **Language:** TypeScript

---

## 📦 API Endpoints

### Create a Paste

**Request Body**
```json
{
  "content": "Hello World",
  "ttl_seconds": 60,
  "max_views": 3
}
```
### Response
```
{
  "id": "uuid",
  "url": "https://<deployment-url>/p/<id>"
}
```
### Fetch a Paste
```
GET /api/pastes/{id}

```
### Response
```
{
  "content": "Hello World",
  "remaining_views": 2,
  "expires_at": "2026-01-29T11:24:00.634Z"
}

```
Returns 404 if the paste is expired or does not exist.

### 🌐 Frontend Routes

## – Create a new paste
```
/p/{id} – View a paste in the browser
```

### 🗄️ Database Schema (Prisma)
```
model Paste {
  id         String   @id
  content    String
  createdAt DateTime @default(now())
  expiresAt DateTime?
  maxViews  Int?
  views     Int      @default(0)
}
```
## ⚙️ Environment Variables

Create the following environment variables:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_BASE_URL=https://your-vercel-url
```
## 🧠 Design Decisions
```
Prisma + Neon were chosen for type safety and serverless-friendly PostgreSQL.

force-dynamic API routes are used to prevent Next.js static optimization for database-backed endpoints.

Expiry logic is enforced on every read to ensure correctness.

The frontend paste view fetches data via API to keep a single source of truth.
```
## 🔮 Future Improvements

Authentication & private pastes

Rate limiting

Paste deletion

Syntax highlighting

Encryption at rest

UI enhancements

## 📎 Links

Live Demo: https://pastebin-lite-eight-steel.vercel.app/

GitHub Repo: https://github.com/druvath-09/pastebin-lite

## 👤 Author

Ganta Druvath Kumar
