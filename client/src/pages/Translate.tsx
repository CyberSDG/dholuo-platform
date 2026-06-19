import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight } from 'lucide-react'
import { wordsApi } from '../api'
import type { Word } from '../types'

type Direction = 'en-luo' | 'luo-en'

export default function Translate() {
  const [text, setText] = useState('')
  const [direction, setDirection] = useState<Direction>('en-luo')
  const [results, setResults] = useState<Word[]>([])
  const [loading, setLoading] = useState(false)

  const lookup = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await wordsApi.search({ q: q.trim(), limit: 5 })
      setResults(res.data.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => lookup(text), 350)
    return () => clearTimeout(t)
  }, [text, lookup])

  const swap = () => {
    setDirection((d) => (d === 'en-luo' ? 'luo-en' : 'en-luo'))
    setText('')
    setResults([])
  }

  const fromLabel = direction === 'en-luo' ? 'English' : 'Dholuo'
  const toLabel = direction === 'en-luo' ? 'Dholuo' : 'English'
  const placeholder = direction === 'en-luo' ? 'e.g. love, water, mother...' : 'e.g. hera, pi, dhako...'

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Translator</h1>
      <p className="text-gray-500 mb-1">
        Look up words between English and Dholuo using our community dictionary.
      </p>
      <p className="text-amber-600 text-sm mb-8">
        This is a word lookup, not sentence translation. For full sentences, the dictionary is your best tool.
      </p>

      {/* Direction toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-semibold text-gray-700 w-20 text-right">{fromLabel}</span>
        <button
          onClick={swap}
          className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-green-100 transition"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Swap
        </button>
        <span className="font-semibold text-gray-700 w-20">{toLabel}</span>
      </div>

      {/* Input */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full text-xl text-gray-800 focus:outline-none placeholder-gray-300"
          autoFocus
        />
        {text && (
          <button
            onClick={() => { setText(''); setResults([]) }}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {loading && (
        <p className="text-gray-400 text-sm px-2">Looking up...</p>
      )}

      {!loading && text && results.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-gray-500 mb-2">No results found for "<span className="font-medium">{text}</span>"</p>
          <Link to="/contribute" className="text-green-600 text-sm hover:underline">
            Know this word? Add it to the dictionary →
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((word) => (
            <div key={word.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <div className="flex items-baseline gap-3">
                  {/* Show from → to based on direction */}
                  <span className="text-2xl font-bold text-gray-800">
                    {direction === 'en-luo' ? word.dholuo : word.english.join(', ')}
                  </span>
                  {word.part_of_speech && (
                    <span className="text-xs text-gray-400 italic">{word.part_of_speech}</span>
                  )}
                </div>
                <Link
                  to={`/dictionary/${word.id}`}
                  className="text-xs text-green-600 hover:underline flex-shrink-0"
                >
                  Full entry →
                </Link>
              </div>

              <p className="text-gray-500 text-sm">
                {direction === 'en-luo' ? word.english.join(', ') : word.dholuo}
              </p>

              {/* Show Dholuo definition if available */}
              {word.meanings && word.meanings.length > 0 && (
                <p className="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-2">
                  {word.meanings[0].text}
                </p>
              )}

              {word.examples && word.examples.length > 0 && (
                <div className="mt-3 bg-green-50 rounded-xl px-3 py-2 border border-green-100">
                  <p className="text-green-800 text-sm font-medium">{word.examples[0].dholuo}</p>
                  <p className="text-green-600 text-xs mt-0.5">{word.examples[0].english}</p>
                </div>
              )}
            </div>
          ))}

          {results.length === 5 && (
            <p className="text-center text-sm text-gray-400">
              Showing top 5 results.{' '}
              <Link to={`/dictionary?q=${encodeURIComponent(text)}`} className="text-green-600 hover:underline">
                See all in dictionary →
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
