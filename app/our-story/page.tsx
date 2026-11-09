'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import PageTransition from '@/components/PageTransition'
import { siteConfig } from '@/data/siteConfig'
import { useProgress } from '@/components/useProgress'

export default function OurStoryPage() {
  useProgress()
  const router = useRouter()
  // Start with all cards already showing the handwritten note side (flipped)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(
    () => new Set(siteConfig.timeline.map((_, i) => i))
  )

  const toggleFlip = (i: number) => {
    setFlippedCards(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <PageTransition>
      <div
        className="min-h-screen relative"
        style={{ background: 'linear-gradient(180deg, #FFFAFA 0%, #FFF0F3 50%, #FCE4EC 100%)' }}
      >
        {/* Background texture */}
        <div
          className="fixed inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #FCE4EC 0%, transparent 60%), radial-gradient(circle at 80% 80%, #FFF0F3 0%, transparent 60%)`,
          }}
          aria-hidden
        />

        {/* Hero Section */}
        <div className="relative z-10 text-center px-6 py-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-dm text-xs tracking-[0.4em] text-champagne-gold uppercase mb-4">
              Chapter by chapter
            </p>
            <h1
              className="font-cormorant font-light leading-tight mb-6"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: '#30252A' }}
            >
              Our Story
            </h1>
            <div className="w-24 h-px bg-champagne-gold mx-auto mb-6" />
            <p className="font-playfair italic text-warm-charcoal/60 max-w-md mx-auto text-lg leading-relaxed">
              "Some stories are written in chapters.<br />
              Hmari ka to Novel ban sakta hai."
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ background: 'linear-gradient(180deg, transparent, #D6B477 10%, #D6B477 90%, transparent)', transform: 'translateX(-50%)' }}
            aria-hidden
          />

          {siteConfig.timeline.map((memory, i) => (
            <TimelineCard
              key={i}
              memory={memory}
              index={i}
              isFlipped={flippedCards.has(i)}
              onFlip={() => toggleFlip(i)}
              side={i % 2 === 0 ? 'left' : 'right'}
            />
          ))}

          {/* Ending quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-20 relative"
          >
            <div className="section-divider mb-10">
              <span className="font-dm text-xs tracking-widest text-champagne-gold uppercase">And yet</span>
            </div>
            <p className="font-allura text-4xl text-burgundy mb-4">
              "Some stories are written in chapters.
            </p>
            <p className="font-allura text-4xl text-muted-rose mb-8">
              Hmari ka to Novel ban skta hai."
            </p>

            <motion.button
              onClick={() => router.push('/museum')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase"
              style={{
                background: '#A31632',
                color: '#FFFAFA',
                boxShadow: '0 8px 30px rgba(163,22,50,0.25)',
              }}
            >
              The Museum ♡
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

interface TimelineCardProps {
  memory: typeof import('@/data/siteConfig').siteConfig.timeline[0]
  index: number
  isFlipped: boolean
  onFlip: () => void
  side: 'left' | 'right'
}

function TimelineCard({ memory, index, isFlipped, onFlip, side }: TimelineCardProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={`relative mb-12 md:mb-16 flex ${side === 'left' ? 'md:justify-start' : 'md:justify-end'}`}
    >
      {/* Center dot */}
      <div
        className="hidden md:block absolute left-1/2 top-8 w-4 h-4 rounded-full border-2 border-champagne-gold z-10"
        style={{ background: '#FFFAFA', transform: 'translateX(-50%)' }}
        aria-hidden
      />

      {/* Card */}
      <div
        className="card-3d w-full md:w-5/12 cursor-pointer"
        style={{ minHeight: '200px' }}
        onClick={onFlip}
      >
        <div className={`card-inner ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '200px' }}>
          {/* Front */}
          <div
            className="card-face paper-texture p-6 rounded-xl"
            style={{ border: '1px solid rgba(214,180,119,0.3)', boxShadow: '0 4px 20px rgba(48,37,42,0.08)' }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{memory.emoji}</span>
              <div className="flex-1">
                <p className="font-dm text-xs tracking-widest text-champagne-gold uppercase mb-1">
                  {memory.chapter}
                </p>
                <h3
                  className="font-cormorant font-medium mb-2 leading-tight"
                  style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: '#30252A' }}
                >
                  {memory.title}
                </h3>
                {memory.date && (
                  <p className="font-dm text-xs text-muted-rose mb-3">📅 {memory.date}</p>
                )}
                <p className="font-dm text-sm text-warm-charcoal/70 leading-relaxed">
                  {memory.description}
                </p>
              </div>
            </div>
            {/* <p className="font-dm text-xs text-warm-charcoal/30 mt-4 text-right">
              Tap to read more ↩
            </p> */}
          </div>

          {/* Back */}
          <div
            className="card-face card-back flex flex-col items-center justify-center p-8 text-center rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #FCE4EC, #FFF0F3)',
              border: '1px solid rgba(214,180,119,0.4)',
            }}
          >
            <div className="text-4xl mb-4">💌</div>
            <p className="font-allura text-2xl text-burgundy leading-relaxed">
              {memory.handwrittenNote}
            </p>
            <div className="mt-4 w-16 h-px bg-champagne-gold/50" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
