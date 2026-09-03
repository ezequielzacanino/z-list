-- Only a signed-in caller reaches the invitation function, which reads auth.users.

revoke execute on function add_member_by_email(uuid, text) from public;
grant execute on function add_member_by_email(uuid, text) to authenticated;
