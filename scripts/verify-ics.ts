import './_env'
import { eq } from 'drizzle-orm'
import { db } from '../src/db/index'
import { bookings } from '../src/db/schema'
import { insertBooking } from '../src/server/booking/repo'
import { composeIcsForBooking } from '../src/server/booking/composeIcsForBooking'

async function main() {
  const slotIso = new Date('2099-07-15T14:00:00.000Z')
  const row = await insertBooking({
    meetingId: 'intro',
    status: 'confirmed',
    slotIso,
    slotLabel: '10:00 AM',
    durationMinutes: 30,
    intakeJson: {
      name: 'ICS Verify',
      email: 'verify-ics@example.com',
      brief: 'Smoke',
      company: '',
      repo: '',
    },
    amountCents: 0,
    paymentIntentId: null,
  })

  const ics = composeIcsForBooking(row)
  console.log('--- generated ics ---')
  console.log(ics)
  console.log('--- /generated ---')

  // Sanity assertions (unfold first since long lines like ATTENDEE exceed
  // RFC 5545's 75-octet limit and get split with CRLF + space).
  const unfolded = ics.replace(/\r\n[ \t]/g, '')
  const must = [
    `UID:${row.confirmationId}@allainobs.com`,
    'DTSTART:20990715T140000Z',
    'DTEND:20990715T143000Z',
    'METHOD:REQUEST',
    'SUMMARY:30-min Intro Call with Jarad DeLorenzo',
    'mailto:verify-ics@example.com',
  ]
  for (const m of must) {
    if (!unfolded.includes(m)) throw new Error(`Missing expected line: ${m}`)
  }
  console.log('All required lines present.')

  await db.delete(bookings).where(eq(bookings.id, row.id))
  console.log('cleanup done.')
}

main().catch((err) => {
  console.error('FAIL:', err)
  process.exit(1)
})
