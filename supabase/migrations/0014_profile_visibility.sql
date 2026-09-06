-- Names are visible between people who share a list, not across the whole project.

create index list_members_user_id_idx on list_members (user_id);

-- Bypasses RLS on list_members so the profile policy does not recurse through it.
create function shares_a_list(target_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from list_members mine
    join list_members theirs on theirs.list_id = mine.list_id
    where mine.user_id = auth.uid() and theirs.user_id = target_user_id
  );
$$;

drop policy profiles_select on profiles;

create policy profiles_select on profiles for select
  using (id = auth.uid() or shares_a_list(id));

grant execute on function shares_a_list(uuid) to authenticated;
