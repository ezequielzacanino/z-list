-- Optional deadline per item, reminded by push the day before.

alter table items add column due_on date;

-- Stamped once the members of the list were reminded of the deadline.
alter table items add column reminded_at timestamptz;

-- Moving the deadline arms its reminder again.
create function rearm_reminder()
returns trigger
language plpgsql
as $$
begin
  if new.due_on is distinct from old.due_on then
    new.reminded_at := null;
  end if;
  return new;
end;
$$;

create trigger items_rearm_reminder before update of due_on on items
  for each row execute function rearm_reminder();
