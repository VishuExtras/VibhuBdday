'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EasterEggManagerProps {
  logoClickCount?: number
}

// Global easter egg messages
const secretNotes = [
  'Babu dhoondh liya tune, just like you found me. 🥺',
  'Babu you found it again, nice observation. ♡',
  'i love you babu, you found it, many blessings are on their way to you. 🤞🏻',
  'Hidden gems are found by some real gems, Vibhu it\'s you. ✦',
]

const starCompliments = [
  'Keep shining and growing, even without me Vibhuti. 🌟',
  'Babu sach kahu to you are gem of a person. ✨',
  'Hum dono apna ek constillation bnate hai, we\'ll name it... khair, you decide. 💫',
  'Stars are hot and so are you... Meri chhammak chhallo. 🔥',
  'Tujhse chand complex kha jaye, wo chandni hai tu. 🌙',
]

export default function EasterEggManager() {
  const [logoClicks, setLogoClicks] = useState(0)
  const [showSecretNote, setShowSecretNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [showStarMsg, setShowStarMsg] = useState(false)
  const [starMsg, setStarMsg] = useState('')
  const [easterEggsFound, setEasterEggsFound] = useState<Set<string>>(new Set())
  const clickTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Load found easter eggs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('easterEggsFound')
      if (saved) setEasterEggsFound(new Set(JSON.parse(saved)))
    } catch { }
  }, [])

  // Listen for custom events from other components
  useEffect(() => {
    const handleStarClick = () => {
      const msg = starCompliments[Math.floor(Math.random() * starCompliments.length)]
      setStarMsg(msg)
      setShowStarMsg(true)
      setTimeout(() => setShowStarMsg(false), 4000)
      markFound('star')
    }

    window.addEventListener('easterEgg:star', handleStarClick)
    return () => window.removeEventListener('easterEgg:star', handleStarClick)
  }, [])

  const markFound = (key: string) => {
    setEasterEggsFound(prev => {
      const next = new Set(prev)
      next.add(key)
      try { localStorage.setItem('easterEggsFound', JSON.stringify(Array.from(next))) } catch { }
      return next
    })
  }

  const handleLogoClick = () => {
    // Clear timer on each click
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    const next = logoClicks + 1
    setLogoClicks(next)

    if (next >= 5) {
      const note = secretNotes[Math.floor(Math.random() * secretNotes.length)]
      setNoteText(note)
      setShowSecretNote(true)
      setLogoClicks(0)
      markFound('logo')
      setTimeout(() => setShowSecretNote(false), 5000)
    } else {
      // Reset after 2 seconds of no clicks
      clickTimerRef.current = setTimeout(() => setLogoClicks(0), 2000)
    }
  }

  return (
    <>
      {/* Hidden clickable logo — bottom centre, very subtle */}
      <motion.button
        onClick={handleLogoClick}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] opacity-0 hover:opacity-100 transition-opacity duration-500 focus:opacity-100"
        style={{ width: 32, height: 32 }}
        aria-label="Secret button"
        title={logoClicks > 0 ? `${5 - logoClicks} more...` : ''}
      >
        <span className="font-allura text-champagne-gold text-lg">♡</span>
      </motion.button>

      {/* Secret note popup (logo easter egg) */}
      <AnimatePresence>
        {showSecretNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[400] w-72 max-w-[90vw]"
          >
            <div
              className="glass rounded-2xl p-6 text-center shadow-xl"
              style={{ border: '1px solid rgba(214,180,119,0.4)' }}
            >
              <div className="text-3xl mb-3">🔮</div>
              <p className="font-playfair italic text-warm-charcoal/80 text-sm leading-relaxed">
                {noteText}
              </p>
              <div className="mt-3 w-8 h-px bg-champagne-gold/50 mx-auto" />
              <p className="font-dm text-xs text-champagne-gold mt-2 tracking-widest">
                SECRET FOUND ✦
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star compliment popup */}
      <AnimatePresence>
        {showStarMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[400] w-72 max-w-[90vw]"
          >
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: 'rgba(26,10,18,0.95)',
                border: '1px solid rgba(214,180,119,0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="text-2xl mb-2">✨</div>
              <p className="font-allura text-xl leading-relaxed" style={{ color: '#D6B477' }}>
                {starMsg}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

