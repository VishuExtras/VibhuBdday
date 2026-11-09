'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PageTransition from '@/components/PageTransition'
import { siteConfig } from '@/data/siteConfig'
import { useProgress } from '@/components/useProgress'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  clickable: boolean
}

export default function FuturePage() {
  useProgress()
  const router = useRouter()
  const [activeDream, setActiveDream] = useState<number | null>(null)
  const [stars, setStars] = useState<Star[]>([])
  const [jarWishIndex, setJarWishIndex] = useState(0)
  const [showWish, setShowWish] = useState(false)
  const [wishText, setWishText] = useState('')

  useEffect(() => {
    const s = Array.from({ length: 65 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      // A few stars are "clickable" easter eggs
      clickable: i < 5,
    }))
    setStars(s)
  }, [])

  const handleStarClick = useCallback(() => {
    // Fire the easter egg event for EasterEggManager to handle
    window.dispatchEvent(new CustomEvent('easterEgg:star'))
  }, [])

  const openWish = () => {
    const wishes = siteConfig.birthdayWishes
    const index = jarWishIndex % wishes.length
    setWishText(wishes[index])
    setJarWishIndex(i => i + 1)
    setShowWish(true)
    setTimeout(() => setShowWish(false), 4000)
  }

  return (
    <PageTransition>
      <div
        className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a0a12 0%, #2d1420 30%, #3d1f2b 60%, #2a1018 100%)' }}
      >
        {/* Stars — some clickable (easter egg) */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          {/* Constellation connecting lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
            {stars.length > 10 && [
              [0, 2], [2, 4], [4, 1], [1, 3],
              [5, 7], [7, 9], [9, 6],
              [10, 12], [12, 14], [14, 11],
            ].map(([a, b], i) => stars[a] && stars[b] ? (
              <line
                key={i}
                x1={`${stars[a].x}%`} y1={`${stars[a].y}%`}
                x2={`${stars[b].x}%`} y2={`${stars[b].y}%`}
                stroke="#D6B477" strokeWidth="0.5"
              />
            ) : null)}
          </svg>

          {stars.map(star => (
            star.clickable ? (
              // Clickable easter-egg star — slightly larger, with hover glow
              <motion.button
                key={star.id}
                className="absolute rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size + 6,
                  height: star.size + 6,
                  background: '#D6B477',
                  opacity: star.opacity + 0.2,
                  cursor: 'pointer',
                }}
                animate={{ opacity: [star.opacity + 0.2, 1, star.opacity + 0.2], scale: [1, 1.8, 1] }}
                transition={{ duration: 2 + star.id * 0.3, repeat: Infinity, delay: star.id * 0.5 }}
                onClick={handleStarClick}
                whileHover={{ scale: 2.5, boxShadow: '0 0 12px 4px rgba(214,180,119,0.6)' }}
                aria-label="A special star ✨"
              />
            ) : (
              <motion.div
                key={star.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  background: '#D6B477',
                  opacity: star.opacity,
                }}
                animate={{ opacity: [star.opacity, star.opacity * 2, star.opacity], scale: [1, 1.5, 1] }}
                transition={{ duration: Math.random() * 4 + 2, repeat: Infinity, delay: Math.random() * 4 }}
              />
            )
          ))}
        </div>

        {/* Soft gradient overlay at top and bottom */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,250,250,0.05), transparent)' }}
          aria-hidden
        />

        {/* Dreams Section */}
        <div className="relative z-10 text-center px-6 py-24 pb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-dm text-xs tracking-[0.4em] text-champagne-gold uppercase mb-4">
              Somewhere in tomorrow
            </p>
            <h1
              className="font-cormorant font-light leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', color: '#FFF0F3' }}
            >
              Things I Haven't Experienced Yet,
            </h1>
            <h2
              className="font-playfair italic mb-6"
              style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', color: '#D6B477' }}
            >
              But Hope To Experience With You.
            </h2>
            <div className="w-24 h-px bg-champagne-gold mx-auto mb-4 opacity-50" />
          </motion.div>
        </div>

        {/* Dream constellation / cards */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.futureDreams.map((dream, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="cursor-pointer rounded-xl p-6 transition-all duration-300"
                style={{
                  background: activeDream === i
                    ? 'rgba(163,22,50,0.2)'
                    : 'rgba(255,250,250,0.06)',
                  border: `1px solid ${activeDream === i ? 'rgba(214,180,119,0.6)' : 'rgba(214,180,119,0.15)'}`,
                  backdropFilter: 'blur(12px)',
                }}
                onClick={() => setActiveDream(activeDream === i ? null : i)}
              >
                <div className="text-4xl mb-4">{dream.icon}</div>
                <h3
                  className="font-cormorant text-xl mb-3 leading-tight"
                  style={{ color: '#FFF0F3' }}
                >
                  {dream.title}
                </h3>
                <p className="font-dm text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,240,243,0.6)' }}>
                  {dream.description}
                </p>

                <AnimatePresence>
                  {activeDream === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 border-t border-champagne-gold/20">
                        <p className="font-allura text-xl" style={{ color: '#D6B477' }}>
                          {dream.message}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {activeDream !== i && (
                  <p className="font-dm text-xs" style={{ color: 'rgba(214,180,119,0.5)' }}>
                    Tap to explore ✦
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Ending quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-20 mb-20"
          >
            <p className="font-playfair italic text-xl mb-2" style={{ color: 'rgba(255,240,243,0.7)' }}>
              "Mein kal ke baare mein sab kuch to nhi janta.
            </p>
            <p className="font-allura text-3xl" style={{ color: '#D6B477' }}>
              But I know ki uss kal mein mere sath kon hai."
            </p>
          </motion.div>

          {/* Birthday Wishes Jar */}
          <BirthdayJar onPickWish={openWish} wishText={wishText} showWish={showWish} />

          {/* Continue */}
          <div className="text-center mt-16">
            <motion.button
              onClick={() => router.push('/letter')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase"
              style={{ background: '#A31632', color: '#FFFAFA', boxShadow: '0 8px 30px rgba(163,22,50,0.4)' }}
            >
              Read My Letter To You ♡
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function BirthdayJar({ onPickWish, wishText, showWish }: { onPickWish: () => void; wishText: string; showWish: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-sm mx-auto"
    >
      <div
        className="rounded-2xl p-8 mb-6"
        style={{
          background: 'rgba(255,250,250,0.06)',
          border: '1px solid rgba(214,180,119,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <h3 className="font-cormorant text-2xl mb-2" style={{ color: '#FFF0F3' }}>
          Birthday Wishes Jar
        </h3>
        <p className="font-dm text-sm mb-6" style={{ color: 'rgba(255,240,243,0.5)' }}>
          Pick a little wish, birthday girl.
        </p>

        {/* Jar SVG */}
        <div className="flex justify-center mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={onPickWish}
          >
            <JarSVG />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {showWish ? (
            <motion.div
              key="wish"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="rounded-xl p-5"
              style={{
                background: 'rgba(252,228,236,0.15)',
                border: '1px solid rgba(214,180,119,0.3)',
              }}
            >
              <div className="text-2xl mb-3">✨</div>
              <p className="font-allura text-2xl" style={{ color: '#D6B477' }}>
                {wishText}
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="pick"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onPickWish}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-full font-dm text-sm tracking-widest uppercase"
              style={{
                background: 'rgba(214,180,119,0.2)',
                border: '1px solid rgba(214,180,119,0.4)',
                color: '#D6B477',
              }}
            >
              Pick a Wish 🎀
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function JarSVG() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Jar lid */}
      <rect x="30" y="10" width="60" height="20" rx="4" fill="rgba(214,180,119,0.6)" stroke="#D6B477" strokeWidth="1.5" />
      <rect x="22" y="22" width="76" height="8" rx="2" fill="rgba(214,180,119,0.8)" />
      {/* Jar body */}
      <path d="M 25 30 Q 20 35 18 50 L 15 110 Q 14 125 60 128 Q 106 125 105 110 L 102 50 Q 100 35 95 30 Z"
        fill="rgba(255,250,250,0.15)" stroke="rgba(255,250,250,0.4)" strokeWidth="1.5" />
      {/* Notes inside */}
      {[
        { x: 35, y: 60, r: 15, fill: '#FCE4EC', rot: -20 },
        { x: 70, y: 55, r: 12, fill: '#FFF0F3', rot: 15 },
        { x: 50, y: 75, r: 14, fill: '#D6B477', rot: -10 },
        { x: 75, y: 80, r: 11, fill: '#FCE4EC', rot: 25 },
        { x: 30, y: 85, r: 13, fill: '#FFF0F3', rot: -30 },
        { x: 60, y: 95, r: 12, fill: '#B76E79', rot: 10 },
      ].map((note, i) => (
        <motion.ellipse
          key={i}
          cx={note.x}
          cy={note.y}
          rx={note.r}
          ry={note.r * 0.6}
          fill={note.fill}
          fillOpacity="0.8"
          animate={{ y: [0, -3, 0], rotate: [note.rot, note.rot + 5, note.rot] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${note.x}px ${note.y}px` }}
        />
      ))}
      {/* Shine */}
      <ellipse cx="38" cy="50" rx="6" ry="12" fill="rgba(255,255,255,0.1)" />
    </svg>
  )
}
