-- Invitations: a member mints a token, and whoever holds it joins that one list.

create table list_invites (
  token uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists on delete cascade,
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  revoked_at timestamptz
);

create index list_invites_list_id_idx on list_invites (list_id);

alter table list_invites enable row level security;

create policy list_invites_select on list_invites for select
  using (is_list_member(list_id));
create policy list_invites_insert on list_invites for insert
  with check (is_list_member(list_id) and created_by = auth.uid());
create policy list_invites_update on list_invites for update
  using (is_list_member(list_id));
create policy list_invites_delete on list_invites for delete
  using (is_list_member(list_id));

-- The list a live token opens, or null when it is unknown, revoked or expired.
create function invited_list(invite_token uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select list_id from list_invites
    where token = invite_token and revoked_at is null and expires_at > now();
$$;

-- Redeems a token for the caller, who is not a member yet and cannot read the invite.
create function join_with_invite(invite_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_list_id uuid := invited_list(invite_token);
begin
  if target_list_id is null then
    raise exception 'La invitación no existe o ya venció.';
  end if;

  insert into list_members (list_id, user_id) values (target_list_id, auth.uid())
    on conflict do nothing;
  return target_list_id;
end;
$$;

-- Adds the account holding that email to the token's list; false when no account has it.
create function add_member_by_invite(invite_token uuid, target_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_list_id uuid := invited_list(invite_token);
  invited_id uuid;
begin
  if target_list_id is null then
    raise exception 'La invitación no existe o ya venció.';
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

revoke execute on function invited_list(uuid) from public;
revoke execute on function join_with_invite(uuid) from public;
revoke execute on function add_member_by_invite(uuid, text) from public;
grant execute on function join_with_invite(uuid) to authenticated;
-- Only the edge function, which holds the service role, invites by email.
grant execute on function add_member_by_invite(uuid, text) to service_role;
