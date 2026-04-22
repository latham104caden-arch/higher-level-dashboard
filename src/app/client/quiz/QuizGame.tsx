'use client'

import { useState } from 'react'

type Question = {
  question: string
  options: string[]
  correct: number
  explanation: string
  fact: string
  emoji: string
}

const ECOMMERCE_QUESTIONS: Question[] = [
  {
    emoji: '🛒',
    question: 'What percentage of online shoppers abandon their cart before purchasing?',
    options: ['28%', '47%', '70%', '88%'],
    correct: 2,
    explanation: 'Cart abandonment averages 70% across ecommerce. The biggest culprits: surprise shipping costs (48%), forced account creation (19%), and slow checkout.',
    fact: 'Fixing checkout alone can increase conversions by up to 35%.',
  },
  {
    emoji: '📸',
    question: 'UGC ads vs professional studio photos — which gets a higher click-through rate on Meta ads?',
    options: ['Professional photos by 2x', 'They perform the same', 'UGC by 4x', 'Depends on the product'],
    correct: 2,
    explanation: 'UGC gets 4x higher CTR and cuts cost-per-click by 50% compared to polished brand creative. Authentic > perfect on social media.',
    fact: 'UGC is also 5x more likely to cause a conversion than professional content.',
  },
  {
    emoji: '⚡',
    question: 'How much does a 1-second delay in page load time cost you in conversions?',
    options: ['1%', '4%', '7%', '15%'],
    correct: 2,
    explanation: 'Every 1 second of load time reduces conversions by 7%. A store making $50K/month with a 4-second load vs a 1-second load is losing $10,500/month.',
    fact: 'Target under 2.5 seconds. Test yours free at PageSpeed Insights.',
  },
  {
    emoji: '📱',
    question: 'What percentage of ecommerce traffic comes from mobile devices?',
    options: ['45%', '61%', '73%', '83%'],
    correct: 3,
    explanation: '83% of your traffic is on a phone — but mobile converts 8% lower than desktop. The gap is pure money left on the table from poor mobile experiences.',
    fact: 'Test your store on your own phone before any other device.',
  },
  {
    emoji: '💬',
    question: 'What is the abandoned cart SMS conversion rate?',
    options: ['4–8%', '11–15%', '24–39%', '50%+'],
    correct: 2,
    explanation: 'Abandoned cart SMS sequences convert at 24–39%. That\'s the highest-converting automated message in ecommerce. Send within 15 minutes of abandonment.',
    fact: 'A 3-message SMS sequence (15min, 2hr, 24hr) dramatically outperforms a single follow-up.',
  },
  {
    emoji: '📧',
    question: 'For every $1 spent on email marketing, what\'s the average return?',
    options: ['$8', '$18', '$42', '$76'],
    correct: 2,
    explanation: 'Email averages $42 return per $1 spent — the highest ROI of any marketing channel. 18% of businesses see $70+ per $1. It\'s the only channel you truly own.',
    fact: 'Automated email flows (abandoned cart, welcome, win-back) generate 320% more revenue than one-off campaigns.',
  },
  {
    emoji: '⭐',
    question: 'Where should you place customer reviews on a product page for maximum conversion impact?',
    options: ['Footer only', 'Separate reviews page', 'Next to the Add to Cart button', 'Pop-up after 30 seconds'],
    correct: 2,
    explanation: '86% of consumers say star ratings near the buy button are the #1 thing that drives them to purchase from a new brand. Social proof kills hesitation at the moment of decision.',
    fact: 'Product pages with customer photos see up to 134% more conversions vs pages with professional photos only.',
  },
  {
    emoji: '🔢',
    question: 'How many product images maximize ecommerce conversions?',
    options: ['1 hero image', '2–3 angles', '4+ including lifestyle', '10+'],
    correct: 2,
    explanation: '63% of shoppers want to see multiple angles before buying. 4+ images including a lifestyle shot dramatically outperforms single-image listings. Show it in use.',
    fact: '360° product images increase conversion rates by 22%.',
  },
  {
    emoji: '🚀',
    question: 'What\'s the single biggest checkout friction point causing abandoned orders?',
    options: ['Too many steps', 'Hidden fees revealed at checkout', 'Forced account creation', 'Limited payment options'],
    correct: 1,
    explanation: '48% of abandoned orders are caused by unexpected costs at checkout. Show shipping costs on the product page. No surprises = more completed purchases.',
    fact: 'Being upfront about all costs from the start builds trust and increases checkout completion significantly.',
  },
  {
    emoji: '📱',
    question: 'How many SMS messages per month maximizes list health without causing opt-outs?',
    options: ['1–2', '4–6', '10–12', '15–20'],
    correct: 1,
    explanation: '4–6 SMS per month is the sweet spot. Under 4 and you\'re invisible. Over 8 and opt-outs spike fast. Consistency and relevance matter more than volume.',
    fact: 'A well-run SMS list should generate $15–$30 per subscriber per month.',
  },
]

