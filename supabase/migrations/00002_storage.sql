insert into storage.buckets (id, name, public)
values ('curriculos', 'curriculos', false)
on conflict (id) do nothing;

create policy "Users can view own curriculo"
  on storage.objects for select
  using (auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can upload own curriculo"
  on storage.objects for insert
  with check (
    auth.uid()::text = (storage.foldername(name))[1]
    and bucket_id = 'curriculos'
  );

create policy "Users can delete own curriculo"
  on storage.objects for delete
  using (auth.uid()::text = (storage.foldername(name))[1]);
