-- Who checked each occurrence, stamped by the database from the session.

alter table items add column checked_by uuid references auth.users on delete set null;

create function stamp_checked_by()
returns trigger
language plpgsql
as $$
begin
  if new.done_at is null then
    new.checked_by := null;
  elsif old.done_at is null then
    new.checked_by := auth.uid();
  end if;
  return new;
end;
$$;

create trigger items_stamp_checked_by before update of done_at on items
  for each row execute function stamp_checked_by();
