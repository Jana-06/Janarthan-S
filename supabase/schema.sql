-- Run this once in the Supabase SQL Editor for project mtxfyfvqrxaertelevbh.
-- The owner email is the portfolio contact address used by the private dashboard.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 3000),
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('achievement', 'project')),
  title text not null check (char_length(title) between 1 and 180),
  description text not null check (char_length(description) between 1 and 5000),
  image_path text,
  file_path text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;
alter table public.portfolio_items enable row level security;

grant insert on public.feedback to anon, authenticated;
grant select on public.feedback to authenticated;
grant select on public.portfolio_items to anon, authenticated;
grant insert, update, delete on public.portfolio_items to authenticated;

drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
  on public.feedback for insert to anon, authenticated
  with check (true);

drop policy if exists "Only portfolio owner can read feedback" on public.feedback;
create policy "Only portfolio owner can read feedback"
  on public.feedback for select to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com');

drop policy if exists "Portfolio entries are public to read" on public.portfolio_items;
create policy "Portfolio entries are public to read"
  on public.portfolio_items for select to anon, authenticated
  using (true);

drop policy if exists "Only portfolio owner can create entries" on public.portfolio_items;
create policy "Only portfolio owner can create entries"
  on public.portfolio_items for insert to authenticated
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com');

drop policy if exists "Only portfolio owner can update entries" on public.portfolio_items;
create policy "Only portfolio owner can update entries"
  on public.portfolio_items for update to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com');

drop policy if exists "Only portfolio owner can delete entries" on public.portfolio_items;
create policy "Only portfolio owner can delete entries"
  on public.portfolio_items for delete to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit)
values ('portfolio-assets', 'portfolio-assets', true, 26214400)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

drop policy if exists "Portfolio assets are publicly readable" on storage.objects;
create policy "Portfolio assets are publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-assets');

drop policy if exists "Portfolio owner can upload assets" on storage.objects;
create policy "Portfolio owner can upload assets"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com'
  );

drop policy if exists "Portfolio owner can update assets" on storage.objects;
create policy "Portfolio owner can update assets"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com'
  )
  with check (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com'
  );

drop policy if exists "Portfolio owner can delete assets" on storage.objects;
create policy "Portfolio owner can delete assets"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portfolio-assets'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = '10cjanarthansrvspm@gmail.com'
  );
