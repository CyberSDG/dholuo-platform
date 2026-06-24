import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Layers, GraduationCap, ArrowLeftRight, Bot, Users, Sparkles, ChevronRight } from 'lucide-react'
import { wordsApi } from '../api'
import type { Word } from '../types'

const features = [
  { icon: BookOpen, title: 'Dictionary', desc: 'Search thousands of Dholuo words with meanings, examples and cultural context.', href: '/dictionary' },
  { icon: Layers, title: 'Practice', desc: 'Flashcard drills that adapt to what you know and what you\'re still learning.', href: '/practice' },
  { icon: GraduationCap, title: 'Lessons', desc: 'Structured lessons from greetings to advanced conversation, grouped by topic.', href: '/lessons' },
  { icon: ArrowLeftRight, title: 'Translator', desc: 'Quick English ↔ Dholuo translation for words not yet in our dictionary.', href: '/translate' },
  { icon: Bot, title: 'AI Chat', desc: 'Practice real conversation with an AI that teaches as you go.', href: '/chat' },
  { icon: Users, title: 'Contribute', desc: 'Add words, fix translations, share cultural knowledge. Built by the community.', href: '/contribute' },
]

const TODAY = new Date().toISOString().slice(0, 10)

function getCachedDailyWord(): Word | null {
  try {
    const raw = localStorage.getItem('dholuo_daily_word')
    if (!raw) return null
    const { date, word } = JSON.parse(raw)
    return date === TODAY ? word : null
  } catch {
    return null
  }
}

function cacheDailyWord(word: Word) {
  localStorage.setItem('dholuo_daily_word', JSON.stringify({ date: TODAY, word }))
}

export default function Home() {
  const [dailyWord, setDailyWord] = useState<Word | null>(getCachedDailyWord())

  useEffect(() => {
    if (dailyWord) return
    wordsApi.getRandom(1).then((res) => {
      const word: Word = res.data[0]
      if (word) {
        cacheDailyWord(word)
        setDailyWord(word)
      }
    })
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 to-green-900 text-white px-6 py-24 text-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-green-800/30 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

        <div className="relative">
          <p className="text-green-300 text-sm font-semibold tracking-widest uppercase mb-4">Dholuo Learning Platform</p>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Learn Dholuo.<br />Reconnect with your roots.
          </h1>
          <p className="text-green-100 text-xl max-w-2xl mx-auto mb-10">
            A modern, community-driven platform for young Luo people and anyone who wants to learn Dholuo — the language, the culture, the identity.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-14">
            <Link
              to="/lessons"
              className="bg-white text-green-800 font-semibold px-8 py-3 rounded-full hover:bg-green-50 hover:scale-105 active:scale-95 transition-all duration-150 shadow-md"
            >
              Start Learning
            </Link>
            <Link
              to="/dictionary"
              className="border border-white/60 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/15 hover:border-white hover:scale-105 active:scale-95 transition-all duration-150"
            >
              Browse Dictionary
            </Link>
          </div>

          {/* Daily Word card */}
          {dailyWord ? (
            <Link
              to={`/dictionary/${dailyWord.id}`}
              className="inline-block max-w-sm w-full mx-auto group"
            >
              {/* Spinning border wrapper */}
              <div className="relative rounded-2xl p-[2px] overflow-hidden">
                {/* Permanent base border — always visible */}
                <div className="absolute inset-0 bg-white/20 rounded-2xl" />
                {/* Rotating soft sweep on top */}
                <div
                  className="absolute inset-[-100%] opacity-50 group-hover:opacity-75 transition-opacity duration-500"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, transparent 70%, rgba(134,239,172,0.9) 83%, rgba(255,255,255,0.35) 90%, transparent 100%)',
                    animation: 'spin-border 5s linear infinite',
                  }}
                />
                {/* Card */}
                <div className="relative bg-green-800/60 hover:bg-green-800/80 backdrop-blur-sm rounded-2xl px-6 py-5 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-green-300 text-xs font-semibold uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" />
                      Word of the Day
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-bold text-white">{dailyWord.dholuo}</span>
                    {dailyWord.part_of_speech && (
                      <span className="text-green-300 text-sm italic">{dailyWord.part_of_speech}</span>
                    )}
                  </div>
                  <p className="text-green-100 text-base">{dailyWord.english[0]}</p>
                  {dailyWord.english.length > 1 && (
                    <p className="text-green-300/70 text-sm mt-0.5">{dailyWord.english.slice(1).join(', ')}</p>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <div className="inline-block max-w-sm w-full mx-auto bg-white/5 border border-white/10 rounded-2xl px-6 py-5 animate-pulse">
              <div className="h-3 w-28 bg-white/20 rounded mb-4" />
              <div className="h-8 w-32 bg-white/20 rounded mb-2" />
              <div className="h-4 w-40 bg-white/10 rounded" />
            </div>
          )}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Everything you need to learn Dholuo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <Link
                key={f.href}
                to={f.href}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 group"
              >
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition">
                  <Icon className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-700 transition">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Community CTA */}
      <section className="bg-green-50 border-t border-green-100 px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Built by the community, for the community</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-6">
          This is an open source project. If you know a word that's missing, a better translation, or a proverb worth preserving — contribute it.
        </p>
        <Link
          to="/contribute"
          className="bg-green-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-800 hover:scale-105 active:scale-95 transition-all duration-150 inline-block"
        >
          Contribute a Word
        </Link>
      </section>
    </main>
  )
}
