import { createServerFn } from '@tanstack/react-start'
import { and, desc, gte, inArray, lte, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/db/index'
import { bookings } from '#/db/schema'
import type { BookingRow } from '#/db/schema'
import {
  AdminUnauthorizedError,
  requireAdmin,
  unauthorizedResult,
} from '../requireAdmin'
import type { AdminUnauthorizedResult } from '../requireAdmin'
import { bookingStatusSchema } from '../schema'
import type { IntakeDto } from '../schema'

const listBookingsInputSchema = z.object({
  actorEmail: z.string().email(),
  statuses: z.array(bookingStatusSchema).optional(),
  fromDateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  toDateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  meetingId: z.string().min(1).max(64).optional(),
  limit: z.number().int().min(1).max(500).default(100),
})

export type ListBookingsInput = z.infer<typeof listBookingsInputSchema>

// We send the whole row to admin clients (intake_json, payment_intent_id,
// etc) since that's what admin needs. Sensitive fields stay inside the
// authenticated boundary.
export interface AdminBookingRow {
  id: string
  meetingId: string
  status: BookingRow['status']
  noShow: boolean
  slotIso: string
  slotLabel: string
  durationMinutes: number
  intake: IntakeDto
  paymentIntentId: string | null
  amountCents: number
  confirmationId: string
  googleEventId: string | null
  googleMeetUrl: string | null
  n8nEmailRunId: string | null
  adminNotes: string | null
  createdAt: string
  updatedAt: string
}

export type ListBookingsResult =
  | { success: true; bookings: Array<AdminBookingRow> }
  | AdminUnauthorizedResult
  | { success: false; error: string; status: 400 | 500 }

function rowToAdmin(row: BookingRow): AdminBookingRow {
  return {
    id: row.id,
    meetingId: row.meetingId,
    status: row.status,
    noShow: row.noShow,
    slotIso: row.slotIso.toISOString(),
    slotLabel: row.slotLabel,
    durationMinutes: row.durationMinutes,
    // Drizzle types jsonb as unknown; we control writes so the shape is
    // guaranteed to match IntakeDto.
    intake: row.intakeJson as IntakeDto,
    paymentIntentId: row.paymentIntentId,
    amountCents: row.amountCents,
    confirmationId: row.confirmationId,
    googleEventId: row.googleEventId,
    googleMeetUrl: row.googleMeetUrl,
    n8nEmailRunId: row.n8nEmailRunId,
    adminNotes: row.adminNotes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const listBookings = createServerFn({ method: 'GET' })
  .inputValidator((data: ListBookingsInput) => listBookingsInputSchema.parse(data))
  .handler(async ({ data }): Promise<ListBookingsResult> => {
    try {
      await requireAdmin(data.actorEmail)
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) return unauthorizedResult(err)
      throw err
    }

    const conditions = []
    if (data.statuses && data.statuses.length > 0) {
      conditions.push(inArray(bookings.status, data.statuses))
    }
    if (data.fromDateIso) {
      conditions.push(
        gte(bookings.slotIso, new Date(`${data.fromDateIso}T00:00:00.000Z`)),
      )
    }
    if (data.toDateIso) {
      conditions.push(
        lte(
          bookings.slotIso,
          new Date(
            new Date(`${data.toDateIso}T00:00:00.000Z`).getTime() +
              24 * 60 * 60 * 1000,
          ),
        ),
      )
    }
    if (data.meetingId) {
      conditions.push(sql`${bookings.meetingId} = ${data.meetingId}`)
    }

    const rows = await db
      .select()
      .from(bookings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(bookings.slotIso))
      .limit(data.limit)

    return { success: true, bookings: rows.map(rowToAdmin) }
  })
