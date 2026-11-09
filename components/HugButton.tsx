'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HugButton() {
  const [isHugging, setIsHugging] = useState(false)

  const triggerHug = () => {
    setIsHugging(true)
    setTimeout(() => setIsHugging(false), 4000)
  }

  return (
    <>
      {/* Hug overlay */}
      <AnimatePresence>
        {isHugging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center"
            style={{ background: 'rgba(252, 228, 236, 0.92)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-center px-8"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🤗
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-playfair text-3xl text-burgundy mb-4">
                  Aaja Gale lag ja meri jaan.
                </p>
                <p className="font-allura text-2xl text-muted-rose">
                  Very tightly. ♡
                </p>
              </motion.div>
              <motion.div
                className="text-5xl mt-6"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                ❤️
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hug Button */}
      <div className="hug-button hidden lg:block">
        <motion.button
          onClick={triggerHug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-dm"
          style={{
            background: 'rgba(255,250,250,0.9)',
            border: '1px solid rgba(214,180,119,0.4)',
            backdropFilter: 'blur(12px)',
            color: '#B76E79',
            boxShadow: '0 2px 12px rgba(48,37,42,0.08)',
          }}
          aria-label="Need a hug?"
        >
          🤗 <span>Need a hug?</span>
        </motion.button>
      </div>
    </>
  )
}
