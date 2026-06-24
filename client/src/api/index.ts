import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const wordsApi = {
  search: (params: { q?: string; category?: string; difficulty?: string; limit?: number; offset?: number }) =>
    api.get('/words/search', { params }),

  getWord: (id: string) =>
    api.get(`/words/${id}`),

  getCategories: () =>
    api.get('/words/categories'),

  getRandom: (limit = 10, category?: string) =>
    api.get('/words/random', { params: { limit, category } }),

  contribute: (payload: { word_id?: string; contributor?: string; type: string; payload: object }) =>
    api.post('/words/contribute', payload),
}

export const translateApi = {
  translate: (text: string, source = 'en', target = 'luo') =>
    api.post('/translate', { text, source, target }),
}

export const chatApi = {
  send: (messages: { role: 'user' | 'assistant'; content: string }[]) =>
    api.post('/chat', { messages }),
}

export const authApi = {
  register: (email: string, username: string, password: string) =>
    api.post('/auth/register', { email, username, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  me: () =>
    api.get('/auth/me'),
}

export default api
