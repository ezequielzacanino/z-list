-- Membership is granted by a member inviting a known email, never by holding a link.

drop policy list_members_insert on list_members;

create policy list_members_insert on list_members for insert
  with check (is_list_member(list_id));

-- Reads auth.users, so it runs as owner and answers only whether the email had an account.
create function add_member_by_email(target_list_id uuid, target_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  invited_id uuid;
begin
  if not is_list_member(target_list_id) then
    raise exception 'not a member of this list';
  end if;

  select id into invited_id from auth.users
    where lower(email) = lower(trim(target_email));
  if invited_id is null then
    return false;
  end if;

  insert into list_members (list_id, user_id) values (target_list_id, invited_id)
    on conflict do nothing;
  return true;
end;
$$;

grant execute on function add_member_by_email(uuid, text) to authenticated;
