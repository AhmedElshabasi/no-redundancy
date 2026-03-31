-- Notes added by workspace members on an upload package (separate from uploads.note set at upload time).
-- Run after 002_uploads.sql.

create table if not exists public.upload_notes (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.uploads (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  author_email text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists upload_notes_upload_id_idx on public.upload_notes (upload_id);

alter table public.upload_notes enable row level security;

drop policy if exists "upload_notes_select_authenticated" on public.upload_notes;
create policy "upload_notes_select_authenticated"
  on public.upload_notes for select
  to authenticated
  using (true);

-- Inserts only carry upload_id + body; author is enforced server-side.
create or replace function public.upload_notes_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uemail text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  new.author_id := auth.uid();
  select email into uemail from auth.users where id = auth.uid();
  new.author_email := uemail;
  return new;
end;
$$;

drop trigger if exists upload_notes_bi on public.upload_notes;
create trigger upload_notes_bi
  before insert on public.upload_notes
  for each row execute function public.upload_notes_before_insert();

drop policy if exists "upload_notes_insert_authenticated" on public.upload_notes;
create policy "upload_notes_insert_authenticated"
  on public.upload_notes for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (select 1 from public.uploads u where u.id = upload_id)
  );

-- Realtime (if this errors with “already exists”, the table is already in the publication)
alter publication supabase_realtime add table public.upload_notes;
