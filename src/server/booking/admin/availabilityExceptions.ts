import { createServerFn } from '@tanstack/react-start'
import { and, asc, eq, gte, lte } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/db/index'
import { availabilityExceptions } from '#/db/schema'
import {
  AdminUnauthorizedError,
  requireAdmin,
  unauthorizedResult,
} from '../requireAdmin'
import type { AdminUnauthorizedResult } from '../requireAdmin'

// --- list ---

const listInputSchema = z.object({
  actorEmail: z.string().email(),
  fromDateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  toDateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export type ListExceptionsInput = z.infer<typeof listInputSchema>

export interface AdminAvailabilityException {
  id: string
  meetingId: string | null
  dateIso: string
  type: 'blackout' | 'override'
  startMinutes: number | null
  endMinutes: number | null
  reason: string | null
  createdAt: string
}

export type ListExceptionsResult =
  | { success: true; exceptions: Array<AdminAvailabilityException> }
  | AdminUnauthorizedResult

export const listAvailabilityExceptions = createServerFn({ method: 'GET' })
  .inputValidator((data: ListExceptionsInput) => listInputSchema.parse(data))
  .handler(async ({ data }): Promise<ListExceptionsResult> => {
    try {
      await requireAdmin(data.actorEmail)
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) return unauthorizedResult(err)
      throw err
    }

    const conditions = []
    if (data.fromDateIso) {
      conditions.push(gte(availabilityExceptions.dateIso, data.fromDateIso))
    }
    if (data.toDateIso) {
      conditions.push(lte(availabilityExceptions.dateIso, data.toDateIso))
    }

    const rows = await db
      .select()
      .from(availabilityExceptions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(availabilityExceptions.dateIso))

    return {
      success: true,
      exceptions: rows.map((r) => ({
        id: r.id,
        meetingId: r.meetingId,
        dateIso: r.dateIso,
        type: r.type,
        startMinutes: r.startMinutes,
        endMinutes: r.endMinutes,
        reason: r.reason,
        createdAt: r.createdAt.toISOString(),
      })),
    }
  })

// --- add ---

const addInputSchema = z
  .object({
    actorEmail: z.string().email(),
    meetingId: z.string().min(1).max(64).nullish(),
    dateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    type: z.enum(['blackout', 'override']),
    startMinutes: z.number().int().min(0).max(24 * 60).optional(),
    endMinutes: z.number().int().min(0).max(24 * 60).optional(),
    reason: z.string().max(280).optional(),
  })
  .refine(
    (v) =>
      v.type !== 'override' ||
      (typeof v.startMinutes === 'number' && typeof v.endMinutes === 'number'),
    { message: 'Override exceptions require startMinutes and endMinutes' },
  )
  .refine(
    (v) =>
      v.type !== 'override' ||
      (v.startMinutes ?? 0) < (v.endMinutes ?? 0),
    { message: 'startMinutes must be less than endMinutes' },
  )

export type AddExceptionInput = z.infer<typeof addInputSchema>

export type AddExceptionResult =
  | { success: true; id: string }
  | AdminUnauthorizedResult
  | { success: false; error: string; status: 400 }

export const addAvailabilityException = createServerFn({ method: 'POST' })
  .inputValidator((data: AddExceptionInput) => addInputSchema.parse(data))
  .handler(async ({ data }): Promise<AddExceptionResult> => {
    try {
      await requireAdmin(data.actorEmail)
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) return unauthorizedResult(err)
      throw err
    }

    const [row] = await db
      .insert(availabilityExceptions)
      .values({
        meetingId: data.meetingId ?? null,
        dateIso: data.dateIso,
        type: data.type,
        startMinutes:
          data.type === 'override' ? (data.startMinutes ?? null) : null,
        endMinutes:
          data.type === 'override' ? (data.endMinutes ?? null) : null,
        reason: data.reason ?? null,
      })
      .returning({ id: availabilityExceptions.id })

    console.log('[admin] availability exception added', {
      id: row.id,
      type: data.type,
      dateIso: data.dateIso,
      meetingId: data.meetingId,
      actor: data.actorEmail,
    })

    return { success: true, id: row.id }
  })

// --- delete ---

const deleteInputSchema = z.object({
  actorEmail: z.string().email(),
  id: z.string().uuid(),
})

export type DeleteExceptionInput = z.infer<typeof deleteInputSchema>

export type DeleteExceptionResult =
  | { success: true; id: string }
  | AdminUnauthorizedResult
  | { success: false; error: string; status: 404 }

export const deleteAvailabilityException = createServerFn({ method: 'POST' })
  .inputValidator((data: DeleteExceptionInput) => deleteInputSchema.parse(data))
  .handler(async ({ data }): Promise<DeleteExceptionResult> => {
    try {
      await requireAdmin(data.actorEmail)
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) return unauthorizedResult(err)
      throw err
    }

    const result = await db
      .delete(availabilityExceptions)
      .where(eq(availabilityExceptions.id, data.id))
      .returning({ id: availabilityExceptions.id })

    if (result.length === 0) {
      return { success: false, error: 'Not found', status: 404 }
    }
    return { success: true, id: data.id }
  })