const LOCAL_QUESTIONS: Question[] = [
  {
    emoji: '⚡',
    question: 'How much more likely are you to convert a lead if you respond within 5 minutes vs 30 minutes?',
    options: ['3x more likely', '10x more likely', '21x more likely', 'Same chance'],
    correct: 2,
    explanation: 'Responding within 5 minutes makes you 21x more likely to convert that lead. The window of intent is brutally short — people move on fast.',
    fact: 'Calling within 1 minute boosts conversions by 391%. Set up instant text-back for every missed call.',
  },
  {
    emoji: '🕐',
    question: 'What is the average business response time to a new lead?',
    options: ['15 minutes', '2 hours', '12 hours', '47 hours'],
    correct: 3,
    explanation: 'The average business takes 47 hours to respond. 57% of companies take a week. If you respond in 5 minutes, you win by default in most markets.',
    fact: '51% of leads are never contacted at all. Just showing up puts you ahead of half your competition.',
  },
  {
    emoji: '🏆',
    question: 'What percentage of buyers go with the first business that responds to them?',
    options: ['42%', '58%', '67%', '78%'],
    correct: 3,
    explanation: '78% of customers go with whoever responds first — not necessarily the best price or most reviews. Speed is your competitive advantage.',
    fact: '82% of consumers want a business to reply within 10 minutes of reaching out.',
  },
  {
    emoji: '📱',
    question: 'What is the open rate for SMS messages compared to email?',
    options: ['SMS 45% vs Email 35%', 'SMS 75% vs Email 25%', 'SMS 98% vs Email 20%', 'They\'re about the same'],
    correct: 2,
    explanation: 'SMS has a 98% open rate — 90% of messages are read within 3 minutes. Email sits at around 20%. Text is your most powerful follow-up tool.',
    fact: 'Post-service SMS review requests convert at 12–15% vs 3–4% for email.',
  },
  {
    emoji: '⭐',
    question: 'How many reviews does a local business need before customers trust their average rating?',
    options: ['5 reviews', '10 reviews', '20 reviews', '50 reviews'],
    correct: 2,
    explanation: '69% of consumers won\'t trust a business\'s average rating until they see at least 20 reviews. Getting to 20 is a critical milestone.',
    fact: '71% of consumers regularly read reviews before hiring any local service business.',
  },
  {
    emoji: '📞',
    question: 'A lead submits a quote request on your website. When should you text them first?',
    options: ['Within 24 hours', 'Within 4 hours', 'Within 1 hour', 'Within 60 seconds'],
    correct: 3,
    explanation: 'Text responses under 60 seconds achieve a 73% appointment booking rate. After 30 minutes, that drops to 4%. Speed is the difference between a booked job and a lost lead.',
    fact: 'Text first ("I\'ll call you in a moment"), then call immediately after. Two-touch instant response wins every time.',
  },
  {
    emoji: '📸',
    question: 'What\'s the #1 trust signal on a local service business website?',
    options: ['Professional logo', 'Before & after photos', 'Price list', 'Years in business badge'],
    correct: 1,
    explanation: 'Before and after photos show competence instantly without a word of reading. Real results from real jobs. They outperform testimonials, logos, and certifications for first impressions.',
    fact: 'Businesses with 100+ photos on Google Business Profile get 520% more calls than businesses with fewer than 10.',
  },
  {
    emoji: '📋',
    question: 'How many fields should your lead capture form have for maximum conversions?',
    options: ['8–10 fields (get all the info)', '5–6 fields', '3 fields', '1 field'],
    correct: 2,
    explanation: '3-field forms (name, phone, service needed) convert 27% better than 5-field forms. Get them in the door first. Collect the details when you call.',
    fact: 'Every extra form field is another chance for your customer to give up and leave.',
  },
  {
    emoji: '🔄',
    question: 'What percentage of replies to follow-up sequences come from messages 2–5, not the first contact?',
    options: ['15%', '30%', '45%', '55%'],
    correct: 3,
    explanation: '55% of all replies come from follow-up messages — not the first one. Most businesses give up after one try and leave more than half their leads on the table.',
    fact: 'The winning sequence: Day 1 call + text, Day 2 call, Day 3 email, Day 5 text, Day 7 final call.',
  },
  {
    emoji: '📍',
    question: 'What percentage of local searches happen on mobile phones?',
    options: ['45%', '58%', '70%+', '90%'],
    correct: 2,
    explanation: '70%+ of local searches happen on phones. Your website must be mobile-first — not just "mobile-friendly." Your phone number should be tap-to-call in the top right of every page.',
    fact: 'A 1-second delay in page load time reduces conversions by 7%. Test your site speed on your own phone today.',
  },
]

