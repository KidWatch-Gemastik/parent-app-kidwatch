-- ENUM
create type day_of_week_enum as enum (
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
);

create type urgency_enum as enum ('low', 'normal', 'high', 'critical');
create type recurrence_enum as enum ('once', 'daily', 'weekly', 'monthly');
create type status_enum as enum ('active', 'cancelled', 'completed');

-- Tabel
create table public.scheduling (
  id uuid not null default gen_random_uuid(),
  child_id uuid not null,
  day_of_week day_of_week_enum not null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  activity_type text not null,
  description text,
  urgency urgency_enum not null default 'normal',
  recurrence recurrence_enum not null default 'once',
  notify_before interval default '10 minutes',
  status status_enum not null default 'active',
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  constraint scheduling_pkey primary key (id),
  constraint scheduling_child_id_fkey foreign key (child_id) references children (id),
  constraint scheduling_time_check check (end_time > start_time)
);

-- Indexes
create index idx_scheduling_child_id 
  on public.scheduling(child_id);

create index idx_scheduling_child_day 
  on public.scheduling(child_id, day_of_week);

create index idx_scheduling_child_day_time 
  on public.scheduling(child_id, day_of_week, start_time, end_time);

create index idx_scheduling_child_status 
  on public.scheduling(child_id, status);

alter table public.scheduling enable row level security;
-- Orang tua hanya bisa liat jadwal anaknya
create policy "Parents can view their children's schedules"
on public.scheduling
for select
using (
  exists (
    select 1
    from public.children c
    where c.id = scheduling.child_id
      and c.parent_id = auth.uid()
  )
);
-- Orang tua hanya bisa insert jadwal untuk anaknya
create policy "Parents can insert schedules for their children"
on public.scheduling
for insert
with check (
  exists (
    select 1
    from public.children c
    where c.id = scheduling.child_id
      and c.parent_id = auth.uid()
  )
);

-- Orang tua hanya bisa update jadwal untuk anaknya
create policy "Parents can update schedules for their children"
on public.scheduling
for update
using (
  exists (
    select 1
    from public.children c
    where c.id = scheduling.child_id
      and c.parent_id = auth.uid()
  )
);

-- Orang tua hanya bisa hapus jadwal anaknya
create policy "Parents can delete schedules for their children"
on public.scheduling
for delete
using (
  exists (
    select 1
    from public.children c
    where c.id = scheduling.child_id
      and c.parent_id = auth.uid()
  )
);




-- Call Singaling biar bisa call antar device
create table calls (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null,
  child_id uuid not null,
  offer jsonb,
  answer jsonb,
  ice jsonb,
  created_at timestamp default now()
);
