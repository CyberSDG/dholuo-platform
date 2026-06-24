import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wordsApi } from '../api'
import { Word } from '../types'
import { X, CheckCircle } from 'lucide-react'

const TOTAL = 8

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type Question = {
  sentence: string       // Dholuo sentence with ___ blank
  answer: string         // correct Dholuo word
  english: string        // English translation of the sentence
  options: string[]
}

function buildQuestions(words: Word[]): Question[] {
  const questions: Question[] = []

  for (const word of words) {
    if (!word.examples || word.examples.length === 0) continue

    const example = word.examples[0]
    const dholuo = example.dholuo

    // Find the word in the sentence (case-insensitive)
    const regex = new RegExp(`\\b${word.dholuo}\\b`, 'i')
    if (!regex.test(dholuo)) continue

    const sentence = dholuo.replace(regex, '___')

    // Distractors: other words from the pool
    const distractors = words
      .filter((w) => w.id !== word.id)
      .map((w) => w.dholuo)
      .slice(0, 3)

    if (distractors.length < 3) continue

    questions.push({
      sentence,
      answer: word.dholuo,
      english: example.english,
      options: shuffle([word.dholuo, ...distractors]),
    })

    if (questions.length >= TOTAL) break
  }

  return questions
}

type GameState = 'loading' | 'question' | 'feedback' | 'done' | 'nodata'

export default function FillBlank() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>('loading')
  const [score, setScore] = useState(0)

  useEffect(() => {
    wordsApi.getRandom(40).then((res) => {
      const qs = buildQuestions(shuffle(res.data))
      if (qs.length < 3) {
        setGameState('nodata')
        return
      }
      setQuestions(qs)
      setGameState('question')
    })
  }, [])

  function handleSelect(option: string) {
    if (selected !== null) return
    setSelected(option)
    if (option === questions[current].answer) setScore((s) => s + 1)
    setGameState('feedback')
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setGameState('done')
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setGameState('question')
    }
  }

  if (gameState === 'loading') {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400">Building questions...</p>
      </div>
    )
  }

  if (gameState === 'nodata') {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-2xl font-bold text-gray-800 mb-2">Not enough example sentences yet</p>
        <p className="text-gray-500 mb-6">This lesson needs words with examples. Help by contributing sentences!</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/lessons')} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium">
            Back to Lessons
          </button>
          <button onClick={() => navigate('/contribute')} className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition font-medium">
            Contribute
          </button>
        </div>
      </div>
    )
  }

  if (gameState === 'done') {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl bg-green-50">
          {score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.5 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{score}/{questions.length} correct</h2>
        <p className="text-gray-500 mb-8">
          {score === questions.length ? 'Perfect! No mistakes.' : `Keep practicing — you're getting there.`}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/lessons')} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium">
            Back to Lessons
          </button>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition font-medium">
            Play Again
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const isCorrect = selected === q.answer

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate('/lessons')} className="text-gray-300 hover:text-gray-500 transition">
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 tabular-nums">{current + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Fill in the blank
        </p>
        <div className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-5 mb-3">
          <p className="text-2xl font-bold text-gray-800 leading-relaxed">
            {q.sentence.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block min-w-[80px] border-b-2 mx-1 align-bottom transition-colors ${
                    selected === null
                      ? 'border-green-400'
                      : isCorrect
                      ? 'border-green-500 text-green-700'
                      : 'border-red-400 text-red-600'
                  }`}>
                    {selected || ''}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
        <p className="text-sm text-gray-400 italic">"{q.english}"</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((option) => {
          let cls = 'px-4 py-3.5 rounded-xl font-semibold text-sm transition border'
          if (selected === null) {
            cls += ' border-gray-200 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50 cursor-pointer'
          } else if (option === q.answer) {
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

      {/* Feedback */}
      {selected !== null && (
        <div className={`mt-6 p-4 rounded-xl flex items-center justify-between ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span className={`font-semibold text-sm ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : `Answer: ${q.answer}`}
            </span>
          </div>
          <button
            onClick={handleNext}
            className={`px-5 py-2 rounded-lg font-semibold text-white text-sm transition ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
