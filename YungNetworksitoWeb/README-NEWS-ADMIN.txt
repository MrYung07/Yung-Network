YUNG NETWORK — NEWS ADMIN (branch feature/admin-news-supabase)

FILES
- index.html: homepage aggiornata per leggere le news pubblicate da Supabase
- news.js: visualizza news pubblicate in homepage
- admin.html / admin.js: login, crea/modifica/elimina news
- supabase-config.js: configurazione pubblica da completare
- supabase-schema.sql: schema e policy Row Level Security

CONFIGURAZIONE
1. Crea un progetto su https://supabase.com/.
2. In SQL Editor esegui supabase-schema.sql.
3. In Authentication > Users crea il tuo utente con email e password. Disattiva la registrazione pubblica se non serve.
4. Copia l'UUID dell'utente e usa la query commentata nel file SQL per inserirlo in public.admin_users.
5. In Project Settings > API copia Project URL e anon/publishable key in supabase-config.js.
6. Apri /admin.html, accedi e pubblica una news di prova.

SICUREZZA
- La chiave anon/publishable è destinata al client; la protezione effettiva è data dalle policy RLS.
- Non usare MAI la service_role key nel browser o in GitHub.
- Non abilitare signup pubblico se il pannello deve essere solo tuo.
- Controlla le policy RLS prima di mettere il sistema in produzione.

VERCEL
I file sono dentro YungNetworksitoWeb. Verifica che la Root Directory di Vercel punti a quella cartella; altrimenti mantieni i file nella directory effettivamente pubblicata.
Il codice è su un branch separato: non modifica master finché non apri e unisci una pull request.
