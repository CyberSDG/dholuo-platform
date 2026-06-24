import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wordsApi } from '../api'
import { Word } from '../types'
import { X, CheckCircle, AlertCircle } from 'lucide-react'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type MistakeEntry = { id: string; dholuo: string; english: string[] }

function getMistakes(): MistakeEntry[] {
  try {
    return JSON.parse(localStorage.getItem('dholuo_mistakes') || '[]')
  } catch {
    return []
  }
}

function removeMistake(id: string) {
  const updated = getMistakes().filter((m) => m.id !== id)
  localStorage.setItem('dholuo_mistakes', JSON.stringify(updated))
}

type GameState = 'loading' | 'empty' | 'question' | 'feedback' | 'done'

export default function ReviewMistakes() {
  const navigate = useNavigate()
  const [words, setWords] = useState<MistakeEntry[]>([])
  const [distractors, setDistractors] = useState<Word[]>([])
  const [current, setCurrent] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>('loading')
  const [cleared, setCleared] = useState(0)

  useEffect(() => {
    const mistakes = getMistakes()
    if (mistakes.length === 0) {
      setGameState('empty')
      return
    }
    setWords(mistakes)
    wordsApi.getRandom(15).then((res) => {
      setDistractors(res.data)
      setGameState('question')
    })
  }, [])

  useEffect(() => {
    if (gameState === 'question' && words.length > 0 && distractors.length > 0) {
      const word = words[current]
      const correct = word.english[0]
      const pool = distractors
        .filter((d) => d.id !== word.id)
        .map((d) => d.english[0])
        .filter((e) => e !== correct)
        .slice(0, 3)
      setOptions(shuffle([correct, ...pool]))
      setSelected(null)
    }
  }, [current, gameState, words, distractors])

  function handleSelect(option: string) {
    if (selected !== null) return
    const correct = words[current].english[0]
    setSelected(option)
    if (option === correct) {
      removeMistake(words[current].id)
      setCleared((c) => c + 1)
    }
    setGameState('feedback')
  }

  function handleNext() {
    if (current + 1 >= words.length) {
      setGameState('done')
    } else {
      setCurrent((c) => c + 1)
      setGameState('question')
    }
  }

  if (gameState === 'loading') {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400">Loading your review words...</p>
      </div>
    )
  }

  if (gameState === 'empty') {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-7 h-7 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No mistakes to review</h2>
        <p className="text-gray-500 mb-7">Play Word Match first to build your review list.</p>
        <button
          onClick={() => navigate('/lessons')}
          className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition font-medium"
        >
          Back to Lessons
        </button>
      </div>
    )
  }

  if (gameState === 'done') {
    const remaining = getMistakes().length
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl bg-amber-50">
          {cleared === words.length ? '🎉' : '💪'}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Review complete!</h2>
        <p className="text-gray-500 mb-8">
          {cleared > 0 && `${cleared} word${cleared > 1 ? 's' : ''} cleared. `}
          {remaining > 0 ? `${remaining} still in your review list.` : 'Your review list is clear!'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/lessons')}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Back to Lessons
          </button>
          {remaining > 0 && (
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition font-medium"
            >
              Review Again
            </button>
          )}
        </div>
      </div>
    )
  }

  const word = words[current]
  const correct = word.english[0]
  const isCorrect = selected === correct

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {/* Header: close + progress bar */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate('/lessons')}
          className="text-gray-300 hover:text-gray-500 transition"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(current / words.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 tabular-nums">
          {current + 1}/{words.length}
        </span>
      </div>

      {/* Question */}
      <div className="mb-8">
        <p className="text-xs font-bold text-amber-500 mb-1 uppercase tracking-widest">
          Review Mode
        </p>
        <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          What does this mean?
        </p>
        <h2 className="text-4xl font-bold text-gray-800">{word.dholuo}</h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          let cls =
            'w-full text-left px-5 py-4 rounded-xl font-medium transition border'
          if (selected === null) {
            cls += ' border-gray-200 bg-white text-gray-700 hover:border-amber-400 hover:bg-amber-50 cursor-pointer'
          } else if (option === correct) {
            cls += ' border-2 border-green-500 bg-green-50 text-green-800'
          } else if (option === selected) {
            cls += ' border-2 border-red-400 bg-red-50 text-red-700'
          } else {
            cls += ' border-gray-100 bg-gray-50 text-gray-400 cursor-default'
          }
          return (
            <button key={option} onClick={() => handleSelect(option)} className={cls}>
              {option}
            </button>
          )
        })}
      </div>

      {/* Feedback banner */}
      {selected !== null && (
        <div
          className={`mt-6 p-4 rounded-xl flex items-center justify-between ${
            isCorrect ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span
              className={`font-semibold text-sm ${
                isCorrect ? 'text-green-700' : 'text-red-600'
              }`}
            >
              {isCorrect ? 'Correct! Cleared from review.' : `Correct answer: ${correct}`}
            </span>
          </div>
          <button
            onClick={handleNext}
            className={`px-5 py-2 rounded-lg font-semibold text-white text-sm transition ${
              isCorrect
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
