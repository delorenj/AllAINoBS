import { createServerFn } from '@tanstack/react-start'
import { and, gte, isNull, lte, or, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/db/index'
import { availabilityExceptions, availabilityRules, bookings } from '#/db/schema'
import { getMeeting } from '#/data/meetings'
import { computeAvailability } from './availability-logic'
import type { AvailabilityDay } from './availability-logic'

const getAvailabilityInputSchema = z.object({
  meetingId: z.string().min(1).max(64),
  fromDateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  toDateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type GetAvailabilityInput = z.infer<typeof getAvailabilityInputSchema>

export type GetAvailabilityResult =
  | { success: true; days: Array<AvailabilityDay> }
  | { success: false; error: string; status: number }

export const getAvailability = createServerFn({ method: 'GET' })
  .inputValidator((data: GetAvailabilityInput) =>
    getAvailabilityInputSchema.parse(data),
  )
  .handler(async ({ data }): Promise<GetAvailabilityResult> => {
    if (!getMeeting(data.meetingId)) {
      return {
        success: false,
        error: `Unknown meeting "${data.meetingId}"`,
        status: 400,
      }
    }
    if (data.toDateIso < data.fromDateIso) {
      return {
        success: false,
        error: 'toDateIso must not be before fromDateIso',
        status: 400,
      }
    }

    // Pull meeting-scoped + global rules. activeFrom/activeUntil bounds are
    // checked in computeAvailability per-day to handle ranges that cross the
    // boundary cleanly.
    const ruleRows = await db
      .select()
      .from(availabilityRules)
      .where(
        or(
          isNull(availabilityRules.meetingId),
          sql`${availabilityRules.meetingId} = ${data.meetingId}`,
        ),
      )

    const exceptionRows = await db
      .select()
      .from(availabilityExceptions)
      .where(
        and(
          gte(availabilityExceptions.dateIso, data.fromDateIso),
          lte(availabilityExceptions.dateIso, data.toDateIso),
        ),
      )

    // Bookings table stores slot_iso as timestamptz. Convert range bounds to
    // UTC bookend Dates wide enough to catch any tz the rules might use.
    const fromUtc = new Date(`${data.fromDateIso}T00:00:00.000Z`)
    const toUtcExclusive = new Date(
      new Date(`${data.toDateIso}T00:00:00.000Z`).getTime() +
        2 * 24 * 60 * 60 * 1000,
    )
    const committedRows = await db
      .select({
        slotIso: bookings.slotIso,
        durationMinutes: bookings.durationMinutes,
      })
      .from(bookings)
      .where(
        and(
          sql`${bookings.meetingId} = ${data.meetingId}`,
          sql`${bookings.status} in ('confirmed', 'paid')`,
          gte(bookings.slotIso, fromUtc),
          lte(bookings.slotIso, toUtcExclusive),
        ),
      )

    const days = computeAvailability({
      meetingId: data.meetingId,
      fromDateIso: data.fromDateIso,
      toDateIso: data.toDateIso,
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

    return { success: true, days }
  })
