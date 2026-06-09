const BASE = SUPABASE_URL + '/rest/v1'
const HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

const db = {
  async getAll() {
    const res = await fetch(BASE + '/notes?order=createdAt.asc', {
      headers: HEADERS,
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  },

  async create(data) {
    const res = await fetch(BASE + '/notes', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(res.statusText)
    const [note] = await res.json()
    return note
  },

  async update(id, data) {
    const res = await fetch(BASE + '/notes?id=eq.' + id, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(res.statusText)
    const [note] = await res.json()
    return note
  },

  async remove(id) {
    const res = await fetch(BASE + '/notes?id=eq.' + id, {
      method: 'DELETE',
      headers: HEADERS,
    })
    if (!res.ok) throw new Error(res.statusText)
  },
}
