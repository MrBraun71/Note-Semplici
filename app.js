const state = {
  notes: [],
  activeId: null,
  activeCategory: 'all',
  saveTimer: null,
}

const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => document.querySelectorAll(sel)

function escHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function escAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const CATEGORY_CONFIG = {
  all:      { color: '#2d6482', label: 'Tutte le note', icon: 'folder',     catColor: '#2d6482' },
  personal: { color: '#5B9BD5', label: 'Personali',     icon: 'person',     catColor: '#2d6482' },
  work:     { color: '#4ECDC4', label: 'Lavoro',        icon: 'work',       catColor: '#32675f' },
  ideas:    { color: '#B388DD', label: 'Idee',          icon: 'lightbulb',  catColor: '#6e557a' },
  drafts:   { color: '#A0AEC0', label: 'Bozze',         icon: 'edit',       catColor: '#71787e' },
}

function renderNoteList() {
  const container = $('#noteList')
  const mobileContainer = $('#mobileNoteList')
  const filtered = state.activeCategory === 'all'
    ? state.notes
    : state.notes.filter(n => n.category === state.activeCategory)

  const html = filtered.length === 0
    ? '<div class="text-center text-on-surface-variant/50 text-label-sm py-8">Nessuna nota qui</div>'
    : filtered.map(n => `
      <div class="note-item group flex items-center gap-3 px-3 py-2.5 rounded-xl ${n.id === state.activeId ? 'active' : ''}" data-id="${n.id}">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background: ${n.color}"></span>
        <div class="flex-1 min-w-0">
          <div class="note-title">${escHtml(n.title || 'Senza titolo')}</div>
          <div class="note-preview">${escHtml((n.content || '').split('\n')[0].slice(0, 60)) || '—'}</div>
        </div>
        <button class="delete-note shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant/30 hover:text-error hover:bg-error-container/50 transition-all opacity-0 group-hover:opacity-100" data-id="${n.id}">
          <span class="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>
    `).join('')

  container.innerHTML = html
  mobileContainer.innerHTML = html

  container.querySelectorAll('.note-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.delete-note')) return
      selectNote(el.dataset.id)
    })
  })
  mobileContainer.querySelectorAll('.note-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.delete-note')) return
      selectNote(el.dataset.id)
      closeDrawer()
    })
  })
  container.querySelectorAll('.delete-note').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); deleteNote(btn.dataset.id) })
  })
  mobileContainer.querySelectorAll('.delete-note').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); deleteNote(btn.dataset.id) })
  })

  $('#noteCount').textContent = `${filtered.length} ${filtered.length === 1 ? 'nota' : 'note'}`
}

function renderEditor() {
  const canvas = $('#editorCanvas')
  const note = state.notes.find(n => n.id === state.activeId)

  if (!note) {
    canvas.innerHTML = '<p class="empty-msg text-center text-on-surface-variant/50 my-20">Seleziona o crea una nota</p>'
    return
  }

  const cat = CATEGORY_CONFIG[note.category] || CATEGORY_CONFIG.ideas

  canvas.innerHTML = `
    <div class="flex items-start justify-between gap-4">
      <input type="text" class="editor-title-input w-full bg-transparent border-none p-0 text-display-lg font-bold text-on-surface focus:ring-0 placeholder:text-on-surface-variant/40" placeholder="Senza titolo" value="${escAttr(note.title)}">
      <button id="deleteNoteBtn" class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-error hover:bg-error-container/60 transition-all" title="Elimina nota">
        <span class="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
    <div class="flex gap-2 flex-wrap mb-2">
      <span class="px-3 py-1 rounded-full text-label-sm flex items-center gap-1.5 border border-white/40 backdrop-blur-md" style="background: ${cat.color}20; color: ${cat.catColor}">
        <span class="w-2 h-2 rounded-full" style="background: ${cat.catColor}"></span>
        ${cat.label}
      </span>
    </div>
    <div class="editor-content-area w-full flex-1 bg-transparent border-none p-0 text-body-lg text-on-surface/90 focus:outline-none leading-relaxed min-h-[300px]" contenteditable="true">${note.content || ''}</div>
  `

  const titleInput = canvas.querySelector('.editor-title-input')
  const contentArea = canvas.querySelector('.editor-content-area')

  titleInput.addEventListener('input', () => scheduleSave())
  contentArea.addEventListener('input', () => scheduleSave())
  contentArea.addEventListener('focus', () => {
    if (contentArea.innerHTML === '<br>' || contentArea.textContent === '') {
      contentArea.innerHTML = ''
    }
  })

  $('#deleteNoteBtn').addEventListener('click', () => {
    if (confirm('Eliminare questa nota?')) deleteNote(note.id)
  })
}

