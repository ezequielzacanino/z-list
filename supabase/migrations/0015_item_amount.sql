-- Money an item accounts for, summed at the top of the list.

alter table items add column amount numeric(12, 2);

-- One copy per completed recurring occurrence whose interval already elapsed,
-- appended after the open items of its list.
create or replace function materialize_due_items() returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  created integer;
begin
  insert into items (
    list_id, name, quantity, priority, notes, amount, recurrence_days, position,
    source_item_id, created_by
  )
  select
    occurrence.list_id,
    occurrence.name,
    occurrence.quantity,
    occurrence.priority,
    occurrence.notes,
    occurrence.amount,
    occurrence.recurrence_days,
    tail.position
      + 1024 * row_number() over (partition by occurrence.list_id order by occurrence.done_at),
    occurrence.id,
    null
  from items occurrence
  cross join lateral (
    select coalesce(max(sibling.position), 0) as position
    from items sibling
    where sibling.list_id = occurrence.list_id and sibling.done_at is null
  ) tail
  where occurrence.done_at is not null
    and occurrence.recurrence_days is not null
    and occurrence.done_at + occurrence.recurrence_days * interval '1 day' <= now()
    and not exists (
      select 1 from items spawned where spawned.source_item_id = occurrence.id
    )
  on conflict (source_item_id) do nothing;

  get diagnostics created = row_count;
  return created;
end;
$$;
