-- Esegui questo file una sola volta nel SQL Editor di Supabase.
-- Immagini pubbliche in lettura, caricamento riservato agli amministratori.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif'];

drop policy if exists "Public can view site images" on storage.objects;
create policy "Public can view site images" on storage.objects for select to anon, authenticated using (bucket_id = 'site-images');

drop policy if exists "Admins can upload site images" on storage.objects;
create policy "Admins can upload site images" on storage.objects for insert to authenticated with check (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update site images" on storage.objects;
create policy "Admins can update site images" on storage.objects for update to authenticated using (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = auth.uid())) with check (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can delete site images" on storage.objects;
create policy "Admins can delete site images" on storage.objects for delete to authenticated using (bucket_id = 'site-images' and exists (select 1 from public.admin_users where user_id = auth.uid()));
