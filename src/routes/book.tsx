import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { motion } from 'motion/react'
import { getMeeting } from '#/data/meetings'
import { BookingFlow } from '#/components/booking/BookingFlow'
import { BookingHero } from '#/components/booking/sections/BookingHero'
import { BookingTrustStrip } from '#/components/booking/sections/BookingTrustStrip'
import { AllSessions } from '#/components/booking/sections/AllSessions'
import { WhatToExpect } from '#/components/booking/sections/WhatToExpect'
import { Testimonials } from '#/components/booking/sections/Testimonials'
import { FAQ } from '#/components/booking/sections/FAQ'
import { PolicyStrip } from '#/components/booking/sections/PolicyStrip'
import { FinalCTA } from '#/components/booking/sections/FinalCTA'

export const Route = createFileRoute('/book')({
  component: BookPage,
  head: () => ({
    meta: [
      { title: 'Book Time With Jarad · All AI, No BS' },
      {
        name: 'description',
        content:
          'Self-serve scheduling with Jarad DeLorenzo. Free 30-minute intro call, paid discovery, PRD kickoffs, architecture reviews, pair programming, and team workflow audits.',
      },
      { property: 'og:title', content: 'Book Time With Jarad · All AI, No BS' },
      {
        property: 'og:description',
        content:
          'Skip the sales cycle. Book directly with Jarad. Intro calls are free. Everything else is pay-to-play and refundable.',
      },
      { property: 'og:type', content: 'website' },
    ],
  }),
})

function BookPage() {
  const [bookingId, setBookingId] = useState<string | null>(null)
  const meeting = bookingId ? getMeeting(bookingId) : null

  const openBooking = useCallback((meetingId: string) => {
    setBookingId(meetingId)
    // Defer scroll to next frame so #book is mounted
    window.requestAnimationFrame(() => {
      document
        .getElementById('book')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const closeBooking = useCallback(() => {
    setBookingId(null)
  }, [])

  return (
    <main>
      <BookingHero onScrollToBook={openBooking} />
      <BookingTrustStrip />
      <AllSessions onBook={openBooking} />

      <section id="book" className="px-4 py-16">
        {meeting ? (
          <BookingFlow meeting={meeting} onReset={closeBooking} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-[720px] rounded-[24px] border border-dashed border-[var(--brand-line)] px-8 py-14 text-center"
            style={{ background: 'rgba(10,18,14,0.35)' }}
          >
            <p className="section-kicker mb-3">Your booking starts here</p>
            <h3
              className="display-title mb-3 font-bold leading-[1.05] text-[var(--brand-ink)]"
              style={{ fontSize: 'clamp(24px,3vw,32px)' }}
            >
              Pick a session above to kick off the booking flow.
            </h3>
            <p className="mx-auto max-w-[520px] text-sm leading-[1.55] text-[var(--brand-ink-soft)]">
              Intro call is free and takes 30 minutes. Paid engagements load the
              full calendar and payment flow right here.
            </p>
          </motion.div>
        )}
      </section>

      <WhatToExpect />
      <Testimonials />
      <FAQ />
      <PolicyStrip />
      <FinalCTA onScrollToBook={openBooking} />
    </main>
  )
}
