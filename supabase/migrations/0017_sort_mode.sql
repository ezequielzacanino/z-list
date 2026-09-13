-- Order of the open items: by hand, by priority, or grouped by aisle category.

alter table lists add column sort_mode text not null default 'manual'
  check (sort_mode in ('manual', 'priority', 'category'));

update lists set sort_mode = 'priority' where sort_by_priority;

alter table lists drop column sort_by_priority;