function closeDrawer() {
  $('#mobileDrawer').classList.add('hidden')
}

function selectNote(id) {
  state.activeId = id
  const note = state.notes.find(n => n.id === id)
  if (note && note.category && state.activeCategory !== 'all') {
    state.activeCategory = note.category
    updateCategoryUI()
  }
  renderNoteList()
  renderEditor()
}

function setCategory(cat) {
  state.activeCategory = cat
  updateCategoryUI()
  renderNoteList()

  const filtered = cat === 'all'
    ? state.notes
    : state.notes.filter(n => n.category === cat)

  const stillActive = state.activeId && filtered.find(n => n.id === state.activeId)
  if (!stillActive) {
    state.activeId = filtered[0]?.id ?? null
  }
  renderEditor()
}

function updateCategoryUI() {
  const cat = CATEGORY_CONFIG[state.activeCategory]

  $$('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === state.activeCategory)
  })
  $$('.cat-btn-mobile').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === state.activeCategory)
  })

  $('#breadcrumb').innerHTML = `
    <span class="material-symbols-outlined text-[18px]" style="color: ${cat.color}">${cat.icon}</span>
    <span>${cat.label}</span>
  `
  $('#activeCategoryLabel').textContent = cat.label
}

async function loadNotes() {
  try {
    state.notes = await db.getAll()
    state.notes.forEach(n => { if (!n.category) n.category = 'ideas' })
    if (state.notes.length > 0) {
      state.activeId = state.notes[0].id
      const note = state.notes[0]
      if (note.category) state.activeCategory = note.category
    }
    updateCategoryUI()
    renderNoteList()
    renderEditor()
  } catch (err) {
    $('#editorCanvas').innerHTML = `<p class="empty-msg text-center text-on-surface-variant/50 my-20">Errore di connessione<br><small>${escHtml(err.message)}</small></p>`
  }
}

async function addNote() {
  const cat = state.activeCategory === 'all' ? 'ideas' : state.activeCategory
  const config = CATEGORY_CONFIG[cat]
  try {
    const note = await db.create({ title: 'Nuova nota', content: '', color: config.color, category: cat })
    state.notes.push(note)
    state.activeId = note.id
    state.activeCategory = cat
    updateCategoryUI()
    renderNoteList()
    renderEditor()
  } catch (err) {
    alert('Errore creazione: ' + err.message)
  }
}

async function deleteNote(id) {
  try {
    await db.remove(id)
    state.notes = state.notes.filter(n => n.id !== id)
    if (state.activeId === id) {
      const idx = state.notes.findIndex(n => n.id === id)
      const next = Math.min(idx === -1 ? 0 : idx, state.notes.length - 1)
      state.activeId = state.notes[next]?.id ?? null
    }
    renderNoteList()
    renderEditor()
  } catch (err) {
    alert('Errore eliminazione: ' + err.message)
  }
}

function scheduleSave() {
  clearTimeout(state.saveTimer)
  state.saveTimer = setTimeout(saveCurrentNote, 600)
}

async function saveCurrentNote() {
  const note = state.notes.find(n => n.id === state.activeId)
  if (!note) return

  const title = document.querySelector('.editor-title-input')?.value ?? note.title
  const el = document.querySelector('.editor-content-area')
  const content = el ? el.innerHTML : note.content

  try {
    const updated = await db.update(note.id, { title, content })
    Object.assign(note, updated)
    renderNoteList()
  } catch (err) {
    console.error('Save error:', err)
  }
}

// Toolbar formatting
document.addEventListener('mousedown', (e) => {
  const btn = e.target.closest('.toolbar-btn')
  if (!btn) return
  e.preventDefault()
  const contentArea = document.querySelector('.editor-content-area')
  if (!contentArea) return

  const cmd = btn.dataset.cmd
  const param = btn.dataset.param

  if (cmd === 'heading') {
    document.execCommand('formatBlock', false,
      contentArea.querySelector('h3') ? 'p' : 'h3')
  } else {
    document.execCommand(cmd, false, param || null)
  }
  contentArea.focus()
  scheduleSave()
})

// Events
$('#addBtn').addEventListener('click', addNote)

$$('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => setCategory(btn.dataset.cat))
})
$$('.cat-btn-mobile').forEach(btn => {
  btn.addEventListener('click', () => { setCategory(btn.dataset.cat); closeDrawer() })
})

$('#menuBtn').addEventListener('click', () => $('#mobileDrawer').classList.remove('hidden'))
$('#closeDrawer').addEventListener('click', closeDrawer)
$('#drawerBackdrop').addEventListener('click', closeDrawer)

loadNotes()
