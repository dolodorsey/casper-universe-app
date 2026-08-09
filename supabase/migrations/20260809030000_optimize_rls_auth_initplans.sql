-- Evaluate Supabase auth helpers once per statement instead of once per row.
-- This preserves each policy's command, roles, USING expression, and WITH CHECK
-- expression while applying Supabase's recommended RLS init-plan pattern.
do $migration$
declare
  policy_row record;
  using_expression text;
  check_expression text;
begin
  for policy_row in
    select p.oid,
           p.polname,
           n.nspname as schema_name,
           c.relname as table_name,
           pg_get_expr(p.polqual, p.polrelid) as using_expression,
           pg_get_expr(p.polwithcheck, p.polrelid) as check_expression
    from pg_policy p
    join pg_class c on c.oid = p.polrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and (
        (
          coalesce(pg_get_expr(p.polqual, p.polrelid), '') ~ 'auth\.(uid|jwt)\(\)'
          and coalesce(pg_get_expr(p.polqual, p.polrelid), '') !~ 'SELECT auth\.(uid|jwt)\(\)'
        )
        or (
          coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '') ~ 'auth\.(uid|jwt)\(\)'
          and coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '') !~ 'SELECT auth\.(uid|jwt)\(\)'
        )
      )
  loop
    using_expression := policy_row.using_expression;
    check_expression := policy_row.check_expression;

    if using_expression is not null then
      using_expression := replace(using_expression, 'auth.uid()', '(select auth.uid())');
      using_expression := replace(using_expression, 'auth.jwt()', '(select auth.jwt())');
    end if;

    if check_expression is not null then
      check_expression := replace(check_expression, 'auth.uid()', '(select auth.uid())');
      check_expression := replace(check_expression, 'auth.jwt()', '(select auth.jwt())');
    end if;

    execute format(
      'alter policy %I on %I.%I%s%s',
      policy_row.polname,
      policy_row.schema_name,
      policy_row.table_name,
      case when using_expression is not null
        then format(' using (%s)', using_expression)
        else ''
      end,
      case when check_expression is not null
        then format(' with check (%s)', check_expression)
        else ''
      end
    );
  end loop;
end
$migration$;
