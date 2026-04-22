# Story 2.1: Create /api/subscribe Endpoint (TanStack Start Server Function + KV)

**Epic:** Epic 2 - Email Capture & Notifications (FR-6)
**Size:** M
**Priority:** Must
**Dependencies:** 2.4 (KV namespace setup)
**Status:** done

---

## Description

Implement a TanStack Start server function that accepts email addresses, validates them, and stores them in Cloudflare KV under the SUBSCRIBERS namespace. This replaces the PRD's reference to "Next.js API route" with the TanStack Start equivalent using `createServerFn`.

---

## Acceptance Criteria

- [ ] Server function accepts `{ email, source, webinar_notify }` input
- [ ] Email is validated server-side (format check, not empty, max length 254)
- [ ] Duplicate emails are handled gracefully (upsert, return success)
- [ ] Subscriber data stored in KV: key = email (lowercased), value = `{ subscribed_at, source, webinar_notify }`
- [ ] Returns success response on valid input
- [ ] Returns validation error on invalid input with descriptive message
- [ ] Rate limiting: basic protection against abuse (e.g., max 5 requests per IP per minute)
- [ ] Input sanitization applied to prevent injection (NFR-4.4)

---

## Tasks

### Task 1: Create subscribe server function
- Use `createServerFn` from `@tanstack/react-start`
- Define typed input schema (email, source, webinar_notify)
- Validate email format server-side
- Access SUBSCRIBERS KV via Cloudflare Workers env

### Task 2: Implement KV storage logic
- Lowercase email as key
- Store JSON value: `{ subscribed_at: ISO string, source: string, webinar_notify: boolean }`
- Handle upsert: check if key exists, merge if needed

### Task 3: Add rate limiting
- Basic IP-based rate limiting using KV or in-memory
- Max 5 subscribe requests per IP per minute
- Return 429 on rate limit exceeded

### Task 4: Wire EmailCapture component to server function
- Replace TODO stub in EmailCapture.tsx with actual server function call
- Add `source` and `webinar_notify` props
- Handle error responses in UI

---

## Technical Notes

- **TanStack Start server functions** use `createServerFn` with `.validator()` for input validation
- **Cloudflare env access:** Via `getEvent()` from vinxi or platform-specific context in TanStack Start on Workers
- **Architecture ref:** AD-4 (Data Architecture), AD-5 (Email Architecture)
- **KV value schema:** `{ subscribed_at: string, source: string, webinar_notify: boolean }`
