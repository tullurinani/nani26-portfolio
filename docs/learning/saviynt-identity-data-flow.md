# Saviynt IGA: identity data flow study notes

> These notes describe common IGA concepts for study. Exact screens, job names, object models and configuration depend on the Saviynt product version and tenant.

## High-level flow
1. **Authoritative source:** HR or another trusted system supplies identity attributes.
2. **Import:** configured jobs/connectors bring identity, account and entitlement data into the IGA platform.
3. **Identity processing:** attributes, status and correlation logic are evaluated.
4. **Governance:** policies, roles, access requests and certifications determine appropriate access.
5. **Provisioning:** approved changes are sent to connected target applications.
6. **Reconciliation:** target state is imported again to confirm what access exists.

## Data categories
- Identity data: employee ID, name, department, manager and status.
- Account data: username, account status and application-specific attributes.
- Entitlement data: groups, roles, permissions and descriptions.
- Ownership data: application owners, entitlement owners and approvers.

## Troubleshooting checklist
- Confirm source connectivity and credentials.
- Check import scope, filters and attribute mappings.
- Validate unique identifiers and data types.
- Review import/job history and error messages.
- Verify account correlation before acting on access.
- Compare target state with imported state after provisioning.

## Practice exercise
Draw a data-flow diagram for an HR source, an IGA platform, Active Directory and a JDBC application. Label identity import, account aggregation, entitlement import, provisioning and reconciliation.

## Interview checks
- Why do we import both accounts and entitlements?
- What is the difference between aggregation and provisioning?
- How would you investigate an account that is not linked to an identity?
