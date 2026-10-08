YUNG NETWORK — NEWS ADMIN

FILE E DEPLOY
I file del sito si trovano nella cartella YungNetworksitoWeb.
La Root Directory di Vercel deve essere impostata su YungNetworksitoWeb.
Questo aggiornamento serve a far partire un nuovo deploy automatico da GitHub.

PANNELLO NEWS
- admin.html / admin.js: accesso e gestione delle news.
- news.js: mostra nella homepage le news pubblicate.
- supabase-config.js: configurazione pubblica di Supabase.
- supabase-schema.sql: schema e policy Row Level Security.

CONFIGURAZIONE
1. In Supabase SQL Editor esegui supabase-schema.sql.
2. In Authentication > Users crea l'utente amministratore.
3. Inserisci l'UUID dell'utente nella tabella public.admin_users.
4. Verifica Project URL e publishable key in supabase-config.js.
5. Apri /admin.html e prova a pubblicare una news.

SICUREZZA
- Non inserire mai la service_role key nel browser o in GitHub.
- Tieni attive e verifica le policy RLS.
- Disattiva la registrazione pubblica se il pannello deve essere privato.
