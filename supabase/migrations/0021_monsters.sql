-- Each list raises a monster that grows with use and shrinks back when left idle.

alter table lists add column monster smallint not null default floor(random() * 50)::smallint;
alter table lists add column growth real not null default 0;
alter table lists add column growth_at timestamptz not null default now();

-- First completion of an item, so checking it again earns nothing more.
alter table items add column counted_at timestamptz;

update items set counted_at = done_at where done_at is not null;

-- Existing lists start from what they were already used for.
update lists
set growth = stats.points, growth_at = stats.last_used
from (
  select
    list_id,
    count(*) filter (where created_by is not null) + 3 * count(done_at) as points,
    greatest(max(created_at), max(done_at)) as last_used
  from items
  group by list_id
) stats
where stats.list_id = lists.id;

-- Stage thresholds and idle decay, mirrored by src/monsters/growth.ts.
create function monster_threshold(stage int)
returns real
language sql
immutable
as $$
  select (2 * stage * stage + 6 * stage)::real;
$$;

create function monster_stage(points real)
returns int
language sql
immutable
as $$
  select coalesce(max(stage), 0)
  from generate_series(0, 19) stage
  where monster_threshold(stage) <= points;
$$;

create function monster_points(points real, since timestamptz)
returns real
language sql
stable
as $$
  select case
    when idle.lost < 1 then points
    else least(points, monster_threshold(greatest(0, monster_stage(points) - idle.lost)))
  end
  from (
    select floor(greatest(0, extract(epoch from now() - since) / 86400 - 7) / 7)::int as lost
  ) idle;
$$;

-- A person adding earns one point, a first completion three; generated copies earn nothing.
create function grow_from_item()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  points real := 0;
begin
  if tg_op = 'INSERT' then
    if new.created_by is not null then
      points := 1;
    end if;
  elsif new.done_at is not null and old.done_at is null and new.counted_at is null then
    new.counted_at := now();
    points := 3;
  end if;

  if points > 0 then
    update lists
    set growth = monster_points(growth, growth_at) + points, growth_at = now()
    where id = new.list_id;
  end if;
  return new;
end;
$$;

revoke all on function grow_from_item() from public, authenticated;

create trigger items_grow_list before insert or update of done_at on items
  for each row execute function grow_from_item();
