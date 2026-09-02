-- Table privileges for the notifier, which reaches the base as service_role from an
-- edge function, outside any user session and past RLS.

grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
