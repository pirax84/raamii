-- =====================================================================
-- Raamii — base de données Supabase
-- À coller une seule fois dans Supabase > SQL Editor > New query > Run.
-- =====================================================================

-- 1) Profils des joueurs (pseudo + statistiques pour le classement en ligne)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text not null default 'Joueur',
  games integer not null default 0,
  wins integer not null default 0,
  best integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Sauvegarde de chaque joueur : pièces, dos de cartes, réglages, classement local (synchronisés entre appareils)
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 3) Historique des parties terminées
create table if not exists public.games (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  rules text not null default 'maison',
  rounds integer not null,
  players integer not null,
  ranking jsonb not null,
  my_total integer,
  won boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists games_user_idx on public.games(user_id, created_at desc);

-- 4) Salons pour le multijoueur en ligne (prochaine étape : jouer chacun sur son téléphone)
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host uuid not null references auth.users(id) on delete cascade,
  rules text not null default 'maison',
  status text not null default 'waiting',
  players jsonb not null default '[]'::jsonb,
  state jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sécurité : chacun ne voit et ne modifie que ses propres données
alter table public.profiles enable row level security;
alter table public.user_data enable row level security;
alter table public.games enable row level security;
alter table public.rooms enable row level security;

drop policy if exists "profils visibles par tous (classement)" on public.profiles;
create policy "profils visibles par tous (classement)" on public.profiles for select using (true);
drop policy if exists "je modifie mon profil" on public.profiles;
create policy "je modifie mon profil" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "mes données" on public.user_data;
create policy "mes données" on public.user_data for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "je vois mes parties" on public.games;
create policy "je vois mes parties" on public.games for select using (auth.uid() = user_id);
drop policy if exists "j'ajoute mes parties" on public.games;
create policy "j'ajoute mes parties" on public.games for insert with check (auth.uid() = user_id);

drop policy if exists "salons visibles par les connectés" on public.rooms;
create policy "salons visibles par les connectés" on public.rooms for select to authenticated using (true);
drop policy if exists "je crée mon salon" on public.rooms;
create policy "je crée mon salon" on public.rooms for insert to authenticated with check (auth.uid() = host);
drop policy if exists "l'hôte gère son salon" on public.rooms;
create policy "l'hôte gère son salon" on public.rooms for update to authenticated using (auth.uid() = host);

-- Création automatique du profil à l'inscription (pseudo choisi dans l'appli)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, pseudo)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'pseudo', ''), split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Enregistrer une partie terminée + mettre à jour les statistiques du joueur
create or replace function public.record_game(p_rules text, p_rounds int, p_players int, p_ranking jsonb, p_total int, p_won boolean)
returns void language plpgsql security invoker set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'non connecté'; end if;
  insert into public.games (user_id, rules, rounds, players, ranking, my_total, won)
  values (auth.uid(), p_rules, p_rounds, p_players, p_ranking, p_total, p_won);
  update public.profiles set
    games = games + 1,
    wins = wins + case when p_won then 1 else 0 end,
    best = case when best is null or p_total < best then p_total else best end,
    updated_at = now()
  where id = auth.uid();
end; $$;
grant execute on function public.record_game(text, int, int, jsonb, int, boolean) to authenticated;

-- =====================================================================
-- v1.3 — Monétisation et fidélisation (à exécuter aussi, une seule fois)
-- Les achats et les droits (VIP, pass) ne peuvent être écrits QUE par le serveur
-- (fonction Supabase qui vérifie le reçu Google Play) : aucun joueur ne peut se les donner.
-- =====================================================================
create table if not exists public.purchases (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,               -- ex. coins_500, vip_month, pass_s1, starter_pack
  platform text not null default 'android',
  purchase_token text unique,             -- reçu Google Play, vérifié côté serveur
  amount_cents integer, currency text default 'EUR',
  status text not null default 'pending', -- pending, verified, refunded
  created_at timestamptz not null default now()
);
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  vip_until timestamptz,
  season_pass text,
  ad_free boolean not null default false,
  updated_at timestamptz not null default now()
);
create table if not exists public.ad_rewards (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  coins integer not null,
  created_at timestamptz not null default now()
);
alter table public.purchases enable row level security;
alter table public.entitlements enable row level security;
alter table public.ad_rewards enable row level security;
drop policy if exists "je vois mes achats" on public.purchases;
create policy "je vois mes achats" on public.purchases for select using (auth.uid() = user_id);
drop policy if exists "je vois mes droits" on public.entitlements;
create policy "je vois mes droits" on public.entitlements for select using (auth.uid() = user_id);
drop policy if exists "je vois mes vidéos" on public.ad_rewards;
create policy "je vois mes vidéos" on public.ad_rewards for select using (auth.uid() = user_id);

-- Vidéo récompensée : au maximum 5 par jour et par joueur (contrôlé par le serveur)
create or replace function public.claim_ad_reward(p_coins int default 30)
returns integer language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'non connecté'; end if;
  select count(*) into n from public.ad_rewards where user_id = auth.uid() and created_at > now() - interval '1 day';
  if n >= 5 then return 0; end if;
  insert into public.ad_rewards(user_id, coins) values (auth.uid(), least(p_coins, 50));
  return least(p_coins, 50);
end; $$;
grant execute on function public.claim_ad_reward(int) to authenticated;

-- Classement de la semaine (pour les tournois hebdomadaires)
create or replace view public.weekly_leaderboard as
  select p.pseudo, count(*) filter (where g.won) as wins, count(*) as games, min(g.my_total) as best
  from public.games g join public.profiles p on p.id = g.user_id
  where g.created_at > date_trunc('week', now())
  group by p.pseudo order by wins desc, best asc limit 50;
grant select on public.weekly_leaderboard to anon, authenticated;
