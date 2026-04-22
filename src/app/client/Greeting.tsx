'use client'

import { useEffect, useState } from 'react'

export function Greeting() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Good morning')
    } else if (hour < 17) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }
  }, [])

  if (!greeting) return null

  return (
    <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>
      {greeting}
    </h1>
  )
}
