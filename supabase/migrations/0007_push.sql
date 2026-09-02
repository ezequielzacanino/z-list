-- Push devices per user, and the notice state of each item.

create extension if not exists pg_net;

create table push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users on delete cascade,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index push_subscriptions_user_id_idx on push_subscriptions (user_id);

alter table push_subscriptions enable row level security;

create policy push_subscriptions_select on push_subscriptions for select
  using (user_id = auth.uid());
create policy push_subscriptions_insert on push_subscriptions for insert
  with check (user_id = auth.uid());
create policy push_subscriptions_update on push_subscriptions for update
  using (user_id = auth.uid());
create policy push_subscriptions_delete on push_subscriptions for delete
  using (user_id = auth.uid());

grant select, insert, update, delete on push_subscriptions to authenticated;

-- Stamped once the members of the list were told about the item.
alter table items add column notified_at timestamptz;

-- Wakes the notifier a few minutes after each round of generated copies.
select cron.schedule(
  'notify-due-items',
  '5,20,35,50 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
      || '/functions/v1/notify-due',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer '
        || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
