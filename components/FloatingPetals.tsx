'use client'

import { useEffect, useState } from 'react'

interface Petal {
  id: number
  left: number
  animDuration: number
  delay: number
  size: number
  opacity: number
  rotate: number
}

interface FloatingPetalsProps {
  count?: number
  colors?: string[]
}

export default function FloatingPetals({ count = 12, colors = ['#FCE4EC', '#B76E79', '#FFF0F3', '#D6B477'] }: FloatingPetalsProps) {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animDuration: Math.random() * 8 + 7,
      delay: Math.random() * 10,
      size: Math.random() * 16 + 12,
      opacity: Math.random() * 0.5 + 0.3,
      rotate: Math.random() * 360,
    }))
    setPetals(generated)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.left}%`,
            top: '-20px',
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            animationName: 'petalFall',
            animationDuration: `${petal.animDuration}s`,
            animationDelay: `${petal.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationFillMode: 'both',
          }}
        >
          <svg viewBox="0 0 24 24" fill={colors[petal.id % colors.length]}>
            <ellipse cx="12" cy="6" rx="6" ry="10" transform={`rotate(${petal.rotate} 12 12)`} />
          </svg>
        </div>
      ))}
    </div>
  )
}

