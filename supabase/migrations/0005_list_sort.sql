-- Sort order of the open zone, chosen per list and shared by its members.

alter table lists add column sort_by_priority boolean not null default false;
