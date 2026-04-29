// Idempotent availability rule seed. Re-run safe: deletes existing rules per
// meeting before inserting the canonical set, so edits to this script become
// the new truth on next run.
//
// Usage: pnpm tsx scripts/seed-availability.ts
//
// Rules mirror the `availability` text on each MEETINGS entry. Two-hour
// buffer + same-day exclusion is enforced at query time, not here.

import './_env'
import { eq, isNull, or } from 'drizzle-orm'
import { db } from '../src/db/index'
import { availabilityRules } from '../src/db/schema'

interface RuleSeed {
  weekday: number // 0 = Sun ... 6 = Sat
  startMinutes: number
  endMinutes: number
  intervalMinutes?: number
  tz?: string
}

interface MeetingSeed {
  meetingId: string | null // null = global default
  description: string
  rules: Array<RuleSeed>
}

const ET = 'America/New_York'
const HALF_HOUR = 30
const HOUR = 60
const TWO_HOUR = 120

const SEEDS: Array<MeetingSeed> = [
  {
    meetingId: 'intro',
    description: 'Intro: Mon-Fri 9am-4pm ET, 30-min slots',
    rules: [1, 2, 3, 4, 5].map((weekday) => ({
      weekday,
      startMinutes: 9 * 60,
      endMinutes: 16 * 60,
      intervalMinutes: HALF_HOUR,
      tz: ET,
    })),
  },
  {
    meetingId: 'discovery',
    description: 'Discovery: Thu+Fri 10am-3pm ET, 60-min slots',
    rules: [4, 5].map((weekday) => ({
      weekday,
      startMinutes: 10 * 60,
      endMinutes: 15 * 60,
      intervalMinutes: HOUR,
      tz: ET,
    })),
  },
  {
    meetingId: 'prd',
    description: 'PRD: Mon+Wed 10am-2pm ET, 2-hour slots (mutual cal match)',
    rules: [1, 3].map((weekday) => ({
      weekday,
      startMinutes: 10 * 60,
      endMinutes: 14 * 60,
      intervalMinutes: TWO_HOUR,
      tz: ET,
    })),
  },
  {
    meetingId: 'architecture',
    description: 'Architecture: Tue+Thu 11am-4pm ET, 90-min slots',
    rules: [2, 4].map((weekday) => ({
      weekday,
      startMinutes: 11 * 60,
      endMinutes: 16 * 60,
      intervalMinutes: 90,
      tz: ET,
    })),
  },
  {
    meetingId: 'pair',
    description: 'Pair: Mon-Fri 1pm-5pm ET, 60-min slots',
    rules: [1, 2, 3, 4, 5].map((weekday) => ({
      weekday,
      startMinutes: 13 * 60,
      endMinutes: 17 * 60,
      intervalMinutes: HOUR,
      tz: ET,
    })),
  },
  {
    meetingId: 'audit',
    description: 'Audit: Wed 9am-12pm ET, 3-hour slot',
    rules: [3].map((weekday) => ({
      weekday,
      startMinutes: 9 * 60,
      endMinutes: 12 * 60,
      intervalMinutes: 180,
      tz: ET,
    })),
  },
]

async function main() {
  const meetingIds = SEEDS.filter((s) => s.meetingId !== null).map(
    (s) => s.meetingId as string,
  )
  console.log(
    `Replacing rules for: ${meetingIds.join(', ')} (and global meetingId=NULL).`,
  )

  // Wipe rules we own so reseeds are deterministic.
  await db
    .delete(availabilityRules)
    .where(
      or(
        isNull(availabilityRules.meetingId),
        ...meetingIds.map((id) => eq(availabilityRules.meetingId, id)),
      ),
    )
  console.log('  wiped existing rules.')

  for (const seed of SEEDS) {
    if (seed.rules.length === 0) continue
    const rows = seed.rules.map((r) => ({
      meetingId: seed.meetingId,
      weekday: r.weekday,
      startMinutes: r.startMinutes,
      endMinutes: r.endMinutes,
      intervalMinutes: r.intervalMinutes ?? HALF_HOUR,
      tz: r.tz ?? ET,
    }))
    await db.insert(availabilityRules).values(rows)
    console.log(`  inserted ${rows.length} rule(s) for ${seed.meetingId}: ${seed.description}`)
  }

  console.log('\n✓ Availability seeded.')
}

main().catch((err) => {
  console.error('FAIL:', err)
  process.exit(1)
})
