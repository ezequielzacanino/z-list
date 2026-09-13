-- Spending cap of a list, compared against the sum of its items' amounts.

alter table lists add column budget_limit numeric(12, 2);
