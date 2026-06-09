# Simple Appunti

App note-taking leggera con design glassmorphic (Lumina Edit), backend Supabase e database PostgreSQL.

## Screenshot

Layout a 3 colonne: navigazione icone, lista note, editor. Tema chiaro con gradienti pastello, pannelli vetrosi e tipografia Inter.

## Tecnologie

- **Frontend:** HTML + Tailwind CSS + JavaScript vanilla (nessun framework o SDK)
- **Backend:** Supabase (PostgreSQL) tramite API REST diretta (`fetch`)
- **Design system:** Lumina — palette pastello, glassmorphism, rounded-xl

## Setup

### 1. Database

Esegui `supabase-schema.sql` nell'SQL Editor di Supabase per creare la tabella `notes`.

In alternativa, se usi Prisma:

```bash
npx prisma db push
```

### 2. Configurazione

Modifica `config.js` (nella root) con i dati del tuo progetto Supabase:

```js
const SUPABASE_URL    = 'https://tuo-progetto.supabase.co'
const SUPABASE_ANON_KEY = 'la-tua-chiave-anon'
```

Trovi URL e chiave in: **Supabase Dashboard → Project Settings → API**.

### 3. Avvio

Apri `index.html` nel browser (doppio click o drag & drop).

Non serve un server HTTP — funziona direttamente da `file://`.

## Struttura

```
├── index.html           # Layout principale (Lumina Edit)
├── style.css            # Glassmorphism, scrollbar, utility
├── app.js               # CRUD, rendering, categorie, formattazione
├── db.js                # API REST Supabase via fetch
├── config.js            # URL + chiave Supabase
├── prisma/
│   └── schema.prisma    # Schema Prisma (opzionale)
├── supabase-schema.sql  # SQL per creare la tabella
├── .env.example         # Template variabili d'ambiente
└── README.md
```

## Funzionalità

- Creazione, modifica ed eliminazione note
- **Formattazione testo rich text** (grassetto, corsivo, sottolineato, elenchi, blockquote, heading)
- Toolbar flottante con glassmorphism
- Salvataggio automatico (600ms dopo l'ultima digitazione)
- Categorie filtro: Personali, Lavoro, Idee, Bozze
- Sidebar navigazione icone (desktop) / drawer (mobile)
- Eliminazione nota dall'editor o dalla lista
- Design responsive con glassmorphism
- Colori pastello per categoria
- Nessuna dipendenza esterna oltre a Tailwind CSS e Google Fonts

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

## Note tecniche

- `db.js` chiama l'API REST di Supabase direttamente con `fetch` — nessun SDK necessario
- L'editor usa `contenteditable` per il rich text, il contenuto viene salvato come HTML
- La toolbar usa `document.execCommand()` per la formattazione
- CORS gestito automaticamente da Supabase

## Debug

Apri **DevTools (F12) → Console** per vedere eventuali errori. Verifica le richieste API nel tab **Network**.
