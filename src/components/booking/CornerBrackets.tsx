interface CornerBracketsProps {
  topLeft?: boolean
  bottomRight?: boolean
  topRight?: boolean
  bottomLeft?: boolean
  size?: number
  opacity?: number
}

export function CornerBrackets({
  topLeft = true,
  bottomRight = true,
  topRight = false,
  bottomLeft = false,
  size = 14,
  opacity = 0.3,
}: CornerBracketsProps) {
  const color = `rgba(52,211,153,${opacity})`
  const style = { width: size, height: size }
  const stroke = `2px solid ${color}`

  return (
    <>
      {topLeft && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-2"
          style={{ ...style, borderTop: stroke, borderLeft: stroke }}
        />
      )}
      {bottomRight && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2"
          style={{ ...style, borderBottom: stroke, borderRight: stroke }}
        />
      )}
      {topRight && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-2"
          style={{ ...style, borderTop: stroke, borderRight: stroke }}
        />
      )}
      {bottomLeft && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-2"
          style={{ ...style, borderBottom: stroke, borderLeft: stroke }}
        />
      )}
    </>
  )
}
