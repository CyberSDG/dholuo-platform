import { useState } from 'react'
import { translateApi } from '../api'

export default function Translate() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [direction, setDirection] = useState<'en-luo' | 'luo-en'>('en-luo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTranslate = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      const [source, target] = direction === 'en-luo' ? ['en', 'luo'] : ['luo', 'en']
      const res = await translateApi.translate(text, source, target)
      setResult(res.data.translated)
    } catch {
      setError('Translation failed. Make sure the API key is configured.')
    } finally {
      setLoading(false)
    }
  }

  const swap = () => {
    setDirection((d) => (d === 'en-luo' ? 'luo-en' : 'en-luo'))
    setText(result)
    setResult(text)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Translator</h1>
      <p className="text-gray-500 mb-8">
        Quick English ↔ Dholuo translation via Google Translate.{' '}
        <span className="text-amber-600 text-sm">Note: AI translation isn't perfect — verify important words in the dictionary.</span>
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-semibold text-gray-700 w-24">
            {direction === 'en-luo' ? 'English' : 'Dholuo'}
          </span>
          <button
            onClick={swap}
            className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            ⇄ Swap
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {direction === 'en-luo' ? 'Dholuo' : 'English'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={direction === 'en-luo' ? 'Type English here...' : 'Type Dholuo here...'}
            rows={5}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 min-h-[120px]">
            {loading ? (
              <span className="text-gray-400">Translating...</span>
            ) : result ? (
              <span className="text-gray-800">{result}</span>
            ) : (
              <span className="text-gray-400">Translation will appear here...</span>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="mt-4 bg-green-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  )
}
