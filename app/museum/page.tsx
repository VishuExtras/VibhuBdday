'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { X, ZoomIn } from 'lucide-react'
import PageTransition from '@/components/PageTransition'
import { siteConfig } from '@/data/siteConfig'
import { useProgress } from '@/components/useProgress'

const galleries = [
  { id: 'smile', title: 'Her Smile', subtitle: 'Gallery 01', emoji: '🌸', photos: siteConfig.photos.gallery.herSmile },
  { id: 'favourite', title: 'My Favourite Human', subtitle: 'Gallery 02', emoji: '💫', photos: siteConfig.photos.gallery.favouriteHuman },
  { id: 'moments', title: 'Our Little Moments', subtitle: 'Gallery 03', emoji: '📸', photos: siteConfig.photos.gallery.ourMoments },
  { id: 'forever', title: 'My Forever Favourite', subtitle: 'Gallery 04', emoji: '❤️', photos: siteConfig.photos.gallery.foreverFavourite },
]

type Photo = { src: string; caption: string; focal?: string }

const hiddenNotes = [
  'Every time I look at this photograph, I fall a little more. ♡',
  'This moment lives in my heart rent-free. Forever. 💫',
  'I keep coming back to this one. I always will. ✨',
  'If I could frame one memory, it might just be this one. 🌸',
  'You have no idea how beautiful you are. But I do. 💕',
  'This is one of my favourite versions of you. 🌟',
  'Some photos don\'t need captions. This is one of them. ❤️',
]

