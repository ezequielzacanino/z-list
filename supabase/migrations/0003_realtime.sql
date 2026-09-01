-- Broadcast row changes to subscribed clients.

alter publication supabase_realtime add table lists;
alter publication supabase_realtime add table list_members;
alter publication supabase_realtime add table items;
alter publication supabase_realtime add table item_options;

alter table items replica identity full;
alter table item_options replica identity full;
