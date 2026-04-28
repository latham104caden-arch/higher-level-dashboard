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
    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: '#F4F5F8' }}>
      {greeting}
    </h1>
  )
}
