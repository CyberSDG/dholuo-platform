import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wordsApi } from '../api'
import { Word } from '../types'
import { X, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react'

const TOTAL = 10

type GameState = 'loading' | 'card' | 'done'

export default function Flashcards() {
  const navigate = useNavigate()
  const [deck, setDeck] = useState<Word[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [gameState, setGameState] = useState<GameState>('loading')
  const [known, setKnown] = useState(0)
  const [totalSeen, setTotalSeen] = useState(0)

  useEffect(() => {
    wordsApi.getRandom(TOTAL).then((res) => {
      setDeck(res.data.slice(0, TOTAL))
      setGameState('card')
    })
  }, [])

  function handleKnow(knew: boolean) {
    // Flip back first, then swap the card after animation completes
    setFlipped(false)
    const snapDeck = deck
    const snapIndex = current

    setTimeout(() => {
      setTotalSeen((s) => s + 1)
      if (knew) {
        setKnown((k) => k + 1)
        const next = snapDeck.filter((_, i) => i !== snapIndex)
        if (next.length === 0) {
          setGameState('done')
          return
        }
        setDeck(next)
        setCurrent(Math.min(snapIndex, next.length - 1))
      } else {
        const word = snapDeck[snapIndex]
        const next = [...snapDeck.filter((_, i) => i !== snapIndex), word]
        setDeck(next)
        setCurrent(Math.min(snapIndex, next.length - 1))
      }
    }, 520)
  }

  if (gameState === 'loading') {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400">Loading flashcards...</p>
      </div>
    )
  }

  if (gameState === 'done') {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl bg-green-50">
          🎉
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">All cards cleared!</h2>
        <p className="text-gray-500 mb-6">
          You knew {known} out of {totalSeen} attempts.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/lessons')}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Back to Lessons
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition font-medium"
          >
            New Round
          </button>
        </div>
      </div>
    )
  }

  const word = deck[current]
  const progress = 1 - deck.length / TOTAL

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate('/lessons')}
          className="text-gray-300 hover:text-gray-500 transition"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 tabular-nums">{deck.length} left</span>
      </div>

      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide text-center mb-6">
        {flipped ? 'English meaning' : 'Tap the card to reveal'}
      </p>

      {/* Flip card */}
      <div
        className="cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '220px',
          }}
        >
          {/* Front — Dholuo word */}
          <div
            className="absolute inset-0 bg-white border-2 border-gray-100 rounded-3xl flex flex-col items-center justify-center p-8 shadow-sm"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-5xl font-bold text-gray-800 text-center">{word.dholuo}</p>
            {word.part_of_speech && (
              <p className="text-gray-400 italic text-sm mt-3">{word.part_of_speech}</p>
            )}
            <div className="flex items-center gap-1.5 mt-6 text-gray-300 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              tap to flip
            </div>
          </div>

          {/* Back — English meaning */}
          <div
            className="absolute inset-0 bg-green-600 rounded-3xl flex flex-col items-center justify-center p-8 shadow-sm"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-3xl font-bold text-white text-center">{word.english[0]}</p>
            {word.english.length > 1 && (
              <p className="text-green-200 text-base mt-2 text-center">{word.english.slice(1).join(', ')}</p>
            )}
            {word.meanings && word.meanings[0] && (
              <p className="text-green-100/80 text-sm mt-4 text-center leading-relaxed">
                {word.meanings[0].text}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions — only show after flip */}
      {flipped && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => handleKnow(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
          >
            <ThumbsDown className="w-5 h-5" />
            Still learning
          </button>
          <button
            onClick={() => handleKnow(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-green-200 bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition"
          >
            <ThumbsUp className="w-5 h-5" />
            I knew it!
          </button>
        </div>
      )}
    </div>
  )
}
