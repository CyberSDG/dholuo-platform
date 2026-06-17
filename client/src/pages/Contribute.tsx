import { useState } from 'react'
import { wordsApi } from '../api'

type ContribType = 'new_word' | 'correction' | 'example' | 'audio'

export default function Contribute() {
  const [type, setType] = useState<ContribType>('new_word')
  const [contributor, setContributor] = useState('')
  const [dholuo, setDholuo] = useState('')
  const [english, setEnglish] = useState('')
  const [example, setExample] = useState('')
  const [exampleEn, setExampleEn] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await wordsApi.contribute({
        contributor: contributor || 'anonymous',
        type,
        payload: { dholuo, english, example, exampleEn, note },
      })
      setSubmitted(true)
    } catch {
      setError('Submission failed, please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">🙏</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank you for contributing!</h2>
        <p className="text-gray-500 mb-6">Your submission has been received and will be reviewed before being added to the dictionary.</p>
        <button onClick={() => setSubmitted(false)} className="bg-green-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-800 transition">
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Contribute</h1>
      <p className="text-gray-500 mb-8">
        Help preserve Dholuo by adding words, fixing translations, or sharing example sentences. Every contribution matters.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">What are you contributing?</label>
          <div className="flex gap-2 flex-wrap">
            {(['new_word', 'correction', 'example'] as ContribType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  type === t ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 text-gray-600 hover:border-green-400'
                }`}
              >
                {t === 'new_word' ? 'New Word' : t === 'correction' ? 'Fix a Translation' : 'Add Example'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Your name (optional)</label>
          <input
            type="text"
            value={contributor}
            onChange={(e) => setContributor(e.target.value)}
            placeholder="Anonymous"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Dholuo word *</label>
          <input
            required
            type="text"
            value={dholuo}
            onChange={(e) => setDholuo(e.target.value)}
            placeholder="e.g. chiemo"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">English meaning *</label>
          <input
            required
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="e.g. food"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Example sentence (Dholuo)</label>
          <input
            type="text"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder="e.g. Chiemo obed maber."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Example sentence (English)</label>
          <input
            type="text"
            value={exampleEn}
            onChange={(e) => setExampleEn(e.target.value)}
            placeholder="e.g. May the food be good."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cultural note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any cultural context, usage notes, or proverbs..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-green-700 text-white font-semibold py-3 rounded-full hover:bg-green-800 transition">
          Submit Contribution
        </button>
      </form>
    </div>
  )
}
