export type MeetingTier = 'self-serve' | 'paid'

export interface Meeting {
  id: string
  slug: string
  kicker: string
  title: string
  duration: number
  price: number
  priceLabel: string
  tier: MeetingTier
  pitch: string
  bullets: ReadonlyArray<string>
  prep: string
  availability: string
  badge?: string
  note?: string
}

export interface CalendarDay {
  date: Date
  day: number
  weekday: string
  month: string
  full: string
  iso: string
  available: boolean
  isToday: boolean
}

export interface Intake {
  name: string
  email: string
  company: string
  brief: string
  repo: string
}

export interface PaymentData {
  card: string
  exp: string
  cvc: string
  zip: string
}
