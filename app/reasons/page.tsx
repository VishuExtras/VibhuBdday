'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PageTransition from '@/components/PageTransition'
import { reasons } from '@/data/siteConfig'
import { useProgress } from '@/components/useProgress'

const TOTAL = 100

export default function ReasonsPage() {
  useProgress()
  const router = useRouter()
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const [milestone10Shown, setMilestone10Shown] = useState(false)
  const [milestone100Shown, setMilestone100Shown] = useState(false)

  const handleFlip = useCallback((i: number) => {
    setFlipped(prev => {
      const next = new Set(prev)
      if (!next.has(i)) {
        next.add(i)
        const count = next.size
        if (count === 10 && !milestone10Shown) {
          setTimeout(() => setMilestone10Shown(true), 400)
          setTimeout(() => setMilestone10Shown(false), 4000)
        }
        if (count === TOTAL && !milestone100Shown) {
          setTimeout(() => setMilestone100Shown(true), 400)
        }
      }
      return next
    })
  }, [milestone10Shown, milestone100Shown])

  const revealedCount = flipped.size

  return (
    <PageTransition>
      <div
        className="min-h-screen relative"
        style={{ background: 'linear-gradient(180deg, #FFFAFA 0%, #FFF0F3 100%)' }}
      >
        {/* Milestone banners */}
        <AnimatePresence>
          {milestone10Shown && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-0 left-0 right-0 z-[500] text-center py-5 px-6"
              style={{ background: '#A31632' }}
            >
              <p className="font-playfair italic text-ivory text-lg">
                "Only 10? Baby, I could write a thousand." ♡
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {milestone100Shown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[400] flex items-center justify-center"
              style={{ background: 'rgba(255,250,250,0.95)', backdropFilter: 'blur(8px)' }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center px-8 max-w-lg"
              >
                <div className="text-6xl mb-6">💌</div>
                <h2
                  className="font-cormorant font-light mb-4"
                  style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#30252A' }}
                >
                  "Turns out, even 100 isn't enough."
                </h2>
                <p className="font-allura text-2xl text-muted-rose mb-8">
                  You are, quite simply, everything.
                </p>
                <motion.button
                  onClick={() => { setMilestone100Shown(false); router.push('/museum') }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase"
                  style={{ background: '#A31632', color: '#FFFAFA', boxShadow: '0 8px 30px rgba(163,22,50,0.25)' }}
                >
                  The Museum of Vibhuti ♡
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="relative z-10 text-center px-6 py-24 pb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-dm text-xs tracking-[0.4em] text-champagne-gold uppercase mb-4">
              Counted, but never enough
            </p>
            <h1
              className="font-cormorant font-light leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: '#30252A' }}
            >
              100 Little Reasons.
            </h1>
            <h2
              className="font-playfair italic mb-6"
              style={{ fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', color: '#A31632' }}
            >
              One Very Big Love.
            </h2>
            <div className="w-24 h-px bg-champagne-gold mx-auto mb-6" />

            {/* Progress */}
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between font-dm text-xs text-warm-charcoal/50 mb-2">
                <span>Revealed</span>
                <span>{revealedCount} / {TOTAL}</span>
              </div>
              <div className="h-1 bg-blush rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#A31632' }}
                  animate={{ width: `${(revealedCount / TOTAL) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <ReasonCard
                key={i}
                index={i}
                reason={reasons[i] || `[ADD REASON ${i + 1} HERE]`}
                isFlipped={flipped.has(i)}
                onFlip={() => handleFlip(i)}
              />
            ))}
          </div>

          {/* Continue button */}
          <div className="text-center mt-16">
            <motion.button
              onClick={() => router.push('/museum')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase"
              style={{ background: '#64172D', color: '#FFFAFA', boxShadow: '0 8px 30px rgba(100,23,45,0.2)' }}
            >
              The Museum of Vibhuti ♡
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

interface ReasonCardProps {
  index: number
  reason: string
  isFlipped: boolean
  onFlip: () => void
}

function ReasonCard({ index, reason, isFlipped, onFlip }: ReasonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.4 }}
      className="card-3d cursor-pointer"
      style={{ height: '140px' }}
      onClick={onFlip}
      role="button"
      aria-label={`Reason ${index + 1}: ${isFlipped ? reason : 'Click to reveal'}`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onFlip()}
    >
      <div className={`card-inner h-full ${isFlipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div
          className="card-face flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 hover:shadow-md"
          style={{
            background: isFlipped ? undefined : 'rgba(255,250,250,0.9)',
            border: `1px solid ${isFlipped ? '#A31632' : 'rgba(214,180,119,0.3)'}`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-2 text-ivory font-dm text-xs font-medium"
            style={{ background: '#B76E79' }}
          >
            {index + 1}
          </div>
          <span className="text-lg">♡</span>
          <p className="font-dm text-xs text-warm-charcoal/40 mt-1">Tap to reveal</p>
        </div>

        {/* Back */}
        <div
          className="card-face card-back flex items-center justify-center p-3 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #FCE4EC, #FFF0F3)',
            border: '1px solid rgba(214,180,119,0.4)',
          }}
        >
          <p className="font-playfair italic text-warm-charcoal/80 text-center leading-relaxed text-xs">
            {reason}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
