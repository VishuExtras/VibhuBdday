'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const PAGE_ORDER = ['/', '/birthday', '/our-story', '/museum', '/future', '/letter', '/forever']

export function useProgress() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      const visited: string[] = JSON.parse(localStorage.getItem('visitedPages') || '[]')
      if (!visited.includes(pathname)) {
        visited.push(pathname)
        localStorage.setItem('visitedPages', JSON.stringify(visited))
      }
      // Track furthest page reached
      const currentIndex = PAGE_ORDER.indexOf(pathname)
      const savedIndex = parseInt(localStorage.getItem('furthestPage') || '-1')
      if (currentIndex > savedIndex) {
        localStorage.setItem('furthestPage', String(currentIndex))
      }
    } catch {}
  }, [pathname])
}

export function getSavedProgress(): { visitedPages: string[]; furthestPage: number } {
  try {
    return {
      visitedPages: JSON.parse(localStorage.getItem('visitedPages') || '[]'),
      furthestPage: parseInt(localStorage.getItem('furthestPage') || '-1'),
    }
  } catch {
    return { visitedPages: [], furthestPage: -1 }
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem('visitedPages')
    localStorage.removeItem('furthestPage')
    localStorage.removeItem('easterEggsFound')
  } catch {}
}

