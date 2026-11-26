# SQL practice for IAM data

Use fictional sample data only. These examples are for learning SQL fundamentals and should be adapted to the actual database schema.

## Find active employees
~~~sql
SELECT employee_id, full_name, department
FROM employees
WHERE employment_status = 'ACTIVE';
~~~

## Find duplicate employee identifiers
~~~sql
SELECT employee_id, COUNT(*) AS record_count
FROM employees
GROUP BY employee_id
HAVING COUNT(*) > 1;
~~~

## Join identities to application accounts
~~~sql
SELECT i.employee_id, i.full_name, a.application_name, a.account_name
FROM identities i
JOIN accounts a ON a.employee_id = i.employee_id;
~~~

## Find accounts with no matching identity
~~~sql
SELECT a.account_name, a.application_name
FROM accounts a
LEFT JOIN identities i ON i.employee_id = a.employee_id
WHERE i.employee_id IS NULL;
~~~

## Good habits
- Understand primary and foreign keys.
- Check null values and duplicate records.
- Use explicit column names instead of SELECT * in production queries.
- Parameterise values in application code.
- Use transactions carefully for data changes.
- Never run destructive SQL against a production identity store without approval and a tested rollback plan.

## Practice exercise
Create fictional identities and accounts tables. Insert matched and unmatched records, then run the queries above and explain the results.
