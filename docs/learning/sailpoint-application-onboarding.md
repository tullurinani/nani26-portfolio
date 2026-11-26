# SailPoint IdentityIQ: application onboarding

## Typical onboarding stages
1. Identify the application owner, business purpose and access model.
2. Choose the appropriate connector or integration approach.
3. Gather endpoint, driver, schema and service-account requirements.
4. Configure connection and test connectivity.
5. Map account attributes and define a stable account identifier.
6. Configure entitlement schema and import relationships where applicable.
7. Configure aggregation and validate sample records.
8. Define provisioning operations only after the target API/schema is understood.
9. Test create, update, enable, disable and access changes in a non-production environment.
10. Document ownership, support contacts, schedules and rollback considerations.

## JDBC-specific checks
- Driver availability and compatible version.
- JDBC URL, network access and TLS requirements.
- Least-privilege database account.
- Account table and unique key.
- Status mapping and null handling.
- SQL statements and transaction behaviour.
- Safe test records and rollback plan.

## Common troubleshooting
- Connection timeout: check network, host, port and firewall.
- Authentication failure: verify credentials and account status.
- Empty aggregation: inspect query, filters and schema mapping.
- Duplicate accounts: validate the account key and correlation logic.
- Provisioning failure: inspect generated operation, permissions and database constraints.

## Practice exercise
Create a sample application onboarding document for a fictional HR database. Include schema, unique key, account attributes, entitlement model, aggregation schedule and test cases.

## Interview checks
- What is an application schema?
- Why is a stable account ID important?
- How would you troubleshoot successful connectivity but empty aggregation?
