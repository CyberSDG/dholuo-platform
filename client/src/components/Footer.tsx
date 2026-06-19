import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-16 px-6 py-8 text-center">
      <p className="text-xs text-gray-400">
        © {new Date().getFullYear()} Dholuo.learn — open source language platform
        <span className="mx-2 text-gray-200">|</span>
        <Link to="/login" className="text-gray-400 hover:text-gray-600 transition">
          Login
        </Link>
      </p>
    </footer>
  )
}
