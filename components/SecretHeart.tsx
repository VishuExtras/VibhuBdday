'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/data/siteConfig'

export default function SecretHeart() {
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const revealMessage = () => {
    const msgs = siteConfig.secretMessages
    const random = msgs[Math.floor(Math.random() * msgs.length)]
    setMessage(random)
    setShowMessage(true)
    setClickCount(c => c + 1)
    setTimeout(() => setShowMessage(false), 4000)
  }

  return (
    <div className="secret-heart">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute bottom-14 left-0 glass rounded-2xl p-4 w-64 shadow-lg"
            style={{ border: '1px solid rgba(214,180,119,0.3)' }}
          >
            <p className="font-allura text-xl text-muted-rose leading-relaxed">
              {message}
            </p>
            <div className="mt-2 w-6 h-px bg-champagne-gold/50 mx-auto" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={revealMessage}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
        style={{
          background: 'rgba(255,250,250,0.9)',
          border: '1px solid rgba(214,180,119,0.4)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 2px 12px rgba(48,37,42,0.08)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Click for a secret message"
      >
        🤍
      </motion.button>
    </div>
  )
}
