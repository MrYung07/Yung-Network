-- Esegui questo file nel Supabase SQL Editor per abilitare la scelta dell'icona per ogni social.
alter table public.social_links
  add column if not exists icon text not null default 'auto';
