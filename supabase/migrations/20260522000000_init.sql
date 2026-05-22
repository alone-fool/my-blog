-- site_config: owner github numeric id
create table if not exists public.site_config (
  key text primary key,
  value text not null
);

alter table public.site_config enable row level security;

create policy "site_config_select_all"
  on public.site_config for select
  using (true);

insert into public.site_config (key, value)
values ('owner_github_id', '0')
on conflict (key) do nothing;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    auth.jwt() -> 'user_metadata' ->> 'provider_id',
    auth.jwt() -> 'user_metadata' ->> 'sub'
  ) = (select value from public.site_config where key = 'owner_github_id' limit 1);
$$;

create table if not exists public.profiles (
  id text primary key default 'owner',
  display_name text not null default '',
  title text not null default '',
  bio text not null default '',
  avatar_url text not null default '',
  skills jsonb not null default '[]'::jsonb,
  experiences jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_owner_write"
  on public.profiles for all
  using (public.is_owner())
  with check (public.is_owner());

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  content text not null default '',
  cover_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);

alter table public.posts enable row level security;

create policy "posts_select_published"
  on public.posts for select
  using (status = 'published' or public.is_owner());

create policy "posts_owner_insert"
  on public.posts for insert
  with check (public.is_owner());

create policy "posts_owner_update"
  on public.posts for update
  using (public.is_owner())
  with check (public.is_owner());

create policy "posts_owner_delete"
  on public.posts for delete
  using (public.is_owner());

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null default '',
  avatar_url text not null default '',
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_id_idx on public.comments (post_id, created_at desc);

alter table public.comments enable row level security;

create policy "comments_select_all"
  on public.comments for select
  using (true);

create policy "comments_insert_auth"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "comments_delete_own_or_owner"
  on public.comments for delete
  using (auth.uid() = user_id or public.is_owner());

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "post_likes_select_all"
  on public.post_likes for select
  using (true);

create policy "post_likes_insert_auth"
  on public.post_likes for insert
  with check (auth.uid() = user_id);

create policy "post_likes_delete_own"
  on public.post_likes for delete
  using (auth.uid() = user_id);

create table if not exists public.post_favorites (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.post_favorites enable row level security;

create policy "post_favorites_select_all"
  on public.post_favorites for select
  using (true);

create policy "post_favorites_insert_auth"
  on public.post_favorites for insert
  with check (auth.uid() = user_id);

create policy "post_favorites_delete_own"
  on public.post_favorites for delete
  using (auth.uid() = user_id);

create or replace view public.post_stats as
select
  p.id as post_id,
  coalesce(l.cnt, 0)::int as likes_count,
  coalesce(c.cnt, 0)::int as comments_count,
  coalesce(f.cnt, 0)::int as favorites_count
from public.posts p
left join (
  select post_id, count(*) as cnt from public.post_likes group by post_id
) l on l.post_id = p.id
left join (
  select post_id, count(*) as cnt from public.comments group by post_id
) c on c.post_id = p.id
left join (
  select post_id, count(*) as cnt from public.post_favorites group by post_id
) f on f.post_id = p.id;

insert into public.profiles (id, display_name, title, bio, skills, experiences, social_links)
values (
  'owner',
  '博主',
  '全栈工程师',
  '欢迎来到我的个人博客。',
  '["Vue","TypeScript","Supabase"]'::jsonb,
  '[{"company":"示例公司","role":"工程师","period":"2020 - 至今","description":"负责 Web 产品研发。"}]'::jsonb,
  '[{"label":"GitHub","url":"https://github.com/alone-fool"}]'::jsonb
)
on conflict (id) do nothing;
