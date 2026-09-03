-- Holding a token joins the list; adding somebody else to it belongs to the edge function.

revoke execute on function invited_list(uuid) from authenticated;
revoke execute on function add_member_by_invite(uuid, text) from authenticated;
