-- Optional workflow status for non-rubric report uploads; null for rubrics and legacy rows.

alter table public.uploads
  add column if not exists report_status text;

alter table public.uploads
  drop constraint if exists uploads_report_status_check;

alter table public.uploads
  add constraint uploads_report_status_check
  check (
    report_status is null
    or report_status in ('todo', 'in_progress', 'urgent', 'done')
  );

comment on column public.uploads.report_status is
  'Report workflow: todo, in_progress, urgent, done. Null for rubric batches or unset.';
