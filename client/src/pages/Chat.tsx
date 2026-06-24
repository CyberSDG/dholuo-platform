import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { chatApi } from '../api'

type Message = {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'How do I say "good morning" in Dholuo?',
  'Teach me numbers 1 to 5',
  'What does "Amari" mean?',
  'How do I greet an elder?',
]

let nextId = 1

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId++,
      role: 'assistant',
      content:
        'Misawa! I\'m your Dholuo tutor. Ask me anything — vocabulary, grammar, pronunciation, or culture. How can I help you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { id: nextId++, role: 'user', content: trimmed }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const history = updated.map((m) => ({ role: m.role, content: m.content }))
      const res = await chatApi.send(history)
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: 'assistant', content: res.data.reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId++,
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">Dholuo Tutor</h1>
            <p className="text-xs text-gray-400">Powered by Llama 3.3</p>
          </div>
          <span className="ml-auto text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            May make mistakes
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}
            >
              {msg.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-green-700" />
              ) : (
                <User className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'assistant'
                  ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                  : 'bg-green-600 text-white rounded-tr-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-green-700" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions — only show before any user message */}
      {messages.filter((m) => m.role === 'user').length === 0 && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-green-400 transition">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something in English or Dholuo..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder-gray-400 max-h-32"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
