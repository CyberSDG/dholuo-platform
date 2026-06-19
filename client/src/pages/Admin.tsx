import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, LogOut } from 'lucide-react'
import api from '../api'

type Status = 'pending' | 'approved' | 'rejected'

interface Contribution {
  id: string
  type: 'new_word' | 'correction' | 'example'
  contributor: string
  payload: Record<string, string>
  status: Status
  created_at: string
  word_id: string | null
  word_dholuo: string | null
  word_english: string[] | null
}

interface Stats {
  total_words: string
  pending: string
  approved: string
  rejected: string
  total_users: string
}

function getTokenRole(): string | null {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch {
    return null
  }
}

export default function Admin() {
  const role = getTokenRole()
  const navigate = useNavigate()
  if (!role || role !== 'admin') return <Navigate to="/" replace />

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const [stats, setStats] = useState<Stats | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [statusFilter, setStatusFilter] = useState<Status>('pending')
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [statsRes, contribRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/contributions?status=${statusFilter}`),
      ])
      setStats(statsRes.data)
      setContributions(contribRes.data)
    } catch {
      // not admin or not logged in
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter])

  const act = async (id: string, action: 'approve' | 'reject') => {
    setActing(id)
    try {
      await api.post(`/admin/contributions/${id}/${action}`)
      setContributions((prev) => prev.filter((c) => c.id !== id))
      if (stats) {
        setStats((s) => s ? {
          ...s,
          pending: String(Number(s.pending) - 1),
          [action === 'approve' ? 'approved' : 'rejected']: String(
            Number(s[action === 'approve' ? 'approved' : 'rejected']) + 1
          ),
        } : s)
      }
    } finally {
      setActing(null)
    }
  }

  const typeLabel = (type: string) => {
    if (type === 'new_word') return 'New Word'
    if (type === 'correction') return 'Correction'
    if (type === 'example') return 'Example'
    return type
  }

  const typeBadgeClass = (type: string) => {
    if (type === 'new_word') return 'bg-blue-50 text-blue-700 border-blue-100'
    if (type === 'correction') return 'bg-amber-50 text-amber-700 border-amber-100'
    return 'bg-purple-50 text-purple-700 border-purple-100'
  }

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-10 text-gray-400">Loading...</div>

  if (!stats) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 text-lg mb-2">Admin access required.</p>
        <p className="text-gray-400 text-sm">You must be logged in as an admin to view this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Admin</h1>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
      <p className="text-gray-500 mb-8">Review and apply community contributions.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Words', value: stats.total_words },
          { label: 'Users', value: stats.total_users },
          { label: 'Pending', value: stats.pending, highlight: true },
          { label: 'Approved', value: stats.approved },
          { label: 'Rejected', value: stats.rejected },
        ].map(({ label, value, highlight }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${highlight ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'}`}>
            <p className={`text-2xl font-bold ${highlight ? 'text-amber-600' : 'text-gray-800'}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected'] as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition capitalize ${
              statusFilter === s ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 text-gray-600 hover:border-green-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Contributions list */}
      {contributions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No {statusFilter} contributions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeBadgeClass(c.type)}`}>
                    {typeLabel(c.type)}
                  </span>
                  <span className="text-sm text-gray-500">
                    by <span className="font-medium text-gray-700">{c.contributor || 'anonymous'}</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>

                {statusFilter === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => act(c.id, 'reject')}
                      disabled={acting === c.id}
                      className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => act(c.id, 'approve')}
                      disabled={acting === c.id}
                      className="flex items-center gap-1.5 text-sm text-white bg-green-700 px-3 py-1.5 rounded-full hover:bg-green-800 transition disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </div>
                )}
              </div>

              {/* Linked word */}
              {c.word_dholuo && (
                <p className="text-xs text-gray-400 mb-3">
                  Linked word: <span className="font-semibold text-gray-600">{c.word_dholuo}</span>
                  {c.word_english && <span className="ml-1 text-gray-400">— {c.word_english.join(', ')}</span>}
                </p>
              )}

              {/* Payload */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
                {Object.entries(c.payload).map(([key, value]) => {
                  if (!value || key === 'word_id') return null
                  return (
                    <div key={key} className="flex gap-2">
                      <span className="text-gray-400 capitalize w-36 flex-shrink-0">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-700">{String(value)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
