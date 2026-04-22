# Story 2.4: Set Up Cloudflare KV SUBSCRIBERS Namespace

**Epic:** Epic 2 - Email Capture & Notifications (FR-6)
**Size:** XS
**Priority:** Must
**Dependencies:** None
**Status:** done

---

## Description

Provision the SUBSCRIBERS KV namespace in the Cloudflare account and configure the wrangler binding so it is accessible from TanStack Start server functions via the Cloudflare Workers runtime.

---

## Acceptance Criteria

- [ ] KV namespace `SUBSCRIBERS` is created in Cloudflare dashboard (or via wrangler CLI)
- [ ] Binding is configured in `wrangler.jsonc` so Workers can access it as `env.SUBSCRIBERS`
- [ ] TypeScript type for the Cloudflare env bindings includes SUBSCRIBERS KVNamespace
- [ ] Verified with a manual test write/read cycle (dev or wrangler CLI)

---

## Tasks

### Task 1: Add KV binding to wrangler.jsonc
- Add `kv_namespaces` array with SUBSCRIBERS binding
- Keep existing config intact

### Task 2: Create Cloudflare env type definitions
- Create or update a TypeScript interface for Cloudflare Worker env bindings
- Include `SUBSCRIBERS: KVNamespace` in the type

### Task 3: Verify binding works in dev
- Use `wrangler kv key put` / `wrangler kv key get` to verify the namespace
- Or write a simple server function test

---

## Technical Notes

- **Stack context:** TanStack Start on Cloudflare Workers via `@cloudflare/vite-plugin`
- **Architecture ref:** AD-4 (Data Architecture) specifies KV pattern: Key = email, Value = `{ subscribed_at, source, webinar_notify: bool }`
- **Wrangler config:** `wrangler.jsonc` at project root
- **Access pattern:** Server functions access KV via the Cloudflare Workers runtime env object
