'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import FloatingPetals from '@/components/FloatingPetals'
import { getSavedProgress } from '@/components/useProgress'

const PAGE_LABELS: Record<string, string> = {
  '/birthday': 'Birthday',
  '/our-story': 'Our Story',
  '/museum': 'The Museum',
  '/future': 'Our Future',
  '/letter': 'The Letter',
  '/forever': 'Forever',
}
const PAGE_ORDER = ['/', '/birthday', '/our-story', '/museum', '/future', '/letter', '/forever']

const roseSecrets = [
  'Every rose has a story. So do you. 🌹',
  'You found this. That means you were paying attention. ♡',
  'Some things are hidden in plain sight. Like how much I love you.',
  'Even roses aren\'t as beautiful as you. That\'s just facts. 🌹',
]

export default function EnvelopePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'idle' | 'opening' | 'letter' | 'transitioning'>('idle')
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string }[]>([])
  const [resumePage, setResumePage] = useState<string | null>(null)
  const [showRoseSecret, setShowRoseSecret] = useState(false)
  const [roseMsg, setRoseMsg] = useState('')

  useEffect(() => {
    const p = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: ['#FCE4EC', '#D6B477', '#B76E79', '#FFF0F3'][i % 4],
    }))
    setParticles(p)

    // Check for saved progress
    const { furthestPage } = getSavedProgress()
    if (furthestPage > 0 && PAGE_ORDER[furthestPage]) {
      setResumePage(PAGE_ORDER[furthestPage])
    }
  }, [])

  const handleOpen = () => {
    setPhase('opening')
    setTimeout(() => setPhase('letter'), 1000)
    setTimeout(() => {
      setPhase('transitioning')
      setTimeout(() => router.push('/birthday'), 1000)
    }, 4500)
  }

  const handleRoseClick = () => {
    setRoseMsg(roseSecrets[Math.floor(Math.random() * roseSecrets.length)])
    setShowRoseSecret(true)
    setTimeout(() => setShowRoseSecret(false), 4000)
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #FFF0F3 0%, #FFFAFA 40%, #FCE4EC 100%)',
      }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <FloatingPetals count={8} />

      {/* Decorative corner elements */}
      <div className="absolute top-6 left-6 w-24 h-24 opacity-20" aria-hidden>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,10 Q30,0 50,10 Q70,20 90,10" stroke="#D6B477" strokeWidth="1.5" fill="none" />
          <circle cx="10" cy="10" r="3" fill="#D6B477" />
          <circle cx="90" cy="10" r="3" fill="#D6B477" />
          <path d="M10,10 Q10,30 10,50 Q10,70 10,90" stroke="#D6B477" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 w-24 h-24 opacity-20 rotate-180" aria-hidden>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,10 Q30,0 50,10 Q70,20 90,10" stroke="#D6B477" strokeWidth="1.5" fill="none" />
          <circle cx="10" cy="10" r="3" fill="#D6B477" />
          <circle cx="90" cy="10" r="3" fill="#D6B477" />
          <path d="M10,10 Q10,30 10,50 Q10,70 10,90" stroke="#D6B477" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* 🌹 Rose easter egg — subtle, bottom-left corner */}
      <motion.button
        onClick={handleRoseClick}
        className="absolute bottom-8 left-8 z-20 text-2xl opacity-30 hover:opacity-80 transition-opacity duration-500 cursor-pointer"
        whileHover={{ scale: 1.2, rotate: -10 }}
        whileTap={{ scale: 0.9 }}
        title=""
        aria-label="A little secret"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
      >
        🌹
      </motion.button>

      {/* Rose secret popup */}
      <AnimatePresence>
        {showRoseSecret && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 left-6 z-[300] max-w-[260px]"
          >
            <div
              className="rounded-2xl px-5 py-4 shadow-lg"
              style={{
                background: 'rgba(255,250,250,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(214,180,119,0.3)',
              }}
            >
              <p className="font-allura text-xl text-burgundy leading-relaxed">{roseMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume journey button — only shows if user has visited before */}
      <AnimatePresence>
        {resumePage && phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute top-6 right-6 z-20"
          >
            <button
              onClick={() => router.push(resumePage)}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-dm text-xs tracking-widest uppercase transition-all hover:scale-105"
              style={{
                background: 'rgba(255,250,250,0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(214,180,119,0.4)',
                color: '#64172D',
              }}
            >
              <span>↩</span>
              <span>Continue — {PAGE_LABELS[resumePage]}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {phase !== 'letter' && phase !== 'transitioning' && (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-center px-6 max-w-2xl mx-auto z-10 relative"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p className="font-dm text-xs tracking-[0.4em] text-champagne-gold uppercase mb-3">
                Our little universe called
              </p>
              <h1
                className="font-cormorant font-light mb-2 leading-none"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#30252A' }}
              >
                US
              </h1>
              <div className="w-24 h-px bg-champagne-gold mx-auto mb-8" />
            </motion.div>

            {/* Animated Envelope */}
            <motion.div
              className="relative mx-auto mb-8 cursor-pointer"
              style={{ width: 'min(280px, 80vw)', height: 'min(200px, 57vw)' }}
              onClick={phase === 'idle' ? handleOpen : undefined}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <EnvelopeSVG isOpening={phase === 'opening'} />
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <p className="font-allura text-3xl text-burgundy mb-3">Vibhu...</p>
              <p className="font-playfair italic text-warm-charcoal/70 text-lg leading-relaxed">
                "Zindagi ki is bhaag daud mein bhi,<br />
                your name became my favourite."
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={phase === 'idle' ? handleOpen : undefined}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase transition-all duration-300"
              style={{
                background: '#A31632',
                color: '#FFFAFA',
                boxShadow: '0 8px 30px rgba(163,22,50,0.3)',
              }}
              aria-label="Open your little universe"
            >
              <span className="relative z-10">Open Your Little Universe ♡</span>
              <motion.div
                className="absolute inset-0"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-4 font-dm text-xs text-warm-charcoal/40"
            >
              Made with love, especially for you.
            </motion.p>
          </motion.div>
        )}

        {(phase === 'letter' || phase === 'transitioning') && (
          <motion.div
            key="letter-view"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-sm mx-auto px-6"
          >
            {/* Sparkle effects */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-champagne-gold text-lg pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                transition={{ delay: i * 0.1, duration: 1 }}
              >
                ✦
              </motion.div>
            ))}

            {/* Letter card */}
            <div
              className="paper-texture rounded-lg p-8 shadow-xl relative"
              style={{ border: '1px solid rgba(214,180,119,0.3)' }}
            >
              <div className="wax-seal mx-auto mb-6">❦</div>
              <p className="font-allura text-4xl text-burgundy text-center mb-4">Vibhu...</p>
              <div className="w-full h-px bg-champagne-gold/30 mb-4" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <p className="font-playfair italic text-warm-charcoal/80 text-base leading-relaxed text-center">
                  "You came in my life very unexpectedly, and became my life eventually."
                </p>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-dm text-xs text-warm-charcoal/40 text-center mt-6 tracking-widest"
              >
                Opening your universe...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition overlay */}
      <AnimatePresence>
        {phase === 'transitioning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ background: 'rgba(255,250,250,0.98)' }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function EnvelopeSVG({ isOpening }: { isOpening: boolean }) {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(100,23,45,0.15))' }}
    >
      {/* Envelope body */}
      <rect x="2" y="40" width="276" height="158" rx="8" fill="#FFFAFA" stroke="#D6B477" strokeWidth="1.5" />

      {/* Back flap - animates */}
      <motion.path
        d="M 2,40 L 140,120 L 278,40 Z"
        fill="#FFF0F3"
        stroke="#D6B477"
        strokeWidth="1.5"
        animate={isOpening ? { d: "M 2,40 L 140,-30 L 278,40 Z" } : { d: "M 2,40 L 140,120 L 278,40 Z" }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: 'top' }}
      />

      {/* Left fold */}
      <path d="M 2,40 L 2,198 L 140,120 Z" fill="#FCE4EC" stroke="#D6B477" strokeWidth="1" />
      {/* Right fold */}
      <path d="M 278,40 L 278,198 L 140,120 Z" fill="#FCE4EC" stroke="#D6B477" strokeWidth="1" />
      {/* Bottom fold */}
      <path d="M 2,198 L 278,198 L 140,120 Z" fill="#FFF0F3" stroke="#D6B477" strokeWidth="1" />

      {/* Wax seal */}
      <motion.g
        animate={isOpening ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
        style={{ transformOrigin: '140px 140px' }}
        transition={{ duration: 0.3 }}
      >
        <circle cx="140" cy="140" r="22" fill="#A31632" />
        <circle cx="140" cy="140" r="18" fill="none" stroke="rgba(255,220,180,0.4)" strokeWidth="1" />
        <text x="140" y="145" textAnchor="middle" fill="rgba(255,220,180,0.9)" fontSize="16" fontFamily="serif">❦</text>
      </motion.g>

      {/* Letter sliding out */}
      <motion.g
        animate={isOpening ? { y: -60, opacity: 1 } : { y: 0, opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <rect x="40" y="60" width="200" height="130" rx="4" fill="#FDF8F0" stroke="#D6B477" strokeWidth="1" />
        <line x1="60" y1="90" x2="220" y2="90" stroke="#D6B477" strokeWidth="0.5" strokeOpacity="0.5" />
        <line x1="60" y1="105" x2="220" y2="105" stroke="#D6B477" strokeWidth="0.5" strokeOpacity="0.5" />
        <line x1="60" y1="120" x2="220" y2="120" stroke="#D6B477" strokeWidth="0.5" strokeOpacity="0.5" />
      </motion.g>
    </svg>
  )
}
