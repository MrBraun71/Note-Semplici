# Simple Appunti

App note-taking leggera con design glassmorphic (Lumina Edit), backend Supabase e database PostgreSQL.

## Screenshot

Layout a 3 colonne: navigazione icone, lista note, editor. Tema chiaro con gradienti pastello, pannelli vetrosi e tipografia Inter.

## Tecnologie

- **Frontend:** HTML + Tailwind CSS + JavaScript vanilla
- **Backend:** Supabase (PostgreSQL)
- **Design system:** Lumina — palette pastello, glassmorphism, rounded-xl

## Setup

### 1. Database

Esegui `supabase-schema.sql` nell'SQL Editor di Supabase per creare la tabella `notes`.

In alternativa, se usi Prisma:

```bash
npx prisma db push
```

### 2. Configurazione

Modifica `frontend/config.js` con i dati del tuo progetto Supabase:

```js
const SUPABASE_URL    = 'https://tuo-progetto.supabase.co'
const SUPABASE_ANON_KEY = 'la-tua-chiave-anon'
```

Trovi URL e chiave in: **Supabase Dashboard → Project Settings → API**.

### 3. Avvio

Apri `frontend/index.html` nel browser (doppio click o drag & drop).

Non serve un server HTTP — funziona direttamente da `file://`.

## Struttura

```
├── frontend/
│   ├── index.html        # Layout principale (Lumina Edit)
│   ├── style.css         # Glassmorphism, scrollbar, utility
│   ├── app.js            # CRUD, rendering, categorie
│   ├── db.js             # Client Supabase + query
│   └── config.js         # URL + chiave Supabase
├── prisma/
│   └── schema.prisma     # Schema Prisma (opzionale)
├── supabase-schema.sql   # SQL per creare la tabella
├── .env.example          # Template variabili d'ambiente
└── README.md
```

## Funzionalità

- Creazione, modifica ed eliminazione note
- Salvataggio automatico (600ms dopo l'ultima digitazione)
- Categorie filtro: Personali, Lavoro, Idee, Bozze
- Sidebar navigazione icone (desktop) / drawer (mobile)
- Design responsive con glassmorphism
- Colori pastello per categoria

## Schema tabella

```sql
notes
├── id        TEXT     PRIMARY KEY
├── title     TEXT     DEFAULT 'Nuova nota'
├── content   TEXT     DEFAULT ''
├── color     TEXT     DEFAULT '#B388DD'
├── category  TEXT     DEFAULT 'ideas'
├── createdAt TIMESTAMPTZ
└── updatedAt TIMESTAMPTZ
```

## Debug

Apri **DevTools (F12) → Console** per vedere eventuali errori. Verifica che lo script Supabase si carichi correttamente nel tab **Network**.
