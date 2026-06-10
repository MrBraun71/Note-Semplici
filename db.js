if (!window.supabase) {
  throw new Error('Supabase non caricato: verifica connessione internet e URL CDN')
}
const { createClient } = window.supabase
const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)

const TABLE = 'notes'

const db = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('createdAt', { ascending: true })
    if (error) throw error
    return data
  },

  async create(data) {
    const { data: note, error } = await supabase
      .from(TABLE)
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return note
  },

  async update(id, data) {
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
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}

window.db = db;