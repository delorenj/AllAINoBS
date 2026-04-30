import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/db/index'
import { bookings } from '#/db/schema'
import { getMeeting } from '#/data/meetings'
import { findBookingById, patchBooking } from '../repo'
import { composeIcsForBooking } from '../composeIcsForBooking'
import { sendBookingEmailViaN8n } from '../sendEmailViaN8n'
import { createGoogleEvent } from '../createGoogleEvent'
import { GoogleEnvMissingError } from '../google-client'
import {
  AdminUnauthorizedError,
  requireAdmin,
  unauthorizedResult,
} from '../requireAdmin'
import type { AdminUnauthorizedResult } from '../requireAdmin'

const FROM_ADDRESS = 'jarad@automaticai.io'
const BRAND_TAGLINE = 'All AI · No BS'

// --- cancelBooking ---

const cancelBookingInputSchema = z.object({
  actorEmail: z.string().email(),
  bookingId: z.string().uuid(),
  reason: z.string().max(500).optional(),
})

export type CancelBookingInput = z.infer<typeof cancelBookingInputSchema>

export type CancelBookingResult =
  | { success: true; bookingId: string }
  | AdminUnauthorizedResult
  | { success: false; error: string; status: 404 | 500 }

export const cancelBooking = createServerFn({ method: 'POST' })
  .inputValidator((data: CancelBookingInput) =>
    cancelBookingInputSchema.parse(data),
  )
  .handler(async ({ data }): Promise<CancelBookingResult> => {
    try {
      await requireAdmin(data.actorEmail)
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) return unauthorizedResult(err)
      throw err
    }

    const existing = await findBookingById(data.bookingId)
    if (!existing) {
      return { success: false, error: 'Booking not found', status: 404 }
    }

    const noteAddition = data.reason
      ? `[${new Date().toISOString()}] cancel: ${data.reason}`
      : `[${new Date().toISOString()}] cancel`
    const newNotes = existing.adminNotes
      ? `${existing.adminNotes}\n${noteAddition}`
      : noteAddition

    await db
      .update(bookings)
      .set({
        status: 'canceled',
        adminNotes: newNotes,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, data.bookingId))

    console.log('[admin] booking canceled', {
      bookingId: data.bookingId,
      reason: data.reason,
      actor: data.actorEmail,
    })

    return { success: true, bookingId: data.bookingId }
  })

// --- markNoShow ---

const markNoShowInputSchema = z.object({
  actorEmail: z.string().email(),
  bookingId: z.string().uuid(),
  value: z.boolean(),
})

export type MarkNoShowInput = z.infer<typeof markNoShowInputSchema>

export type MarkNoShowResult =
  | { success: true; bookingId: string; noShow: boolean }
  | AdminUnauthorizedResult
  | { success: false; error: string; status: 404 }

export const markNoShow = createServerFn({ method: 'POST' })
  .inputValidator((data: MarkNoShowInput) => markNoShowInputSchema.parse(data))
  .handler(async ({ data }): Promise<MarkNoShowResult> => {
    try {
      await requireAdmin(data.actorEmail)
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) return unauthorizedResult(err)
      throw err
    }

    const existing = await findBookingById(data.bookingId)
    if (!existing) {
      return { success: false, error: 'Booking not found', status: 404 }
    }

    await db
      .update(bookings)
      .set({ noShow: data.value, updatedAt: new Date() })
      .where(eq(bookings.id, data.bookingId))

    console.log('[admin] booking no-show flag updated', {
      bookingId: data.bookingId,
      value: data.value,
      actor: data.actorEmail,
    })

    return { success: true, bookingId: data.bookingId, noShow: data.value }
  })

// --- resendBookingEmail ---

const resendBookingEmailInputSchema = z.object({
  actorEmail: z.string().email(),
  bookingId: z.string().uuid(),
})

export type ResendBookingEmailInput = z.infer<
  typeof resendBookingEmailInputSchema
>

export type ResendBookingEmailResult =
  | { success: true; bookingId: string; webhookOk: boolean }
  | AdminUnauthorizedResult
  | { success: false; error: string; status: 404 | 502 }

