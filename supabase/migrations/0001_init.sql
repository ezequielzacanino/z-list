-- Core schema: lists, membership, items, item options.

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  preset text not null default 'plain',
  quick_add_fields text[] not null default '{}',
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

create table list_members (
  list_id uuid not null references lists on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (list_id, user_id)
);

create table items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists on delete cascade,
  name text not null,
  quantity text,
  priority int,
  notes text,
  recurrence_days int,
  position double precision not null,
  done_at timestamptz,
  created_by uuid references auth.users on delete set null,
  source_item_id uuid references items on delete set null,
  created_at timestamptz not null default now()
);

-- Nulls are distinct, so this bounds recurrence copies to one per occurrence.
create unique index items_source_item_id_key on items (source_item_id);

create index items_list_id_idx on items (list_id);

create table item_options (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items on delete cascade,
  label text not null,
  url text,
  notes text,
  position double precision not null,
  created_at timestamptz not null default now()
);

create index item_options_item_id_idx on item_options (item_id);