export default function MuseumPage() {
  useProgress()
  const router = useRouter()
  const [lightbox, setLightbox] = useState<{ photo: Photo; galleryTitle: string } | null>(null)
  const [activeGallery, setActiveGallery] = useState<string | null>(null)
  const [showHiddenNote, setShowHiddenNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const noteTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Show hidden note 2.5s after lightbox opens
  useEffect(() => {
    if (lightbox) {
      setShowHiddenNote(false)
      noteTimerRef.current = setTimeout(() => {
        setNoteText(hiddenNotes[Math.floor(Math.random() * hiddenNotes.length)])
        setShowHiddenNote(true)
      }, 2500)
    } else {
      setShowHiddenNote(false)
      if (noteTimerRef.current) clearTimeout(noteTimerRef.current)
    }
    return () => { if (noteTimerRef.current) clearTimeout(noteTimerRef.current) }
  }, [lightbox])

  return (
    <PageTransition>
      <div
        className="min-h-screen relative"
        style={{ background: 'linear-gradient(180deg, #FFFAFA 0%, #FFF0F3 50%, #FCE4EC 100%)' }}
      >
        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] flex items-center justify-center p-6"
              style={{ background: 'rgba(48,37,42,0.92)', backdropFilter: 'blur(12px)' }}
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="relative max-w-2xl w-full"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 text-ivory"
                  style={{ background: '#A31632' }}
                  aria-label="Close lightbox"
                >
                  <X size={18} />
                </button>
                <div className="polaroid">
                  <div
                    className="w-full bg-blush flex items-center justify-center rounded"
                    style={{ aspectRatio: '4/3' }}
                  >
                    {lightbox.photo.src.includes('[ADD') ? (
                      <div className="text-center p-8">
                        <div className="text-5xl mb-3">🖼️</div>
                        <p className="font-dm text-sm text-warm-charcoal/50">{lightbox.photo.src}</p>
                      </div>
                    ) : (
                      <img
                        src={lightbox.photo.src}
                        alt={lightbox.photo.caption}
                        className="w-full h-full object-contain rounded"
                        style={{ objectPosition: lightbox.photo.focal ?? 'center' }}
                      />
                    )}
                  </div>
                  <p className="font-allura text-xl text-warm-charcoal/70 text-center mt-3">
                    {lightbox.photo.caption}
                  </p>
                  <p className="font-dm text-xs text-champagne-gold text-center mt-1 tracking-widest uppercase">
                    {lightbox.galleryTitle}
                  </p>
                  {/* Hidden note — appears 2.5s after lightbox opens */}
                  <AnimatePresence>
                    {showHiddenNote && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mt-3 pt-3 border-t text-center"
                        style={{ borderColor: 'rgba(214,180,119,0.3)' }}
                      >
                        <p className="font-allura text-lg leading-relaxed" style={{ color: '#D6B477' }}>
                          {noteText}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <div className="relative z-10 text-center px-6 py-24 pb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-dm text-xs tracking-[0.4em] text-champagne-gold uppercase mb-4">
              A museum for you
            </p>
            <h1
              className="font-cormorant font-light leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#30252A' }}
            >
              The Museum of Vibhuti
            </h1>
            <div className="w-24 h-px bg-champagne-gold mx-auto mb-6" />
            <p className="font-playfair italic text-warm-charcoal/60 max-w-lg mx-auto text-base leading-relaxed">
              "Museum to choti cheez hai yr, maine to apne Dil ke Mehel mein,<br className="hidden sm:block" />
              tujhe sajaya hai."
            </p>
          </motion.div>
        </div>

        {/* Gallery tabs */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => setActiveGallery(null)}
              className="px-6 py-2 rounded-full font-dm text-sm transition-all duration-300"
              style={{
                background: activeGallery === null ? '#A31632' : 'rgba(255,250,250,0.9)',
                color: activeGallery === null ? '#FFFAFA' : '#30252A',
                border: '1px solid rgba(214,180,119,0.3)',
              }}
            >
              All Galleries
            </button>
            {galleries.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveGallery(g.id === activeGallery ? null : g.id)}
                className="px-6 py-2 rounded-full font-dm text-sm transition-all duration-300"
                style={{
                  background: activeGallery === g.id ? '#A31632' : 'rgba(255,250,250,0.9)',
                  color: activeGallery === g.id ? '#FFFAFA' : '#30252A',
                  border: '1px solid rgba(214,180,119,0.3)',
                }}
              >
                {g.emoji} {g.title}
              </button>
            ))}
          </div>

          {/* Galleries */}
          {galleries.filter(g => !activeGallery || g.id === activeGallery).map((gallery, gi) => (
            <motion.div
              key={gallery.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: gi * 0.1 }}
              className="mb-20"
            >
              {/* Gallery header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-champagne-gold" />
                <div>
                  <p className="font-dm text-xs tracking-widest text-champagne-gold uppercase">{gallery.subtitle}</p>
                  <h2 className="font-cormorant text-2xl text-warm-charcoal">{gallery.title}</h2>
                </div>
                <div className="flex-1 h-px bg-champagne-gold/30" />
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.photos.map((photo, pi) => (
                  <motion.div
                    key={pi}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: pi * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4, rotate: pi % 2 === 0 ? 1 : -1 }}
                    className="polaroid group cursor-pointer relative"
                    onClick={() => setLightbox({ photo, galleryTitle: gallery.title })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setLightbox({ photo, galleryTitle: gallery.title })}
                    aria-label={`View ${photo.caption}`}
                  >
                    <div
                      className="w-full bg-blush flex items-center justify-center overflow-hidden rounded"
                      style={{ aspectRatio: '4/3' }}
                    >
                      {photo.src.includes('[ADD') ? (
                        <div className="text-center p-6">
                          <div className="text-4xl mb-2">🖼️</div>
                          <p className="font-dm text-xs text-warm-charcoal/40 leading-relaxed px-2">
                            {photo.src.replace('/images/gallery/', '').replace('.jpg', '')}
                          </p>
                          <p className="font-dm text-xs text-champagne-gold mt-2">Add your photo here</p>
                        </div>
                      ) : (
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ objectPosition: (photo as Photo).focal ?? 'center' }}
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-warm-charcoal/0 group-hover:bg-warm-charcoal/10 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn size={24} className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <p className="font-allura text-lg text-warm-charcoal/70 text-center mt-2">
                      {photo.caption}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Continue */}
          <div className="text-center mt-8">
            <motion.button
              onClick={() => router.push('/future')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 rounded-full font-dm text-sm tracking-widest uppercase"
              style={{ background: '#A31632', color: '#FFFAFA', boxShadow: '0 8px 30px rgba(163,22,50,0.25)' }}
            >
              Our Future ♡
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
