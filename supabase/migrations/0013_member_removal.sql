-- Removing members: the creator takes anybody else out, anybody else takes only themselves.

-- Bypasses RLS on lists so the membership policy does not depend on reading them.
create function is_list_owner(target_list_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from lists
    where id = target_list_id and created_by = auth.uid()
  );
$$;

drop policy list_members_delete on list_members;

-- The creator leaving would orphan the list, which only they can delete.
create policy list_members_delete on list_members for delete
  using (
    case
      when is_list_owner(list_id) then user_id <> auth.uid()
      else user_id = auth.uid()
    end
  );

grant execute on function is_list_owner(uuid) to authenticated;
