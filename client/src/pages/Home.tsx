import { Link } from 'react-router-dom'

const features = [
  { icon: '📖', title: 'Dictionary', desc: 'Search thousands of Dholuo words with meanings, examples and cultural context.', href: '/dictionary' },
  { icon: '🃏', title: 'Practice', desc: 'Flashcard drills that adapt to what you know and what you\'re still learning.', href: '/practice' },
  { icon: '📚', title: 'Lessons', desc: 'Structured lessons from greetings to advanced conversation, grouped by topic.', href: '/lessons' },
  { icon: '🔄', title: 'Translator', desc: 'Quick English ↔ Dholuo translation for words not yet in our dictionary.', href: '/translate' },
  { icon: '🤖', title: 'AI Chat', desc: 'Practice real conversation with an AI that teaches as you go.', href: '/chat' },
  { icon: '🤝', title: 'Contribute', desc: 'Add words, fix translations, share cultural knowledge. Built by the community.', href: '/contribute' },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white px-6 py-24 text-center">
        <p className="text-green-300 text-sm font-semibold tracking-widest uppercase mb-4">Dholuo Learning Platform</p>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Learn Dholuo.<br />Reconnect with your roots.
        </h1>
        <p className="text-green-100 text-xl max-w-2xl mx-auto mb-10">
          A modern, community-driven platform for young Luo people and anyone who wants to learn Dholuo — the language, the culture, the identity.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/lessons" className="bg-white text-green-800 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition">
            Start Learning
          </Link>
          <Link to="/dictionary" className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition">
            Browse Dictionary
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Everything you need to learn Dholuo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.href}
              to={f.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition group"
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-700 transition">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Community CTA */}
      <section className="bg-green-50 border-t border-green-100 px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Built by the community, for the community</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-6">
          This is an open source project. If you know a word that's missing, a better translation, or a proverb worth preserving — contribute it.
        </p>
        <Link to="/contribute" className="bg-green-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-800 transition">
          Contribute a Word
        </Link>
      </section>
    </main>
  )
}
