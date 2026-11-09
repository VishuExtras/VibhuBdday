'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'
import FloatingPetals from '@/components/FloatingPetals'
import { siteConfig } from '@/data/siteConfig'
import { useProgress } from '@/components/useProgress'

type Phase = 'proposal' | 'yes' | 'no'

const PROPOSAL_LINES = siteConfig.proposal.lines

export default function ForeverPage() {
  useProgress()
  const [phase, setPhase] = useState<Phase>('proposal')
  const [lineIndex, setLineIndex] = useState(0)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([])
  const [balloons, setBalloons] = useState<{ id: number; x: number; color: string; delay: number }[]>([])
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number }[]>([])
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Proposal text sequencing
  useEffect(() => {
    if (phase !== 'proposal') return
    if (lineIndex < PROPOSAL_LINES.length) {
      const timer = setTimeout(() => setLineIndex(i => i + 1), 2500)
      return () => clearTimeout(timer)
    } else {
      const t1 = setTimeout(() => setShowQuestion(true), 600)
      const t2 = setTimeout(() => setShowButtons(true), 1800)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [lineIndex, phase])

  const handleYes = async () => {
    setPhase('yes')
    // Generate fireworks
    setFireworks(Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      color: ['#D6B477', '#FCE4EC', '#A31632', '#B76E79', '#FFF0F3'][i % 5],
    })))
    // Generate balloons
    setBalloons(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      color: ['#FCE4EC', '#D6B477', '#B76E79', '#FFF0F3', '#A31632', '#64172D'][i % 6],
      delay: i * 0.2,
    })))
    // Generate hearts
    setHearts(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
    })))

    try {
      const { default: confetti } = await import('canvas-confetti')
      // Initial burst
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#D6B477', '#FCE4EC', '#A31632', '#B76E79'] })
      // Ongoing
      const end = Date.now() + 6000
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#D6B477', '#FCE4EC', '#A31632'] })
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#D6B477', '#FCE4EC', '#A31632'] })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    } catch { }
  }

  const handleNo = () => setPhase('no')

  const handleRetry = () => {
    setPhase('proposal')
    setLineIndex(0)
    setShowQuestion(false)
    setShowButtons(false)
    setFireworks([])
    setBalloons([])
    setHearts([])
  }

  return (
    <PageTransition>
      <AnimatePresence mode="wait">
        {phase === 'proposal' && (
          <ProposalScene
            key="proposal"
            lineIndex={lineIndex}
            showQuestion={showQuestion}
            showButtons={showButtons}
            onYes={handleYes}
            onNo={handleNo}
          />
        )}

        {phase === 'yes' && (
          <YesScene
            key="yes"
            fireworks={fireworks}
            balloons={balloons}
            hearts={hearts}
            onReplay={handleRetry}
          />
        )}

        {phase === 'no' && (
          <NoScene key="no" onRetry={handleRetry} />
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

// ── PROPOSAL SCENE ────────────────────────────────────────────
function ProposalScene({
  lineIndex,
  showQuestion,
  showButtons,
  onYes,
  onNo,
}: {
  lineIndex: number
  showQuestion: boolean
  showButtons: boolean
  onYes: () => void
  onNo: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex items-center justify-center overflow-hidden px-6 py-24"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #FFF0F3 0%, #FFFAFA 40%, #FCE4EC 100%)' }}
    >
      <FloatingPetals count={16} colors={['#FCE4EC', '#B76E79', '#FFF0F3', '#D6B477']} />

      {/* Gold particle dots */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: '#D6B477',
              opacity: 0.4,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 4 }}
          />
        ))}
      </div>

      {/* Floral border decorations */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-30" aria-hidden>
        <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
          <path d="M 0,20 Q 25,5 50,20 Q 75,35 100,20 Q 125,5 150,20 Q 175,35 200,20" stroke="#D6B477" strokeWidth="1.5" fill="none" />
          {[0, 50, 100, 150, 200].map(x => (
            <circle key={x} cx={x} cy="20" r="3" fill="#B76E79" fillOpacity="0.6" />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center">
        {/* Sequential proposal lines */}
        <div className="mb-12 space-y-6">
          {PROPOSAL_LINES.map((line, i) => (
            <AnimatePresence key={i}>
              {lineIndex > i && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="whitespace-pre-line"
                  style={{
                    fontFamily: i === 1 ? 'Cormorant Garamond, serif' : 'Playfair Display, serif',
                    fontSize: i === 1
                      ? 'clamp(1.4rem, 4vw, 2rem)'
                      : 'clamp(1rem, 3vw, 1.4rem)',
                    color: i === 1 ? '#A31632' : '#30252A',
                    fontStyle: i !== 1 ? 'italic' : 'normal',
                    fontWeight: i === 1 ? '500' : '400',
                    opacity: 0.9,
                    lineHeight: 1.5,
                  }}
                >
                  {line}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* The Question */}
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="mb-12"
            >
              <div className="w-24 h-px bg-champagne-gold mx-auto mb-8" />
              <h1
                className="font-cormorant font-medium leading-tight mb-4"
                style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)', color: '#A31632' }}
              >
                {siteConfig.proposal.question}
              </h1>
              <motion.div
                className="text-5xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💍
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* YES / NO Buttons */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                onClick={onYes}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="yes-button-pulse px-10 py-5 rounded-full font-dm text-sm tracking-widest uppercase w-full sm:w-auto"
                style={{
                  background: '#A31632',
                  color: '#FFFAFA',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
                aria-label="Yes!"
              >
                {siteConfig.proposal.yesButton}
              </motion.button>

              <motion.button
                onClick={onNo}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-full font-dm text-sm transition-colors"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(48,37,42,0.2)',
                  color: 'rgba(48,37,42,0.4)',
                }}
                aria-label="No"
              >
                {siteConfig.proposal.noButton}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── YES SCENE ─────────────────────────────────────────────────
function YesScene({
  fireworks,
  balloons,
  hearts,
  onReplay,
}: {
  fireworks: { id: number; x: number; y: number; color: string }[]
  balloons: { id: number; x: number; color: string; delay: number }[]
  hearts: { id: number; x: number; delay: number }[]
  onReplay: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 20%, #FFF0F3 0%, #FFFAFA 40%, #FCE4EC 100%)' }}
    >
      {/* Fireworks */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        {fireworks.map(fw => (
          <motion.div
            key={fw.id}
            className="absolute w-4 h-4 rounded-full"
            style={{ left: `${fw.x}%`, top: `${fw.y}%`, background: fw.color }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 3, 0], opacity: [1, 0.8, 0] }}
            transition={{ duration: 1.5, delay: Math.random() * 2, repeat: 3 }}
          />
        ))}

        {/* Rising balloons */}
        {balloons.map(balloon => (
          <motion.div
            key={balloon.id}
            className="absolute bottom-0"
            style={{ left: `${balloon.x}%` }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-20vh', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 6, delay: balloon.delay, repeat: Infinity, repeatDelay: 3 }}
          >
            <BalloonShape color={balloon.color} size={40 + Math.random() * 30} />
          </motion.div>
        ))}

        {/* Floating hearts */}
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="absolute text-2xl"
            style={{ left: `${heart.x}%`, bottom: '-10%' }}
            initial={{ y: '0', opacity: 0 }}
            animate={{ y: '-110vh', opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: 8, delay: heart.delay, repeat: Infinity, repeatDelay: 5 }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Floating petals */}
      <FloatingPetals count={20} colors={['#FCE4EC', '#B76E79', '#FFF0F3', '#D6B477', '#A31632']} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center">
        {/* Flash effect on enter */}
        <motion.div
          className="fixed inset-0 bg-white pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* SHE SAID YES heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          className="mb-8"
        >
          <div className="text-5xl md:text-7xl mb-4">🎉💍🎉</div>
          <h1
            className="font-cormorant font-medium leading-tight mb-4"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', color: '#A31632' }}
          >
            {siteConfig.proposal.celebrationHeading}
          </h1>
          <p
            className="font-playfair italic"
            style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', color: '#64172D' }}
          >
            {siteConfig.proposal.celebrationSubheading}
          </p>
        </motion.div>

        <div className="w-32 h-px bg-champagne-gold mx-auto mb-10" />

        {/* Photograph frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-10 relative"
          style={{ maxWidth: '400px', width: '100%' }}
        >
          <div
            className="polaroid relative overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(163,22,50,0.2), 0 4px 16px rgba(48,37,42,0.1)',
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded"
              style={{ background: 'radial-gradient(ellipse, rgba(214,180,119,0.3), transparent)' }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div
              className="w-full bg-blush flex items-center justify-center rounded"
              style={{ aspectRatio: '4/3' }}
            >
              {siteConfig.photos.proposalPhoto.includes('[ADD') ? (
                <div className="text-center p-8">
                  <div className="text-5xl mb-3">📸</div>
                  <p className="font-dm text-xs text-warm-charcoal/50 max-w-xs">
                    Add your special photo here
                  </p>
                  <p className="font-dm text-xs text-champagne-gold mt-2">
                    /public/images/proposal/proposal-photo.jpg
                  </p>
                </div>
              ) : (
                <img
                  src={siteConfig.photos.proposalPhoto}
                  alt="Our special moment"
                  className="w-full h-full object-contain rounded"
                />
              )}
            </div>
            <p className="font-allura text-2xl text-warm-charcoal/70 text-center mt-3">
              Us. Forever. ♡
            </p>
          </div>

          {/* Decorative flowers */}
          <div className="absolute -top-4 -left-4 text-3xl -rotate-45" aria-hidden>🌸</div>
          <div className="absolute -top-4 -right-4 text-3xl rotate-45" aria-hidden>🌸</div>
          {/* <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl" aria-hidden>🌹</div> */}
        </motion.div>

        {/* Wedding environment text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="max-w-md mx-auto mb-10"
        >
          <p className="font-playfair italic text-warm-charcoal/70 text-lg mb-4 leading-relaxed">
            "{siteConfig.proposal.celebrationQuote}"
          </p>
          <p className="font-playfair italic text-warm-charcoal/70 text-lg mb-6 leading-relaxed">
            "{siteConfig.proposal.celebrationQuote2}"
          </p>

          <div className="w-16 h-px bg-champagne-gold mx-auto mb-6" />

          <motion.h2
            className="font-cormorant font-medium text-3xl md:text-4xl"
            style={{ color: '#A31632' }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {siteConfig.proposal.finalDeclaration}
          </motion.h2>
        </motion.div>

        {/* Wedding bells */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-4xl mb-8 flex gap-4 justify-center"
        >
          <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1, repeat: Infinity }}>🔔</motion.span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>💍</motion.span>
          <motion.span animate={{ rotate: [10, -10, 10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}>🔔</motion.span>
        </motion.div>

        {/* Replay button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          onClick={onReplay}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-3 rounded-full font-dm text-xs tracking-widest uppercase"
          style={{
            background: 'transparent',
            border: '1px solid rgba(214,180,119,0.5)',
            color: 'rgba(48,37,42,0.4)',
          }}
        >
          ↺ Replay the magic
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── NO SCENE ──────────────────────────────────────────────────
function NoScene({ onRetry }: { onRetry: () => void }) {
  const [textIndex, setTextIndex] = useState(0)

  const noTexts = [
    'Well...',
    "Tere bina mera jeevan aisa hi hai.",
    'Just darkness.',
    'Okay, I\'ll be here again whenever you\'re ready. ❤️',
  ]

  useEffect(() => {
    if (textIndex < noTexts.length - 1) {
      const timer = setTimeout(() => setTextIndex(i => i + 1), 2000)
      return () => clearTimeout(timer)
    }
  }, [textIndex])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-md mx-auto">
        {noTexts.slice(0, textIndex + 1).map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
            style={{
              fontFamily: i === 0 ? 'Cormorant Garamond, serif' : i === 2 ? 'DM Sans, sans-serif' : 'Playfair Display, serif',
              fontSize: i === 0 ? 'clamp(2rem, 6vw, 3.5rem)' : i === 2 ? '0.875rem' : 'clamp(1rem, 3vw, 1.3rem)',
              color: i === 2 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
              fontStyle: i === 1 || i === 3 ? 'italic' : 'normal',
              letterSpacing: i === 2 ? '0.2em' : 'normal',
              fontWeight: i === 0 ? 300 : 400,
            }}
          >
            {text}
          </motion.p>
        ))}

        {textIndex === noTexts.length - 1 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase"
            style={{ background: '#A31632', color: '#FFFAFA', boxShadow: '0 8px 30px rgba(163,22,50,0.5)' }}
          >
            LET ME TRY AGAIN ♡
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

function BalloonShape({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 60 90" fill="none">
      <ellipse cx="30" cy="30" rx="22" ry="26" fill={color} />
      <ellipse cx="22" cy="18" rx="6" ry="4" fill="rgba(255,255,255,0.4)" />
      <path d="M 30 56 Q 28 65 32 70 Q 36 75 30 80 Q 24 85 30 90" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="30" cy="56" r="3" fill={color} />
    </svg>
  )
}
