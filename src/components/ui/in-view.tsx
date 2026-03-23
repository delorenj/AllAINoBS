'use client'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import type { Variant, Transition, UseInViewOptions } from 'motion/react'
import { motion, useInView } from 'motion/react'

interface InViewProps {
  children: ReactNode
  variants?: {
    hidden: Variant
    visible: Variant
  }
  transition?: Transition
  viewOptions?: UseInViewOptions
  as?: 'div' | 'section' | 'article'
  className?: string
}

const defaultVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.5, ease: 'easeOut' },
  viewOptions = { once: true, margin: '0px 0px -100px 0px' },
  as = 'div',
  className,
}: InViewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewOptions)
  const Component = motion[as]

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </Component>
  )
}
