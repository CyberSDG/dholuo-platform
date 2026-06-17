import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dictionary from './pages/Dictionary'
import WordDetail from './pages/WordDetail'
import Practice from './pages/Practice'
import Translate from './pages/Translate'
import Contribute from './pages/Contribute'

function ComingSoon({ page }: { page: string }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <p className="text-5xl mb-4">🚧</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{page} coming soon</h2>
      <p className="text-gray-500">This page is being built. Check back soon.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/dictionary/:id" element={<WordDetail />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/lessons" element={<ComingSoon page="Lessons" />} />
        <Route path="/chat" element={<ComingSoon page="AI Chat" />} />
      </Routes>
    </BrowserRouter>
  )
}
