// Fire-and-forget POST to the n8n webhook that owns the booking confirmation
// email. The Worker writes the booking row first; this function never throws,
// so a transient n8n outage cannot block a booking confirmation. The webhook
// URL is configured in env. When unset (e.g. local dev without n8n), the call
// is logged and skipped.

export interface BookingEmailPayload {
  confirmationId: string
  to: string
  toName: string
  subject: string
  meetingTitle: string
  durationMinutes: number
  slotIso: string
  slotLabel: string
  fullDateLabel: string
  meetingUrl?: string | null
  fromAddress: string
  brandTagline: string
  // Full RFC 5545 ics body, base64-encoded for safe transport in JSON. The
  // n8n workflow attaches this as `booking-${confirmationId}.ics` on the
  // outgoing Gmail message.
  icsBase64?: string
  icsFilename?: string
}

export interface N8nDispatchResult {
  ok: boolean
  status?: number
  runId?: string
  error?: string
}

export async function sendBookingEmailViaN8n(
  payload: BookingEmailPayload,
  webhookUrl: string | undefined,
): Promise<N8nDispatchResult> {
  if (!webhookUrl) {
    console.warn(
      '[booking.email] N8N_BOOKING_WEBHOOK_URL not set; skipping email dispatch',
      { confirmationId: payload.confirmationId },
    )
    return { ok: false, error: 'N8N_BOOKING_WEBHOOK_URL not configured' }
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[booking.email] n8n webhook non-2xx', {
        status: res.status,
        body: text.slice(0, 500),
        confirmationId: payload.confirmationId,
      })
      return { ok: false, status: res.status, error: text || 'non-2xx' }
    }
    // n8n typically returns { executionId, ... } from a webhook node.
    const json = (await res.json().catch(() => null)) as {
      executionId?: string
    } | null
    return { ok: true, status: res.status, runId: json?.executionId }
  } catch (err) {
    console.error('[booking.email] n8n webhook fetch failed', {
      err: err instanceof Error ? err.message : String(err),
      confirmationId: payload.confirmationId,
    })
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'fetch failed',
    }
  }
}
