import './_env'
import { computeAvailability } from '../src/server/booking/availability-logic'
import { db } from '../src/db/index'
import { availabilityExceptions, availabilityRules, bookings } from '../src/db/schema'
import { and, gte, isNull, lte, or, sql } from 'drizzle-orm'

const meetingId = process.argv[2] ?? 'intro'

async function main() {
  const today = new Date()
  const fromDateIso = today.toISOString().slice(0, 10)
  const to = new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000)
  const toDateIso = to.toISOString().slice(0, 10)

  console.log(`Availability for ${meetingId}: ${fromDateIso} -> ${toDateIso}\n`)

  const ruleRows = await db
    .select()
    .from(availabilityRules)
    .where(
      or(
        isNull(availabilityRules.meetingId),
        sql`${availabilityRules.meetingId} = ${meetingId}`,
      ),
    )
  const exceptionRows = await db
    .select()
    .from(availabilityExceptions)
    .where(
      and(
        gte(availabilityExceptions.dateIso, fromDateIso),
        lte(availabilityExceptions.dateIso, toDateIso),
      ),
    )
  const fromUtc = new Date(`${fromDateIso}T00:00:00.000Z`)
  const toUtcExclusive = new Date(
    new Date(`${toDateIso}T00:00:00.000Z`).getTime() + 2 * 24 * 60 * 60 * 1000,
  )
  const committedRows = await db
    .select({
      slotIso: bookings.slotIso,
      durationMinutes: bookings.durationMinutes,
    })
    .from(bookings)
    .where(
      and(
        sql`${bookings.meetingId} = ${meetingId}`,
        sql`${bookings.status} in ('confirmed', 'paid')`,
        gte(bookings.slotIso, fromUtc),
        lte(bookings.slotIso, toUtcExclusive),
      ),
    )

  const days = computeAvailability({
    meetingId,
    fromDateIso,
    toDateIso,
    rules: ruleRows.map((r) => ({
      meetingId: r.meetingId,
      weekday: r.weekday,
      startMinutes: r.startMinutes,
      endMinutes: r.endMinutes,
      intervalMinutes: r.intervalMinutes,
      tz: r.tz,
      activeFrom: r.activeFrom,
      activeUntil: r.activeUntil,
    })),
    exceptions: exceptionRows.map((e) => ({
      meetingId: e.meetingId,
      dateIso: e.dateIso,
      type: e.type,
      startMinutes: e.startMinutes,
      endMinutes: e.endMinutes,
    })),
    committed: committedRows.map((c) => ({ slotIso: c.slotIso })),
    now: new Date(),
  })

  for (const day of days) {
    if (day.slots.length === 0) continue
    console.log(`${day.dateIso} (weekday=${day.weekday}): ${day.slots.join(', ')}`)
  }
}

main().catch((err) => {
  console.error('FAIL:', err)
  process.exit(1)
})
