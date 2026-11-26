# Access requests and approvals

## Purpose
An access request is a governed way for a user, manager or administrator to ask for an application, account, role or entitlement. The request workflow determines whether the access is appropriate and who must approve it.

## Typical request lifecycle
1. Requester selects an eligible application or access item.
2. The platform validates eligibility and evaluates policies.
3. Approval tasks are routed to configured approvers, such as a manager, application owner or entitlement owner.
4. A policy check may detect a segregation-of-duties conflict or other risk.
5. On approval, provisioning sends the change to the target application.
6. Reconciliation verifies the resulting account or entitlement state.
7. Request history records decisions and outcomes.

## Important distinctions
- **Approval** is a governance decision; it does not prove that the target system successfully changed.
- **Provisioning** performs the requested change in the target.
- **Reconciliation** imports target state so the governance platform can compare expected and actual access.
- **Fulfilment failure** needs investigation and a clear status rather than being treated as success.

## Practice exercise
Design a request for a user to obtain a finance reporting role. Define requester, manager approver, application owner approver, SoD check, provisioning step and failure-handling path.

## Interview checks
- What happens after approval?
- Why can an approved request still fail?
- Who should approve sensitive entitlements, and why?
