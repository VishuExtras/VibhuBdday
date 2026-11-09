'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PageTransition from '@/components/PageTransition'
import { siteConfig } from '@/data/siteConfig'
import { useProgress } from '@/components/useProgress'

export default function LetterPage() {
  useProgress()
  const router = useRouter()
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'reading' | 'finished'>('sealed')
  const [displayedText, setDisplayedText] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const letterLines = siteConfig.loveLetter.split('\n')

  const openLetter = () => {
    setPhase('opening')
    setTimeout(() => setPhase('reading'), 1200)
  }

  useEffect(() => {
    if (phase !== 'reading') return

    let charIndex = 0
    let currentText = ''

    const type = () => {
      const fullText = letterLines.join('\n')
      if (charIndex < fullText.length) {
        currentText += fullText[charIndex]
        setDisplayedText(currentText)
        charIndex++
        // Vary speed for natural typing
        const delay = fullText[charIndex - 1] === '\n' ? 150 : fullText[charIndex - 1] === '.' ? 100 : 25
        intervalRef.current = setTimeout(type, delay)
      } else {
        setTimeout(() => setPhase('finished'), 800)
      }
    }

    intervalRef.current = setTimeout(type, 500)
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current) }
  }, [phase])

  const skipTyping = () => {
    if (intervalRef.current) clearTimeout(intervalRef.current)
    setDisplayedText(siteConfig.loveLetter)
    setPhase('finished')
  }

  return (
    <PageTransition>
      <div
        className="min-h-screen relative flex items-center justify-center overflow-hidden px-6 py-24"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, #FFF0F3 0%, #FFFAFA 50%, #FCE4EC 100%)',
        }}
      >
        {/* Decorative roses */}
        <div className="absolute top-12 left-6 text-5xl opacity-20 rotate-[-15deg]" aria-hidden>🌹</div>
        <div className="absolute top-12 right-6 text-5xl opacity-20 rotate-[15deg]" aria-hidden>🌹</div>
        <div className="absolute bottom-12 left-6 text-4xl opacity-15 rotate-[10deg]" aria-hidden>🌸</div>
        <div className="absolute bottom-12 right-6 text-4xl opacity-15 rotate-[-10deg]" aria-hidden>🌸</div>

        {/* Floral corners */}
        {['top-6 left-6', 'top-6 right-6 rotate-90', 'bottom-6 left-6 -rotate-90', 'bottom-6 right-6 rotate-180'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-20 h-20 opacity-20`} aria-hidden>
            <svg viewBox="0 0 80 80" fill="none">
              <path d="M5,5 Q20,0 40,5 Q60,10 75,5" stroke="#D6B477" strokeWidth="1.5" fill="none"/>
              <path d="M5,5 Q0,20 5,40 Q10,60 5,75" stroke="#D6B477" strokeWidth="1.5" fill="none"/>
              <circle cx="5" cy="5" r="3" fill="#D6B477"/>
              <circle cx="40" cy="5" r="2" fill="#B76E79"/>
            </svg>
          </div>
        ))}

        <div className="relative z-10 w-full max-w-2xl mx-auto">
          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="font-dm text-xs tracking-[0.4em] text-champagne-gold uppercase mb-3">
              A letter, written from the heart
            </p>
            <h1
              className="font-cormorant font-light"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#30252A' }}
            >
              The Love Letter
            </h1>
            <div className="w-24 h-px bg-champagne-gold mx-auto mt-4" />
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === 'sealed' && (
              <motion.div
                key="sealed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                {/* Sealed envelope card */}
                <div
                  className="paper-texture rounded-xl p-10 mb-8 cursor-pointer relative overflow-hidden"
                  style={{
                    border: '1px solid rgba(214,180,119,0.4)',
                    boxShadow: '0 12px 48px rgba(100,23,45,0.1)',
                  }}
                  onClick={openLetter}
                >
                  {/* Letter lines (decorative) */}
                  <div className="letter-lines h-32 mb-6 opacity-50 rounded" />
                  <div className="flex justify-center">
                    <div className="wax-seal">❦</div>
                  </div>
                </div>
                <p className="font-allura text-2xl text-muted-rose mb-4">
                  A letter, written for you.
                </p>
                <motion.button
                  onClick={openLetter}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase"
                  style={{ background: '#A31632', color: '#FFFAFA', boxShadow: '0 8px 30px rgba(163,22,50,0.25)' }}
                >
                  Open The Letter ♡
                </motion.button>
              </motion.div>
            )}

            {phase === 'opening' && (
              <motion.div
                key="opening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: 1 }}
                  className="text-6xl mb-6"
                >
                  💌
                </motion.div>
                <p className="font-allura text-2xl text-muted-rose">Opening...</p>
              </motion.div>
            )}

            {(phase === 'reading' || phase === 'finished') && (
              <motion.div
                key="reading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                {/* Skip button */}
                {phase === 'reading' && (
                  <button
                    onClick={skipTyping}
                    className="absolute top-0 right-0 font-dm text-xs text-warm-charcoal/30 hover:text-warm-charcoal/60 transition-colors z-10"
                  >
                    Skip →
                  </button>
                )}

                {/* Letter paper */}
                <div
                  className="paper-texture rounded-xl p-8 md:p-12 relative"
                  style={{
                    border: '1px solid rgba(214,180,119,0.3)',
                    boxShadow: '0 12px 48px rgba(100,23,45,0.08)',
                    minHeight: '400px',
                  }}
                >
                  {/* Decorative top */}
                  <div className="text-center mb-8">
                    <div className="wax-seal mx-auto mb-4">❦</div>
                    <div className="w-full h-px bg-champagne-gold/30" />
                  </div>

                  {/* Letter content */}
                  <div className="letter-lines min-h-80">
                    <p
                      className="font-allura text-xl text-warm-charcoal/80 leading-relaxed whitespace-pre-wrap"
                      style={{ lineHeight: '2.1' }}
                    >
                      {displayedText}
                      {phase === 'reading' && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-0.5 h-5 bg-muted-rose ml-1 align-middle"
                        />
                      )}
                    </p>
                  </div>
                </div>

                {/* Finished state */}
                <AnimatePresence>
                  {phase === 'finished' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-center mt-10"
                    >
                      <p className="font-allura text-3xl text-burgundy mb-3">
                        "There's one more thing I have been wanting to ask you..."
                      </p>
                      <div className="text-4xl mb-6">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          💍
                        </motion.span>
                      </div>
                      <motion.button
                        onClick={() => router.push('/forever')}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase"
                        style={{ background: '#A31632', color: '#FFFAFA', boxShadow: '0 8px 30px rgba(163,22,50,0.3)' }}
                      >
                        One Last Question ♡
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}
