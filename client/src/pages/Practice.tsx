import { useState, useEffect } from 'react'
import { wordsApi } from '../api'
import type { Word } from '../types'

type Mode = 'dholuo-to-english' | 'english-to-dholuo'

export default function Practice() {
  const [words, setWords] = useState<Word[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [mode, setMode] = useState<Mode>('dholuo-to-english')
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)

  const loadWords = async () => {
    setLoading(true)
    const res = await wordsApi.getRandom(15)
    setWords(res.data)
    setIndex(0)
    setFlipped(false)
    setScore({ correct: 0, wrong: 0 })
    setDone(false)
    setLoading(false)
  }

  useEffect(() => { loadWords() }, [])

  const current = words[index]

  const answer = (correct: boolean) => {
    setScore((s) => ({ ...s, [correct ? 'correct' : 'wrong']: s[correct ? 'correct' : 'wrong'] + 1 }))
    if (index + 1 >= words.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  if (loading) return <div className="max-w-2xl mx-auto px-6 py-10 text-gray-400">Loading flashcards...</div>

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Session complete!</h2>
        <div className="flex gap-8 justify-center mb-8">
          <div><p className="text-4xl font-bold text-green-600">{score.correct}</p><p className="text-gray-500 text-sm">Correct</p></div>
          <div><p className="text-4xl font-bold text-red-400">{score.wrong}</p><p className="text-gray-500 text-sm">Wrong</p></div>
        </div>
        <button onClick={loadWords} className="bg-green-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-800 transition">
          Practice Again
        </button>
      </div>
    )
  }

  if (!current) return null

  const front = mode === 'dholuo-to-english' ? current.dholuo : current.english.join(', ')
  const back = mode === 'dholuo-to-english' ? current.english.join(', ') : current.dholuo

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Practice</h1>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="dholuo-to-english">Dholuo → English</option>
          <option value="english-to-dholuo">English → Dholuo</option>
        </select>
      </div>

      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>{index + 1} / {words.length}</span>
        <span className="text-green-600 font-medium">{score.correct} correct</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
        <div
          className="bg-green-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((index) / words.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center cursor-pointer hover:shadow-md transition min-h-[200px] flex flex-col items-center justify-center"
      >
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
          {flipped ? 'Answer' : (mode === 'dholuo-to-english' ? 'Dholuo' : 'English')}
        </p>
        <p className="text-3xl font-bold text-gray-800">{flipped ? back : front}</p>
        {!flipped && <p className="text-gray-400 text-sm mt-6">Tap to reveal</p>}
        {flipped && current.part_of_speech && (
          <p className="text-gray-400 text-sm mt-2 italic">{current.part_of_speech}</p>
        )}
      </div>

      {flipped && (
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => answer(false)}
            className="flex-1 max-w-[160px] border-2 border-red-200 text-red-500 font-semibold py-3 rounded-full hover:bg-red-50 transition"
          >
            Didn't know
          </button>
          <button
            onClick={() => answer(true)}
            className="flex-1 max-w-[160px] bg-green-700 text-white font-semibold py-3 rounded-full hover:bg-green-800 transition"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  )
}
