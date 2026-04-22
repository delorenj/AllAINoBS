interface StepperProps {
  step: number
  steps: ReadonlyArray<string>
}

export function Stepper({ step, steps }: StepperProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      {steps.map((s, i) => {
        const active = i === step
        const done = i < step
        const completed = active || done

        return (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold transition-all"
                style={{
                  background: active
                    ? 'var(--brand-emerald)'
                    : done
                      ? 'var(--brand-emerald-deep)'
                      : 'transparent',
                  color: completed ? '#050a08' : 'var(--brand-ink-soft)',
                  border: `1px solid ${
                    completed
                      ? 'var(--brand-emerald)'
                      : 'var(--brand-line-strong, rgba(52,211,153,0.30))'
                  }`,
                  transitionTimingFunction: 'var(--ease-brand, cubic-bezier(0.16,1,0.3,1))',
                  transitionDuration: '200ms',
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.12em]"
                style={{
                  color: active ? 'var(--brand-ink)' : 'var(--brand-ink-soft)',
                }}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px w-6 bg-[var(--brand-line)]" />
            )}
          </div>
        )
      })}
    </div>
  )
}
