import { and, eq, gte, lte, sql } from 'drizzle-orm'
// `#/db` resolves to src/db.ts (the legacy neon getClient). The drizzle client
// lives in src/db/index.ts; import it explicitly to avoid the path collision.
import { db } from '#/db/index'
import { bookings } from '#/db/schema'
import type { BookingInsert, BookingRow } from '#/db/schema'
import type { BookingRecord, BookingStatusDto } from './schema'

// --- Mapping ---

// Convert a DB row to the public-facing BookingRecord shape (no PII leakage).
export function toBookingRecord(row: BookingRow): BookingRecord {
  return {
    id: row.id,
    meetingId: row.meetingId,
    status: row.status,
    slotIso: row.slotIso.toISOString(),
    slotLabel: row.slotLabel,
    durationMinutes: row.durationMinutes,
    amountCents: row.amountCents,
    confirmationId: row.confirmationId,
    googleMeetUrl: row.googleMeetUrl,
    createdAt: row.createdAt.toISOString(),
  }
}

// --- Confirmation id ---

// Format mirrors the original client-side generator (AAI-XXXXXX, 6-char base36).
// Generated server-side now so it's persisted alongside the row in one transaction.
export function generateConfirmationId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = 'AAI-'
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

// --- Repo functions ---

// Insert a booking. Caller is responsible for picking the right status:
//   free path: 'confirmed'
//   paid path: 'pending' (Stripe webhook flips to 'paid' on success)
export async function insertBooking(
  input: Omit<BookingInsert, 'id' | 'createdAt' | 'updatedAt' | 'confirmationId'> & {
    confirmationId?: string
  },
): Promise<BookingRow> {
  const confirmationId = input.confirmationId ?? generateConfirmationId()
  const [row] = await db
    .insert(bookings)
    .values({ ...input, confirmationId })
    .returning()
  return row
}

export async function findBookingById(id: string): Promise<BookingRow | undefined> {
  const [row] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1)
  return row
}

export async function findBookingByConfirmationId(
  confirmationId: string,
): Promise<BookingRow | undefined> {
  const [row] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.confirmationId, confirmationId))
    .limit(1)
  return row
}

export async function findBookingByPaymentIntentId(
  paymentIntentId: string,
): Promise<BookingRow | undefined> {
  const [row] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.paymentIntentId, paymentIntentId))
    .limit(1)
  return row
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatusDto,
): Promise<BookingRow | undefined> {
  const [row] = await db
    .update(bookings)
    .set({ status, updatedAt: new Date() })
    .where(eq(bookings.id, id))
    .returning()
  return row
}

// Patch arbitrary fields after async side-effects land (gcal event id / meet url,
// n8n run id, payment intent id post-confirm).
export async function patchBooking(
  id: string,
  patch: Partial<
    Pick<
      BookingRow,
      | 'googleEventId'
      | 'googleMeetUrl'
      | 'n8nEmailRunId'
      | 'paymentIntentId'
      | 'status'
    >
  >,
): Promise<BookingRow | undefined> {
  const [row] = await db
    .update(bookings)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(bookings.id, id))
    .returning()
  return row
}

// Range query for getAvailability to subtract committed slots.
// status filter excludes pending bookings (those don't actually hold the slot
// per the partial unique index), and excludes canceled.
export async function listCommittedBookingsInRange(
  meetingId: string,
  fromIso: Date,
  toIso: Date,
): Promise<Array<Pick<BookingRow, 'slotIso' | 'durationMinutes'>>> {
  return db
    .select({
      slotIso: bookings.slotIso,
      durationMinutes: bookings.durationMinutes,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.meetingId, meetingId),
        sql`${bookings.status} in ('confirmed', 'paid')`,
        gte(bookings.slotIso, fromIso),
        lte(bookings.slotIso, toIso),
      ),
    )
}
