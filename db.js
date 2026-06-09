const TABLE = 'notes'

function initSupabase() {
  if (!window.supabase) {
    throw new Error('Supabase non caricato: verifica connessione internet e URL CDN')
  }
  const { createClient } = window.supabase
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

let supabase
try {
  supabase = initSupabase()
} catch (e) {
  console.error('Supabase init error:', e)
  supabase = null
}

const db = {
  async getAll() {
    if (!supabase) throw new Error('Supabase non inizializzato')
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('createdAt', { ascending: true })
    if (error) throw error
    return data
  },

  async create(data) {
    if (!supabase) throw new Error('Supabase non inizializzato')
    const { data: note, error } = await supabase
      .from(TABLE)
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return note
  },

  async update(id, data) {
    if (!supabase) throw new Error('Supabase non inizializzato')
    const { data: note, error } = await supabase
      .from(TABLE)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return note
  },

  async remove(id) {
    if (!supabase) throw new Error('Supabase non inizializzato')
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}