import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/dictionary', label: 'Dictionary' },
  { to: '/lessons', label: 'Lessons' },
  { to: '/practice', label: 'Practice' },
  { to: '/translate', label: 'Translate' },
  { to: '/chat', label: 'AI Chat' },
  { to: '/contribute', label: 'Contribute' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-green-700 text-lg tracking-tight">
          Dholuo<span className="text-gray-400 font-normal">.learn</span>
        </Link>
        <div className="flex items-center gap-1 flex-wrap">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
