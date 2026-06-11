// Try to initialize Supabase if SDK is available
let supabase = null
if (typeof window.supabase !== 'undefined') {
  try {
    supabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    )
  } catch (e) {
    console.warn('Supabase initialization failed:', e)
    supabase = null
  }
}

const db = {
  async getAll() {
    // If Supabase is available, try to fetch from it
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('createdat', { ascending: true })
        
        if (!error && data) {
          return data
        }
      } catch (e) {
        console.warn('Supabase fetch failed:', e)
      }
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('notes')
    return stored ? JSON.parse(stored) : []
  },

  async create(data) {
    const note = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
      ...data
    }
    
    // Try Supabase first
    if (supabase) {
      try {
        const { data: result, error } = await supabase
          .from('notes')
          .insert([note])
          .select()
        
        if (!error && result?.[0]) {
          return result[0]
        }
      } catch (e) {
        console.warn('Supabase create failed:', e)
      }
    }
    
    // Fallback to localStorage
    const notes = await this.getAll()
    notes.push(note)
    localStorage.setItem('notes', JSON.stringify(notes))
    return note
  },

  async update(id, data) {
    const updateData = {
      ...data,
      updatedat: new Date().toISOString()
    }
    
    // Try Supabase first
    if (supabase) {
      try {
        const { data: result, error } = await supabase
          .from('notes')
          .update(updateData)
          .eq('id', id)
          .select()
        
        if (!error && result?.[0]) {
          return result[0]
        }
      } catch (e) {
        console.warn('Supabase update failed:', e)
      }
    }
    
    // Fallback to localStorage
    const notes = await this.getAll()
    const idx = notes.findIndex(n => n.id === id)
    if (idx >= 0) {
      notes[idx] = { ...notes[idx], ...updateData }
      localStorage.setItem('notes', JSON.stringify(notes))
      return notes[idx]
    }
    throw new Error('Note not found')
  },

  async remove(id) {
    // Try Supabase first
    if (supabase) {
      try {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id)
        
        if (!error) {
          return
        }
      } catch (e) {
        console.warn('Supabase delete failed:', e)
      }
    }
    
    // Fallback to localStorage
    const notes = await this.getAll()
    const filtered = notes.filter(n => n.id !== id)
    localStorage.setItem('notes', JSON.stringify(filtered))
  },
}

window.db = db;

