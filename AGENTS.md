# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**allainobs** is Jarad DeLorenzo's professional site and AI Learning and Education platform. His registered company is ACD Consulting is an umbrella brand that covers more general consulting and has a sister site dedicated to the overarching ACD Consulting brand [here](https://acd.consulting).

"All AI, No BS" is the home of his AI Education platform which provides free group webinars, one-on-one coaching sessions, small-cohort workshops, and various learning materials.

### Key Components

- **Stylish, trendy, flashy** landing page - Needs to sell me (Jarad) as an established thought-leader in the field of AI Developer Workflow.
- **Custom Webinar Service** created using Cloudflare Streams
- **Pay-gated Materials and Videos** - Specialized curated skill packages, high-value enterprise quality skills, AI How-To Guides listed by major categories (OpenClaw configuration, Dev lifecycle, Memory, Heartbeat Strategies for true Agency)
- **Profile, Contact, and Scheduling Services** - Provide ultra-low friction means of contacting Jarad, scheduling paid coaching sessions, scheduling a free one-on-one intro, commisioning a private group session, signing up for a paid workshop, and signing up for a free webinar.

### Key People

Jarad DeLorenzo - Principal Architect and Owner of ACD Consulting and All AI, No BS. [github](https://github.com/delorenj), [AI Blog](https://delorenj.com)
Damian Miller - Director of Marketing and best friend since pre-school. 50% partner in the All AI, No BS ecosystem.

### Ticket Management (MANDATORY)

**No code changes without an active Plane ticket:**

```bash
# Plane board URL
https://plane.delo.sh/33god/

# Project Configuration
Workspace: 33god
Project ID: c3886008-cdb0-4cc3-bf8c-488f812e7be1
Project Identifier: ALLAI
```

**Requirements:**

- Move ticket to "In Progress" before first code change
- Branch names must include ticket reference (e.g., `ALLAI-123`)
- Commit messages must reference tickets
- Git hooks enforce ticket requirements
- Emergency bypass only: `ALLOW_NO_TICKET=1`

## Stack

- TanStack: `npx @tanstack/cli@latest create allainobs --tailwind --add-ons cloudflare,tanstack-query,strapi,clerk,start,store,form,table,neon,drizzle,eslint,apollo-client`
- Shadcn: TanStack Start preset `pnpm dlx shadcn@latest init --preset b1GKwuLw1 --base base --template start --monorepo`

## Important Principles

- Use `hindsight` skills and CLI for memory.
- Work with 100% autonomy toward task goals
- When decisions needed, make well-informed guesses
- Speed prioritized over perfect accuracy (non-mission-critical)
- For all design and frontend tasks, use google's `stitch` MCP tools to iterate on design, and `shadcn` MCP for implementation.
- For anything credential or password related, use 1password DeLoSecrets vault, look in ~/.config/zshyzsh/secrets.zsh, or JUST TRY $DEFAULT_USERNAME and $DEFAULT_PASSWORD
- Take advantage of parallel subagents when possible
- Make smart, liberal use of `codex`, `gemini`, `auggie`, `copilot`, `opencode` (running on 192.168.1.12:4096), and `kimi` when orchestrating coding agents.
- Maintain parity between BMAD documents and Plane project board
- Update both BMAD and Plane when divergence detected

## Critical Reminders

⚠️ **Divergence from these rules results in severe penalties due to governmental regulations**

- Make liberal use of shadcn components and blocks! DO NOT reinvent the wheel! ALWAYS look through the top [shadcn registries](https://ui.shadcn.com/docs/directory) for inspiration and ready-made code BEFORE writing your own.
- Always verify Plane ticket before code changes
- Maintain strict BMAD adherence
- Delegate component work appropriately
- Keep BMAD documents and Plane boards synchronized
