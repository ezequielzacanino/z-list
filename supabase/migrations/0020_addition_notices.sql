-- Opt-in per member to hear about the items somebody else adds to a list.

alter table list_members add column notify_additions boolean not null default false;

-- Stamped once the members who opted in were told about the item.
alter table items add column announced_at timestamptz;

update items set announced_at = now();

-- Members change only their own row, and only its notice setting.
create policy list_members_update on list_members for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

revoke update on list_members from authenticated;
grant update (notify_additions) on list_members to authenticated;

-- Wakes the notifier often enough that an addition is heard within minutes.
select cron.schedule(
  'notify-additions',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
      || '/functions/v1/notify-additions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer '
        || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
