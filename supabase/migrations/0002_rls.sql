-- Row level security: every row is reachable only through list membership.

-- Bypasses RLS on list_members so membership policies do not recurse.
create function is_list_member(target_list_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from list_members
    where list_id = target_list_id and user_id = auth.uid()
  );
$$;

alter table profiles enable row level security;
alter table lists enable row level security;
alter table list_members enable row level security;
alter table items enable row level security;
alter table item_options enable row level security;

create policy profiles_select on profiles for select
  using (true);
create policy profiles_insert on profiles for insert
  with check (id = auth.uid());
create policy profiles_update on profiles for update
  using (id = auth.uid());

create policy lists_select on lists for select
  using (is_list_member(id));
create policy lists_insert on lists for insert
  with check (created_by = auth.uid());
create policy lists_update on lists for update
  using (is_list_member(id));
create policy lists_delete on lists for delete
  using (created_by = auth.uid());

create policy list_members_select on list_members for select
  using (is_list_member(list_id));
create policy list_members_insert on list_members for insert
  with check (user_id = auth.uid() or is_list_member(list_id));
create policy list_members_delete on list_members for delete
  using (user_id = auth.uid() or is_list_member(list_id));

create policy items_select on items for select
  using (is_list_member(list_id));
create policy items_insert on items for insert
  with check (is_list_member(list_id));
create policy items_update on items for update
  using (is_list_member(list_id));
create policy items_delete on items for delete
  using (is_list_member(list_id));

create policy item_options_select on item_options for select
  using (is_list_member((select list_id from items where id = item_id)));
create policy item_options_insert on item_options for insert
  with check (is_list_member((select list_id from items where id = item_id)));
create policy item_options_update on item_options for update
  using (is_list_member((select list_id from items where id = item_id)));
create policy item_options_delete on item_options for delete
  using (is_list_member((select list_id from items where id = item_id)));

-- The list creator is its first member.
create function add_creator_as_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into list_members (list_id, user_id) values (new.id, new.created_by);
  return new;
end;
$$;

create trigger lists_add_creator after insert on lists
  for each row execute function add_creator_as_member();

-- Every authenticated user gets a profile, named from the email local part.
create function create_profile_for_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, display_name) values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger users_create_profile after insert on auth.users
  for each row execute function create_profile_for_user();
