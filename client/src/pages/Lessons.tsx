import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shuffle, AlertCircle, ChevronRight, Layers } from 'lucide-react'

function getMistakesCount(): number {
  try {
    return JSON.parse(localStorage.getItem('dholuo_mistakes') || '[]').length
  } catch {
    return 0
  }
}

export default function Lessons() {
  const [mistakesCount, setMistakesCount] = useState(0)

  useEffect(() => {
    setMistakesCount(getMistakesCount())
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Lessons</h1>
      <p className="text-gray-500 mb-8">Practice and strengthen your Dholuo vocabulary.</p>

      <div className="space-y-4">
        <Link
          to="/lessons/flashcards"
          className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-blue-200 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Flashcards</h2>
              <p className="text-sm text-gray-500">Flip cards to reveal meanings. Keep going until you know them all.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition" />
        </Link>

        <Link
          to="/lessons/match"
          className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-green-200 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition">
              <Shuffle className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Word Match</h2>
              <p className="text-sm text-gray-500">Match Dholuo words with their English meanings.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition" />
        </Link>

        {mistakesCount > 0 ? (
          <Link
            to="/lessons/review"
            className="flex items-center justify-between bg-white rounded-2xl border border-amber-100 shadow-sm p-6 hover:border-amber-300 hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Review Mistakes</h2>
                <p className="text-sm text-gray-500">
                  {mistakesCount} word{mistakesCount > 1 ? 's' : ''} from past games to review.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                {mistakesCount}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-400 transition" />
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl border border-gray-100 p-6 opacity-60">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100">
              <AlertCircle className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-600">Review Mistakes</h2>
              <p className="text-sm text-gray-400">No mistakes yet — play Word Match first.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
