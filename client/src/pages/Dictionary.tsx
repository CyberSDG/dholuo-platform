import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { wordsApi } from '../api'
import type { Word } from '../types'

export default function Dictionary() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    wordsApi.getCategories().then((r) => setCategories(r.data))
  }, [])

  const search = useCallback(async () => {
    setLoading(true)
    try {
      const res = await wordsApi.search({ q: query, category })
      setWords(res.data.data)
      setTotal(res.data.total)
    } finally {
      setLoading(false)
    }
  }, [query, category])

  useEffect(() => {
    const t = setTimeout(search, 300)
    return () => clearTimeout(t)
  }, [search])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dictionary</h1>
      <p className="text-gray-500 mb-8">Search Dholuo words or their English meanings.</p>

      <div className="flex gap-3 mb-8 flex-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. akuru, fish, love..."
          className="flex-1 min-w-60 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400 text-sm">Searching...</p>}

      {!loading && words.length === 0 && query && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No results for "{query}"</p>
          <Link to="/contribute" className="text-green-600 hover:underline text-sm">
            Know this word? Contribute it →
          </Link>
        </div>
      )}

      {!loading && words.length === 0 && !query && (
        <p className="text-gray-400 text-sm">Type something to search the dictionary.</p>
      )}

      {words.length > 0 && (
        <>
          <p className="text-gray-400 text-sm mb-4">{total} results</p>
          <div className="space-y-3">
            {words.map((word) => (
              <Link
                key={word.id}
                to={`/dictionary/${word.id}`}
                className="block bg-white rounded-xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-sm transition"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-bold text-gray-800">{word.dholuo}</span>
                  {word.part_of_speech && (
                    <span className="text-xs text-gray-400 italic">{word.part_of_speech}</span>
                  )}
                  {word.plural && (
                    <span className="text-xs text-gray-400">pl: {word.plural}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{word.english.join(', ')}</p>
                {word.category && word.category.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {word.category.map((c) => (
                      <span key={c} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
