import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dictionary from './pages/Dictionary'
import WordDetail from './pages/WordDetail'
import Practice from './pages/Practice'
import Translate from './pages/Translate'
import Contribute from './pages/Contribute'
import About from './pages/About'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Lessons from './pages/Lessons'
import Chat from './pages/Chat'
import WordMatch from './pages/WordMatch'
import ReviewMistakes from './pages/ReviewMistakes'

function ComingSoon({ page }: { page: string }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Wrench className="w-7 h-7 text-gray-400" />
      </div>
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
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/match" element={<WordMatch />} />
        <Route path="/lessons/review" element={<ReviewMistakes />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
