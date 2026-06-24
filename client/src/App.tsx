import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Flashcards from './pages/Flashcards'


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
        <Route path="/lessons/flashcards" element={<Flashcards />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
