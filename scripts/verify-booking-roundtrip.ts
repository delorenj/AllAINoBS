// One-shot integration check: insert a booking via the repo, read it back,
// confirm the partial unique index rejects a double-book, then clean up.
//
// Run with: pnpm tsx scripts/verify-booking-roundtrip.ts
//
// Reads DATABASE_URL from .env.local. Drops nothing on the schema; only
// inserts/deletes a single test row.

import './_env'
import { eq } from 'drizzle-orm'
import { db } from '../src/db/index'
import { bookings } from '../src/db/schema'
import {
  findBookingByConfirmationId,
  insertBooking,
} from '../src/server/booking/repo'
import { slotToUtc } from '../src/server/booking/slot'

async function main() {
  console.log('1. Inserting a free intro booking...')
  const slotIso = slotToUtc('2099-06-15', '10:00 AM')
  const row = await insertBooking({
    meetingId: 'intro',
    status: 'confirmed',
    slotIso,
    slotLabel: '10:00 AM',
    durationMinutes: 30,
    intakeJson: {
      name: 'Verify Test',
      email: 'verify@example.com',
      company: 'Test Co',
      brief: 'Smoke test for ALLAI-6 Phase 2',
      repo: '',
    },
    amountCents: 0,
    paymentIntentId: null,
  })
  console.log('   inserted:', {
    id: row.id,
    confirmationId: row.confirmationId,
    status: row.status,
    slotIso: row.slotIso.toISOString(),
  })

  console.log('2. Reading back by confirmation id...')
  const fetched = await findBookingByConfirmationId(row.confirmationId)
  if (!fetched) throw new Error('Round-trip failed: row not found')
  console.log('   found:', fetched.confirmationId, fetched.intakeJson)

  console.log('3. Attempting double-book on the same (meetingId, slotIso)...')
  try {
    await insertBooking({
      meetingId: 'intro',
      status: 'confirmed',
      slotIso,
      slotLabel: '10:00 AM',
      durationMinutes: 30,
      intakeJson: { name: 'Other', email: 'other@example.com', brief: 'x' },
      amountCents: 0,
      paymentIntentId: null,
    })
    throw new Error('Expected double-book to fail, but it succeeded!')
  } catch (err) {
    // Drizzle wraps the pg error. Walk the cause chain for the unique-violation
    // signal (pg code 23505 + the partial-index name).
    const cause = (err as { cause?: { code?: string; constraint?: string } })
      .cause
    const code = cause?.code
    const constraint = cause?.constraint
    if (
      code !== '23505' ||
      constraint !== 'bookings_meeting_slot_committed_uniq'
    ) {
      throw new Error(
        `Expected unique-index conflict, got code=${code} constraint=${constraint}`,
      )
    }
    console.log(
      `   conflict caught as expected (code=${code}, constraint=${constraint})`,
    )
  }

  console.log('4. Cleaning up...')
  await db.delete(bookings).where(eq(bookings.id, row.id))
  console.log('   deleted.')

  console.log('\n✓ All checks passed.')
}

main().catch((err) => {
  console.error('FAIL:', err)
  process.exit(1)
})
