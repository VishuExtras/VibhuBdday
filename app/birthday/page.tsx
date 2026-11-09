'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PageTransition from '@/components/PageTransition'
import FloatingPetals from '@/components/FloatingPetals'
import { useProgress } from '@/components/useProgress'

const NUM_CANDLES = 7

export default function BirthdayPage() {
  useProgress()
  const router = useRouter()
  const [candlesLit, setCandlesLit] = useState(Array(NUM_CANDLES).fill(true))
  const [wishMade, setWishMade] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const allOut = candlesLit.every(c => !c)

  const blowCandle = (i: number) => {
    if (!candlesLit[i]) return
    const next = [...candlesLit]
    next[i] = false
    setCandlesLit(next)
  }

  useEffect(() => {
    if (allOut && !wishMade) {
      setWishMade(true)
      setConfettiActive(true)
      triggerConfetti()
      confettiTimerRef.current = setTimeout(() => setConfettiActive(false), 5000)
    }
    return () => { if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current) }
  }, [allOut])

  const triggerConfetti = async () => {
    try {
      const { default: confetti } = await import('canvas-confetti')
      const end = Date.now() + 4000
      const colors = ['#FCE4EC', '#D6B477', '#A31632', '#B76E79', '#FFF0F3']
      const frame = () => {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors })
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    } catch { }
  }

  const balloons = [
    { color: '#FCE4EC', x: '8%', delay: 0 },
    { color: '#D6B477', x: '20%', delay: 0.3 },
    { color: '#B76E79', x: '75%', delay: 0.5 },
    { color: '#FFF0F3', x: '88%', delay: 0.2 },
    { color: '#A31632', x: '55%', delay: 0.7 },
  ]

  return (
    <PageTransition>
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #FFF0F3 0%, #FFFAFA 50%, #FCE4EC 100%)',
        }}
      >
        <FloatingPetals count={10} />

        {/* Fairy lights */}
        <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden pointer-events-none" aria-hidden>
          <div className="flex justify-around pt-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="relative"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: ['#D6B477', '#FCE4EC', '#B76E79', '#A31632', '#FFF0F3'][i % 5],
                    boxShadow: `0 0 6px 2px ${['#D6B477', '#FCE4EC', '#B76E79', '#A31632', '#FFF0F3'][i % 5]}`,
                  }}
                />
                <div className="w-px h-6 bg-warm-charcoal/20 mx-auto" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Balloons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {balloons.map((b, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: b.x, bottom: '-10px' }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: b.delay + 0.5, type: 'spring', stiffness: 50 }}
            >
              <motion.div
                animate={{ x: [-5, 5, -5], rotate: [-3, 3, -3] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
              >
                <BalloonSVG color={b.color} size={60 + i * 8} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <p className="font-dm text-xs tracking-[0.4em] text-champagne-gold uppercase mb-4">
              Today is your day
            </p>
            <h1
              className="font-cormorant font-light leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', color: '#30252A' }}
            >
              Happy Birthday,<br />
              <em className="font-playfair" style={{ color: '#A31632' }}>my Vibhu.</em>
            </h1>
            <p
              className="font-playfair italic text-warm-charcoal/60 max-w-md mx-auto leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)' }}
            >
              "Today, our universe celebrates the day it became<br className="hidden sm:block" />
              a little more beautiful."
            </p>
          </motion.div>

          {/* Birthday Cake */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <BirthdayCake candlesLit={candlesLit} onBlowCandle={blowCandle} />
          </motion.div>

          {/* Instruction / Wish message */}
          <AnimatePresence mode="wait">
            {!wishMade ? (
              <motion.div
                key="instruction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mb-8"
              >
                <p className="font-playfair italic text-muted-rose text-lg mb-2">
                  Make a wish, Babu.
                </p>
                <p className="font-dm text-sm text-warm-charcoal/50">
                  Tap each candle to blow it out ✨
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="wish-made"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mb-8 max-w-md"
              >
                <motion.p
                  className="text-4xl mb-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  🎉
                </motion.p>
                <p className="font-allura text-3xl text-burgundy mb-3">
                  "Teri ek Khwahish.
                </p>
                <p className="font-allura text-3xl text-muted-rose mb-3">
                  Hazaron Duayein Meri.
                </p>
                <p className="font-allura text-3xl text-burgundy">
                  Sab Tere Liye."
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue button */}
          <AnimatePresence>
            {wishMade && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => router.push('/our-story')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase transition-all"
                style={{
                  background: '#64172D',
                  color: '#FFFAFA',
                  boxShadow: '0 8px 30px rgba(100,23,45,0.25)',
                }}
              >
                Our Story ♡
              </motion.button>
            )}
          </AnimatePresence>

          {/* Skip */}
          {!wishMade && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={() => router.push('/our-story')}
              className="mt-6 font-dm text-xs text-warm-charcoal/30 hover:text-warm-charcoal/60 transition-colors underline underline-offset-4"
            >
              Continue to Our Story
            </motion.button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

function BirthdayCake({ candlesLit, onBlowCandle }: { candlesLit: boolean[], onBlowCandle: (i: number) => void }) {
  return (
    <div className="relative inline-block">
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 'min(320px, 85vw)', filter: 'drop-shadow(0 12px 32px rgba(100,23,45,0.15))' }}
      >
        {/* Plate */}
        <ellipse cx="160" cy="260" rx="140" ry="12" fill="#D6B477" fillOpacity="0.3" />

        {/* Cake bottom tier */}
        <rect x="30" y="170" width="260" height="80" rx="12" fill="#FCE4EC" stroke="#D6B477" strokeWidth="1.5" />
        {/* Bottom decorations */}
        <rect x="30" y="225" width="260" height="25" rx="0" fill="#B76E79" fillOpacity="0.3" />
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={55 + i * 32} cy="250" r="6" fill="#D6B477" fillOpacity="0.7" />
        ))}

        {/* Cake middle tier */}
        <rect x="55" y="100" width="210" height="75" rx="10" fill="#FFF0F3" stroke="#D6B477" strokeWidth="1.5" />
        <rect x="55" y="150" width="210" height="25" rx="0" fill="#A31632" fillOpacity="0.15" />
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={82 + i * 36} cy="168" r="5" fill="#D6B477" fillOpacity="0.8" />
        ))}

        {/* Cake top tier */}
        <rect x="90" y="40" width="140" height="65" rx="8" fill="#FFFAFA" stroke="#D6B477" strokeWidth="1.5" />
        <rect x="90" y="85" width="140" height="20" rx="0" fill="#B76E79" fillOpacity="0.2" />

        {/* Frosting drips */}
        {[100, 125, 150, 175, 200].map((x, i) => (
          <ellipse key={i} cx={x} cy="40" rx="8" ry="6" fill="white" />
        ))}
        {[65, 92, 120, 148, 176, 204, 232].map((x, i) => (
          <ellipse key={i} cx={x} cy="100" rx="9" ry="7" fill="white" />
        ))}
        {[40, 72, 105, 138, 171, 204, 237, 268].map((x, i) => (
          <ellipse key={i} cx={x} cy="170" rx="10" ry="8" fill="white" />
        ))}

        {/* "Happy Birthday" text on cake */}
        <text x="160" y="75" textAnchor="middle" fill="#B76E79" fontSize="10" fontFamily="'Allura', cursive">
          Happy Birthday
        </text>
        <text x="160" y="135" textAnchor="middle" fill="#A31632" fontSize="11" fontFamily="'Allura', cursive">
          Vibhu ♡
        </text>

        {/* Candles */}
        {Array.from({ length: NUM_CANDLES }).map((_, i) => {
          const x = 103 + i * 18
          const isLit = candlesLit[i]
          return (
            <g key={i} style={{ cursor: isLit ? 'pointer' : 'default' }} onClick={() => onBlowCandle(i)}>
              {/* Candle body */}
              <rect x={x - 3} y="20" width="6" height="22" rx="2"
                fill={['#D6B477', '#B76E79', '#A31632', '#FCE4EC', '#64172D', '#D6B477', '#B76E79'][i]}
              />
              {/* Flame */}
              {isLit && (
                <motion.ellipse
                  cx={x}
                  cy="16"
                  rx="4"
                  ry="6"
                  fill="#FFD700"
                  animate={{ rx: [4, 3, 4], ry: [6, 7, 6], cy: [16, 15, 16] }}
                  transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              {isLit && (
                <motion.ellipse
                  cx={x}
                  cy="17"
                  rx="2.5"
                  ry="4"
                  fill="#FFA500"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              )}
              {!isLit && (
                <circle cx={x} cy="18" r="2" fill="#30252A" fillOpacity="0.3" />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function BalloonSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 60 90" fill="none">
      <ellipse cx="30" cy="30" rx="22" ry="26" fill={color} />
      <ellipse cx="22" cy="18" rx="6" ry="4" fill="rgba(255,255,255,0.4)" />
      <path d="M 30 56 Q 28 65 32 70 Q 36 75 30 80 Q 24 85 30 90" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="30" cy="56" r="3" fill={color} />
    </svg>
  )
}
