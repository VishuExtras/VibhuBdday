'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted]     = useState(false)
  const [volume, setVolume]       = useState(0.5)
  const [isOpen, setIsOpen]       = useState(false)
  const audioRef      = useRef<HTMLAudioElement | null>(null)
  const containerRef  = useRef<HTMLDivElement>(null)

  /* ── Initialise audio once ─────────────────────────── */
  useEffect(() => {
    const audio = new Audio(siteConfig.music.filePath)
    audio.loop   = true
    audio.volume = volume
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Close popup when clicking outside ─────────────── */
  useEffect(() => {
    if (!isOpen) return
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    // 150 ms delay so the opening click doesn't immediately close the panel
    const id = setTimeout(() => document.addEventListener('mousedown', onDown), 150)
    return () => {
      clearTimeout(id)
      document.removeEventListener('mousedown', onDown)
    }
  }, [isOpen])

  /* ── Play / Pause ──────────────────────────────────── */
  const play = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.play().catch(() => {})
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play()
  }, [isPlaying, play, pause])

  /* ── Main icon click:
       - Always opens the popup
       - If music is NOT playing → start it
       - If music IS playing     → just show the popup (second click needed to pause)
       User can then pause via the Play/Pause button inside the popup.          ── */
  const handleIconClick = useCallback(() => {
    setIsOpen(true)
    if (!isPlaying) play()
  }, [isPlaying, play])

  /* ── Mute / Volume ─────────────────────────────────── */
  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(p => !p)
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
    if (isMuted && v > 0) {
      setIsMuted(false)
      if (audioRef.current) audioRef.current.muted = false
    }
  }

  const displayVolume = isMuted ? 0 : volume

  return (
    <div ref={containerRef} className="music-player relative">

      {/* ── Popup panel ────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="music-panel"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-[calc(100%+12px)] right-0 rounded-2xl p-4 w-64 shadow-xl"
            style={{
              background: 'rgba(255,250,250,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(214,180,119,0.25)',
            }}
          >
            {/* NOW PLAYING */}
            <p className="font-dm text-[10px] text-warm-charcoal/40 tracking-[0.18em] uppercase mb-1">
              Now Playing
            </p>

            {/* Track info */}
            <p className="font-playfair text-sm font-semibold text-warm-charcoal leading-tight">
              {siteConfig.music.trackName}
            </p>
            <p className="font-dm text-xs text-muted-rose mb-4">
              {siteConfig.music.artist}
            </p>

            {/* Volume slider */}
            <div className="flex items-center gap-2 mb-3">
              <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} className="flex-shrink-0">
                {isMuted || volume === 0
                  ? <VolumeX size={13} className="text-warm-charcoal/40" />
                  : <Volume2 size={13} className="text-warm-charcoal/40" />
                }
              </button>

              {/* Custom slider track */}
              <div className="relative flex-1 h-1.5 rounded-full" style={{ background: 'rgba(183,110,121,0.18)' }}>
                {/* Filled portion */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all"
                  style={{ width: `${displayVolume * 100}%`, background: '#A31632' }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full shadow"
                  style={{ left: `calc(${displayVolume * 100}% - 7px)`, background: '#A31632' }}
                />
                {/* Invisible range input on top */}
                <input
                  type="range" min="0" max="1" step="0.02"
                  value={displayVolume}
                  onChange={handleVolume}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Volume"
                />
              </div>

              <Volume2 size={13} className="text-warm-charcoal/40 flex-shrink-0" />
            </div>

            {/* Play / Pause button inside popup */}
            <div className="flex justify-center">
              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#A31632' }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying
                  ? <Pause size={13} className="text-white fill-white" />
                  : <Play  size={13} className="text-white fill-white ml-0.5" />
                }
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom row: mute pill + music icon pill ─────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-2"
      >
        {/* Mute / unmute pill */}
        <motion.button
          onClick={toggleMute}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
          style={{
            background: 'rgba(255,250,250,0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(214,180,119,0.25)',
          }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0
            ? <VolumeX size={15} className="text-muted-rose" />
            : <Volume2 size={15} className="text-muted-rose" />
          }
        </motion.button>

        {/* Main music icon — click to play & open popup */}
        <motion.button
          onClick={handleIconClick}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-md relative overflow-hidden"
          style={{ background: '#A31632' }}
          aria-label="Open music player"
          aria-expanded={isOpen}
        >
          {/* Spinning ring while playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-champagne-gold/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Music note icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-white relative z-10"
          >
            <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9Z" />
          </svg>
        </motion.button>
      </motion.div>

      {/* First-time hint */}
      {!isPlaying && !isOpen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute right-0 bottom-14 text-[10px] font-dm text-muted-rose whitespace-nowrap pointer-events-none"
        >
          ♪ Tap to play
        </motion.p>
      )}
    </div>
  )
}
