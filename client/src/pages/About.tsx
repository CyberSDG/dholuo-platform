import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const values = [
  {
    title: 'Community-owned',
    desc: 'This platform is open source and built by contributors — developers, native speakers, teachers, and learners. No single institution controls it.',
  },
  {
    title: 'Language-first',
    desc: 'Every decision is made in service of the language. Accuracy matters more than speed. Cultural context matters as much as translation.',
  },
  {
    title: 'Regionally inclusive',
    desc: 'Dholuo varies across Nyanza — South Nyanza, Central Nyanza, Nyando, Ugenya, and beyond. We represent all variants, not just one standardized form.',
  },
  {
    title: 'Built for this generation',
    desc: 'Many of us grew up understanding Dholuo but not speaking it confidently. This platform is designed for that specific experience — reconnecting, not starting from zero.',
  },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">

      {/* Hero */}
      <div className="mb-14">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-snug">
          Why Dholuo.learn exists
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Dholuo is spoken by millions of people across Kenya, Tanzania, and East Africa. It carries proverbs, histories, and ways of understanding the world that exist nowhere else. But in 2025, if you wanted to learn it seriously — especially as a young person who grew up speaking English at school and Dholuo only at home, if at all — there was almost nowhere to go.
        </p>
      </div>

      {/* The problem */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">The gap</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          A growing number of young Luo people — in Nairobi, in Kisumu, in London, in Houston — can understand Dholuo when they hear it but cannot speak it with confidence. They were not taught formally. The language was around them, but the tools to engage with it on their own terms were not.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Existing resources were either academic dictionaries, out-of-print books, or scattered YouTube videos. Nothing modern. Nothing interactive. Nothing built for someone who already has a smartphone in their hand and twenty minutes on the matatu.
        </p>
      </div>

      {/* What we are building */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What this is</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Dholuo.learn is a free, open-source language learning platform. It combines a searchable dictionary, structured lessons, flashcard practice, and an AI conversation partner — all in one place, all focused on Dholuo.
        </p>
        <p className="text-gray-600 leading-relaxed">
          But more than a product, it is a community effort. The dictionary is built from real sources — digitized academic dictionaries, native speaker contributions, and community corrections. Anyone can contribute a word. Anyone can fix a translation. The language belongs to its speakers, and so does this platform.
        </p>
      </div>

      {/* Values */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">What we stand for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map((v) => (
            <div key={v.title} className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <h3 className="font-bold text-green-800 mb-2">{v.title}</h3>
              <p className="text-green-900 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Language note */}
      <div className="mb-14 bg-amber-50 border border-amber-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-amber-800 mb-3">A note on accuracy</h2>
        <p className="text-amber-900 text-sm leading-relaxed">
          Dholuo has regional variations. A word used in South Nyanza may differ from the same concept in Central Nyanza or Ugenya. We do not standardize these away — we mark them. If you see something incorrect, missing, or better expressed another way, please contribute. Native speaker knowledge is the most valuable thing this project has.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Get involved</h2>
        <p className="text-gray-500 mb-6 max-w-lg mx-auto">
          Whether you are a developer, a native speaker, a teacher, or someone who just wants to reconnect with the language — there is a place for you here.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/contribute"
            className="bg-green-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-800 transition"
          >
            Contribute a Word
          </Link>
          <a
            href="https://github.com/CyberSDG/dholuo-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-full hover:border-green-400 hover:text-green-700 transition inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
