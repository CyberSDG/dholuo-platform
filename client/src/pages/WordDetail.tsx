import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { wordsApi } from '../api'
import type { Word } from '../types'

export default function WordDetail() {
  const { id } = useParams<{ id: string }>()
  const [word, setWord] = useState<Word | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    wordsApi.getWord(id)
      .then((r) => setWord(r.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-10 text-gray-400">Loading...</div>
  if (!word) return <div className="max-w-3xl mx-auto px-6 py-10 text-gray-400">Word not found.</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/dictionary" className="text-green-600 text-sm hover:underline mb-6 block">← Back to Dictionary</Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-baseline gap-4 mb-2">
          <h1 className="text-4xl font-bold text-gray-800">{word.dholuo}</h1>
          {word.part_of_speech && (
            <span className="text-gray-400 italic text-sm">{word.part_of_speech}</span>
          )}
        </div>

        {word.plural && <p className="text-sm text-gray-400 mb-4">plural: <span className="font-medium text-gray-600">{word.plural}</span></p>}

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Meanings</h2>
          {word.meanings && word.meanings.length > 0 ? (
            <ol className="space-y-1 list-decimal list-inside">
              {word.meanings.map((m, i) => (
                <li key={i} className="text-gray-700">
                  {m.text}
                  {m.notes && <span className="text-gray-400 italic text-sm ml-1">({m.notes})</span>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-700">{word.english.join(', ')}</p>
          )}
        </div>

        {word.examples && word.examples.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Examples</h2>
            <div className="space-y-3">
              {word.examples.map((ex, i) => (
                <div key={i} className="bg-green-50 rounded-xl px-4 py-3">
                  <p className="font-semibold text-green-800">{ex.dholuo}</p>
                  <p className="text-green-700 text-sm">{ex.english}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {word.cultural_note && (
          <div className="mb-6 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <h2 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Cultural Note</h2>
            <p className="text-amber-800 text-sm">{word.cultural_note}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
          {word.regional && word.regional.length > 0 && (
            <span>Region: <span className="text-gray-700">{word.regional.join(', ')}</span></span>
          )}
          {word.synonyms && word.synonyms.length > 0 && (
            <span>Synonyms: <span className="text-gray-700">{word.synonyms.join(', ')}</span></span>
          )}
          {word.related && word.related.length > 0 && (
            <span>See also: <span className="text-gray-700">{word.related.join(', ')}</span></span>
          )}
          <span>Difficulty: <span className="text-gray-700 capitalize">{word.difficulty}</span></span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link to="/contribute" className="text-sm text-green-600 hover:underline">
          Something wrong or missing? Suggest a correction →
        </Link>
      </div>
    </div>
  )
}
