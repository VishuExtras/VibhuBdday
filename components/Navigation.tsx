'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const chapters = [
  { href: '/', label: 'Envelope', emoji: '✉️' },
  { href: '/birthday', label: 'Birthday', emoji: '🎂' },
  { href: '/our-story', label: 'Our Story', emoji: '📖' },
  { href: '/museum', label: 'Museum', emoji: '🖼️' },
  { href: '/future', label: 'Our Future', emoji: '✨' },
  { href: '/letter', label: 'Love Letter', emoji: '💌' },
  { href: '/forever', label: 'Forever', emoji: '💍' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const currentChapter = chapters.findIndex(c => c.href === pathname)

  return (
    <>
      {/* Menu Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-[200] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,250,250,0.9)' : 'rgba(255,250,250,0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(214,180,119,0.4)',
          boxShadow: '0 2px 12px rgba(48,37,42,0.08)',
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle navigation"
      >
        <div className="flex flex-col gap-1 items-center">
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
            className="block w-4 h-0.5 bg-burgundy origin-center"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={{ opacity: isOpen ? 0 : 1 }}
            className="block w-4 h-0.5 bg-burgundy"
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
            className="block w-4 h-0.5 bg-burgundy origin-center"
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.button>

      {/* Progress Dots */}
      {pathname !== '/' && (
        <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-[150] flex flex-col gap-2 hidden lg:flex">
          {chapters.slice(1).map((chapter, i) => (
            <Link key={chapter.href} href={chapter.href}>
              <motion.div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: pathname === chapter.href ? '#A31632' : 'rgba(183,110,121,0.3)',
                  boxShadow: pathname === chapter.href ? '0 0 8px rgba(163,22,50,0.5)' : 'none',
                }}
                whileHover={{ scale: 1.5 }}
                title={chapter.label}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[190] bg-warm-charcoal/20 backdrop-blur-sm"
            />
            <motion.nav
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full z-[195] w-80 max-w-[85vw]"
              style={{
                background: 'rgba(255,250,250,0.97)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(214,180,119,0.3)',
                boxShadow: '-8px 0 32px rgba(48,37,42,0.12)',
              }}
            >
              <div className="h-full flex flex-col p-8 pt-20">
                <div className="mb-8">
                  <p className="font-allura text-3xl text-muted-rose">A Little Universe</p>
                  <p className="font-dm text-xs text-warm-charcoal/50 mt-1 tracking-widest uppercase">Called Us</p>
                </div>

                <div className="section-divider">
                  <span className="font-dm text-xs tracking-widest text-champagne-gold uppercase">Chapters</span>
                </div>

                <ul className="flex flex-col gap-1 mt-4 flex-1">
                  {chapters.map((chapter, i) => (
                    <motion.li
                      key={chapter.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={chapter.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group"
                        style={{
                          background: pathname === chapter.href ? 'rgba(163,22,50,0.08)' : 'transparent',
                          borderLeft: pathname === chapter.href ? '2px solid #A31632' : '2px solid transparent',
                        }}
                      >
                        <span className="text-lg">{chapter.emoji}</span>
                        <span
                          className="font-cormorant text-lg transition-colors"
                          style={{ color: pathname === chapter.href ? '#A31632' : '#30252A' }}
                        >
                          {chapter.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 border-t border-champagne-gold/20">
                  <p className="font-allura text-xl text-muted-rose text-center">Made with love ♡</p>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