const SCORE_MESSAGES = [
  { min: 0, max: 3, title: 'Just Getting Started', message: 'Every expert was once a beginner. Keep going — this knowledge compounds fast.', emoji: '💡' },
  { min: 4, max: 6, title: 'Getting There', message: 'Solid foundation. The tactics you\'re learning here are what separate busy businesses from profitable ones.', emoji: '📈' },
  { min: 7, max: 8, title: 'Sharp', message: 'You know what works. Now it\'s about applying it consistently. Execution beats knowledge every time.', emoji: '🔥' },
  { min: 9, max: 10, title: 'You\'ve Got This', message: 'You think like someone who\'s serious about growth. These aren\'t just facts — they\'re your competitive edge.', emoji: '🏆' },
]

function getScoreMessage(score: number) {
  return SCORE_MESSAGES.find(s => score >= s.min && score <= s.max) || SCORE_MESSAGES[0]
}

export function QuizGame({ clientType }: { clientType: string }) {
  const questions = clientType === 'ecommerce' ? ECOMMERCE_QUESTIONS : LOCAL_QUESTIONS
  const [phase, setPhase] = useState<'start' | 'playing' | 'result'>('start')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const q = questions[current]
  const isCorrect = selected === q?.correct
  const scoreMsg = getScoreMessage(score)

  function handleSelect(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === q.correct
    if (correct) setScore(s => s + 1)
    setAnswers(a => [...a, correct])
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setPhase('result')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  function restart() {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setAnswers([])
    setPhase('start')
  }

  // ── Start screen ──────────────────────────────────────────────────────────
  if (phase === 'start') {
    return (
      <div
        className="rounded-2xl p-10 text-center relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: '#21D19F' }} />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: '#A78BFA' }} />
        <div className="text-5xl mb-5">🧠</div>
        <h2 className="text-2xl font-black mb-3" style={{ color: '#E8ECFF' }}>
          {clientType === 'ecommerce' ? 'Ecommerce Growth Quiz' : 'Lead Gen Growth Quiz'}
        </h2>
        <p className="text-sm mb-2 max-w-sm mx-auto" style={{ color: '#7B82A0' }}>
          {questions.length} questions. Real facts. Every answer teaches you something that can directly grow your business.
        </p>
        <p className="text-xs mb-8" style={{ color: '#484D6D' }}>Takes about 3 minutes</p>
        <button
          onClick={() => setPhase('playing')}
          className="px-8 py-4 rounded-xl font-black text-sm tracking-wider transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #21D19F, #45B69C)',
            color: '#080B14',
            boxShadow: '0 0 30px rgba(33,209,159,0.25)',
            letterSpacing: '0.06em',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          START QUIZ →
        </button>
      </div>
    )
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (phase === 'result') {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div
        className="rounded-2xl p-10 relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full blur-3xl opacity-10" style={{ background: '#21D19F' }} />

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{scoreMsg.emoji}</div>
          <h2 className="text-3xl font-black mb-2" style={{ color: '#E8ECFF' }}>{scoreMsg.title}</h2>
          <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#7B82A0' }}>{scoreMsg.message}</p>

          {/* Score ring */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center"
              style={{
                background: `conic-gradient(#21D19F ${pct * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                padding: '3px',
              }}
            >
              <div
                className="w-full h-full rounded-full flex flex-col items-center justify-center"
                style={{ background: '#080B14' }}
              >
                <span className="text-2xl font-black" style={{ color: '#21D19F' }}>{score}</span>
                <span className="text-xs" style={{ color: '#484D6D' }}>/{questions.length}</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-4xl font-black" style={{ color: '#21D19F' }}>{pct}%</p>
              <p className="text-xs" style={{ color: '#484D6D' }}>correct</p>
            </div>
          </div>
        </div>

        {/* Answer breakdown */}
        <div className="flex gap-1.5 justify-center mb-8 flex-wrap">
          {answers.map((correct, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
              style={correct
                ? { background: 'rgba(33,209,159,0.15)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.3)' }
                : { background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }
              }
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={restart}
            className="px-6 py-3 rounded-xl font-black text-sm transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #21D19F, #45B69C)',
              color: '#080B14',
              boxShadow: '0 0 20px rgba(33,209,159,0.2)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((current) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #21D19F88, #21D19F)' }}
          />
        </div>
        <span className="text-xs font-black flex-shrink-0" style={{ color: '#484D6D' }}>
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Score running total */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: questions.length }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i < answers.length
                  ? answers[i] ? '#21D19F' : '#EF4444'
                  : i === current ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'
              }}
            />
          ))}
        </div>
        <span className="text-xs font-black" style={{ color: '#21D19F' }}>{score} correct</span>
      </div>

      {/* Question card */}
      <div
        className="rounded-2xl p-7 relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-10" style={{ background: '#21D19F' }} />
        <div className="text-3xl mb-4">{q.emoji}</div>
        <p className="font-black text-lg leading-snug mb-6" style={{ color: '#E8ECFF' }}>{q.question}</p>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((option, idx) => {
            let borderColor = 'rgba(255,255,255,0.08)'
            let bg = 'rgba(255,255,255,0.04)'
            let textColor = '#E8ECFF'
            let icon = null

            if (answered) {
              if (idx === q.correct) {
                bg = 'rgba(33,209,159,0.1)'
                borderColor = 'rgba(33,209,159,0.4)'
                textColor = '#21D19F'
                icon = <span className="text-sm">✓</span>
              } else if (idx === selected && idx !== q.correct) {
                bg = 'rgba(239,68,68,0.08)'
                borderColor = 'rgba(239,68,68,0.3)'
                textColor = '#EF4444'
                icon = <span className="text-sm">✗</span>
              } else {
                textColor = '#484D6D'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className="w-full text-left px-5 py-4 rounded-xl font-bold text-sm flex items-center justify-between transition-all duration-200"
                style={{
                  background: bg,
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  cursor: answered ? 'default' : 'pointer',
                }}
                onMouseEnter={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              >
                <span>{option}</span>
                {icon}
              </button>
            )
          })}
        </div>
      </div>

      {/* Explanation — shown after answering */}
      {answered && (
        <div
          className="rounded-2xl p-6 space-y-3"
          style={{
            background: isCorrect ? 'rgba(33,209,159,0.06)' : 'rgba(239,68,68,0.06)',
            border: `1px solid ${isCorrect ? 'rgba(33,209,159,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{isCorrect ? '✅' : '❌'}</span>
            <p className="font-black text-sm" style={{ color: isCorrect ? '#21D19F' : '#EF4444' }}>
              {isCorrect ? 'Correct!' : `The answer is: ${q.options[q.correct]}`}
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{q.explanation}</p>
          <div className="rounded-xl px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold" style={{ color: '#484D6D' }}>
              💡 <span style={{ color: '#A0A4B8' }}>{q.fact}</span>
            </p>
          </div>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-black text-sm tracking-wider transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #21D19F, #45B69C)',
            color: '#080B14',
            letterSpacing: '0.06em',
            boxShadow: '0 0 20px rgba(33,209,159,0.2)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {current + 1 >= questions.length ? 'SEE RESULTS →' : 'NEXT QUESTION →'}
        </button>
      )}
    </div>
  )
}