export const resendBookingEmail = createServerFn({ method: 'POST' })
  .inputValidator((data: ResendBookingEmailInput) =>
    resendBookingEmailInputSchema.parse(data),
  )
  .handler(async ({ data }): Promise<ResendBookingEmailResult> => {
    try {
      await requireAdmin(data.actorEmail)
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) return unauthorizedResult(err)
      throw err
    }

    const booking = await findBookingById(data.bookingId)
    if (!booking) {
      return { success: false, error: 'Booking not found', status: 404 }
    }

    const meeting = getMeeting(booking.meetingId)
    const intake = booking.intakeJson as {
      name?: string
      email: string
    }
    const fullDateLabel = booking.slotIso.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/New_York',
    })

    const icsBody = composeIcsForBooking(booking)
    const icsBase64 =
      typeof Buffer !== 'undefined'
        ? Buffer.from(icsBody, 'utf8').toString('base64')
        : btoa(unescape(encodeURIComponent(icsBody)))

    const result = await sendBookingEmailViaN8n(
      {
        confirmationId: booking.confirmationId,
        to: intake.email,
        toName: intake.name ?? intake.email,
        subject: `Resend: ${meeting?.title ?? booking.meetingId} on ${fullDateLabel}`,
        meetingTitle: meeting?.title ?? booking.meetingId,
        durationMinutes: booking.durationMinutes,
        slotIso: booking.slotIso.toISOString(),
        slotLabel: booking.slotLabel,
        fullDateLabel,
        meetingUrl: booking.googleMeetUrl,
        fromAddress: FROM_ADDRESS,
        brandTagline: BRAND_TAGLINE,
        icsBase64,
        icsFilename: `booking-${booking.confirmationId}.ics`,
      },
      process.env.N8N_BOOKING_WEBHOOK_URL,
    )

    if (result.runId) {
      await patchBooking(booking.id, { n8nEmailRunId: result.runId })
    }

    if (!result.ok) {
      return {
        success: false,
        error: result.error ?? 'Email dispatch failed',
        status: 502,
      }
    }
    return {
      success: true,
      bookingId: data.bookingId,
      webhookOk: true,
    }
  })

// --- recreateGoogleEvent ---

const recreateGcalInputSchema = z.object({
  actorEmail: z.string().email(),
  bookingId: z.string().uuid(),
})

export type RecreateGcalInput = z.infer<typeof recreateGcalInputSchema>

export type RecreateGcalResult =
  | {
      success: true
      bookingId: string
      googleEventId: string
      googleMeetUrl: string | null
    }
  | AdminUnauthorizedResult
  | { success: false; error: string; status: 404 | 502 }

export const recreateGoogleEvent = createServerFn({ method: 'POST' })
  .inputValidator((data: RecreateGcalInput) =>
    recreateGcalInputSchema.parse(data),
  )
  .handler(async ({ data }): Promise<RecreateGcalResult> => {
    try {
      await requireAdmin(data.actorEmail)
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) return unauthorizedResult(err)
      throw err
    }

    const booking = await findBookingById(data.bookingId)
    if (!booking) {
      return { success: false, error: 'Booking not found', status: 404 }
    }
    const meeting = getMeeting(booking.meetingId)
    const intake = booking.intakeJson as { name?: string; email: string }

    try {
      const gcal = await createGoogleEvent({
        meetingTitle: meeting?.title ?? booking.meetingId,
        meetingPitch: meeting?.pitch,
        meetingPrep: meeting?.prep,
        slotIso: booking.slotIso,
        durationMinutes: booking.durationMinutes,
        organizerEmail: FROM_ADDRESS,
        attendeeEmail: intake.email,
        attendeeName: intake.name ?? intake.email,
        confirmationId: booking.confirmationId,
      })
      await patchBooking(booking.id, {
        googleEventId: gcal.eventId,
        googleMeetUrl: gcal.meetUrl,
      })
      return {
        success: true,
        bookingId: data.bookingId,
        googleEventId: gcal.eventId,
        googleMeetUrl: gcal.meetUrl,
      }
    } catch (err) {
      if (err instanceof GoogleEnvMissingError) {
        return { success: false, error: err.message, status: 502 }
      }
      console.error('[admin] recreateGoogleEvent failed', {
        bookingId: data.bookingId,
        err: err instanceof Error ? err.message : String(err),
      })
      return {
        success: false,
        error: err instanceof Error ? err.message : 'gcal failed',
        status: 502,
      }
    }
  })
