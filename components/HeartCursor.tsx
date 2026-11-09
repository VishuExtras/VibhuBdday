'use client'

import { useEffect, useRef, useState } from 'react'

interface Heart {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  rotation: number
}

export default function HeartCursor() {
  const [hearts, setHearts] = useState<Heart[]>([])
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const counterRef = useRef(0)
  const isTouchDevice = useRef(false)
  const lastEmit = useRef(0)

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice.current) return

    const handleMove = (e: MouseEvent) => {
      const now = Date.now()
      setCursorPos({ x: e.clientX, y: e.clientY })
      
      if (now - lastEmit.current < 60) return
      lastEmit.current = now

      const heart: Heart = {
        id: counterRef.current++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 8,
        opacity: 0.7,
        rotation: Math.random() * 60 - 30,
      }
      setHearts(prev => [...prev.slice(-15), heart])
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useEffect(() => {
    if (hearts.length === 0) return
    const timer = setTimeout(() => {
      setHearts(prev => prev.slice(1))
    }, 600)
    return () => clearTimeout(timer)
  }, [hearts])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <>
      {/* Custom cursor dot */}
      <div
        className="heart-trail pointer-events-none"
        style={{
          left: cursorPos.x - 4,
          top: cursorPos.y - 4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#A31632',
          position: 'fixed',
          zIndex: 9999,
        }}
      />
      {/* Heart trail */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-trail"
          style={{
            left: heart.x - heart.size / 2,
            top: heart.y - heart.size / 2,
            width: heart.size,
            height: heart.size,
            opacity: heart.opacity,
            transform: `rotate(${heart.rotation}deg)`,
            fontSize: heart.size,
            lineHeight: 1,
            color: '#B76E79',
            transition: 'opacity 0.6s ease-out',
            animation: 'fadeOut 0.6s ease-out forwards',
          }}
        >
          ♡
        </div>
      ))}
      <style jsx global>{`
        @keyframes fadeOut {
          0% { opacity: 0.7; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.5); }
        }
      `}</style>
    </>
  )
}
