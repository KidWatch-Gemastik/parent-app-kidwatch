This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

<!-- Supabase Path -->

```bash
https://ltarjljnzwrogwwdvtob.supabase.co
```

npx shadcn@latest add button

## SQL Excute

```bash

-- 👶 TABLE: children
create table children (
    id uuid primary key default gen_random_uuid(),
    parent_id uuid references auth.users not null,
    name text not null,
    date_of_birth date not null,
    created_at timestamp default now()
);

-- 📱 TABLE: devices
create table devices (
    id uuid primary key default gen_random_uuid(),
    child_id uuid references children not null,
    device_id text not null,
    os text,
    status text,
    created_at timestamp default now()
);

-- 📝 TABLE: activity_logs
create table activity_logs (
    id uuid primary key default gen_random_uuid(),
    child_id uuid references children not null,
    timestamp timestamp default now(),
    app_name text,
    duration int
);

-- 🔒 TABLE: rules
create table rules (
    id uuid primary key default gen_random_uuid(),
    child_id uuid references children not null,
    type text,
    start_time time,
    end_time time
);

-- 💡 TABLE: insights
create table insights (
    id uuid primary key default gen_random_uuid(),
    child_id uuid references children not null,
    type text,
    message text,
    created_at timestamp default now()
);

-- 💳 TABLE: subscriptions
create table subscriptions (
    id uuid primary key default gen_random_uuid(),
    parent_id uuid references auth.users not null,
    plan text default 'free',
    trial_ends_at timestamp default (now() + interval '14 days'),
    active boolean default true,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

-- 📆 TABLE: schedules
create table schedules (
    id uuid primary key default gen_random_uuid(),
    child_id uuid references children not null,
    day_of_week text not null,        -- e.g., 'monday', 'tuesday'
    start_time time not null,
    end_time time not null,
    activity_type text not null,      -- e.g., 'study', 'play', 'blocked'
    created_at timestamp default now()
);

--------------------------------------------------------------------------------
-- ENABLE RLS
--------------------------------------------------------------------------------
alter table children enable row level security;
alter table devices enable row level security;
alter table activity_logs enable row level security;
alter table rules enable row level security;
alter table insights enable row level security;
alter table subscriptions enable row level security;
alter table schedules enable row level security;

--------------------------------------------------------------------------------
-- RLS POLICIES
--------------------------------------------------------------------------------

-- ✅ children
create policy "Parent can access their children"
on children
for all
using (parent_id = auth.uid());

-- ✅ devices
create policy "Parent can access their child's devices"
on devices
for all
using (
    child_id in (select id from children where parent_id = auth.uid())
);

-- ✅ activity_logs
create policy "Parent can access their child's logs"
on activity_logs
for all
using (
    child_id in (select id from children where parent_id = auth.uid())
);

create policy "Child device can insert log"
on activity_logs
for insert
with check (
    child_id in (select id from children)
);

-- ✅ rules
create policy "Parent can access their child's rules"
on rules
for all
using (
    child_id in (select id from children where parent_id = auth.uid())
);

-- ✅ insights
create policy "Parent can access their child's insights"
on insights
for all
using (
    child_id in (select id from children where parent_id = auth.uid())
);

-- ✅ subscriptions
create policy "Parent can access their subscription"
on subscriptions
for all
using (
    parent_id = auth.uid()
);

-- ✅ schedules
create policy "Parent can access their child's schedules"
on schedules
for all
using (
    child_id in (select id from children where parent_id = auth.uid())
);

--------------------------------------------------------------------------------
-- ENABLE REALTIME
--------------------------------------------------------------------------------

-- (aktifin via dashboard → Database → Replication → Tables)
-- ✅ Tables recommended for realtime: 
-- activity_logs, insights, rules (optional)

--------------------------------------------------------------------------------
-- SEED SUBSCRIPTION
--------------------------------------------------------------------------------

-- insert into subscriptions (parent_id, plan, trial_ends_at, active)
-- values ('<PARENT-USER-ID>', 'free', now() + interval '14 days', true);


```