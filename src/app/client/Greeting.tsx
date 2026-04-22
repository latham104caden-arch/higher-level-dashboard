'use client'

import { useEffect, useState } from 'react'

export function Greeting() {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Good morning')
      setEmoji('☀️')
    } else if (hour < 17) {
      setGreeting('Good afternoon')
      setEmoji('👋')
    } else {
      setGreeting('Good evening')
      setEmoji('🌙')
    }
  }, [])

  if (!greeting) return null

  return (
    <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>
      {greeting} {emoji}
    </h1>
  )
}
