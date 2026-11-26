# IGA lifecycle and Joiner–Mover–Leaver

## What IGA does
Identity Governance and Administration (IGA) helps an organisation manage digital identities, access decisions and evidence that access is appropriate. Typical capabilities include identity lifecycle management, access requests, approvals, provisioning, reconciliation and access reviews.

## Joiner, Mover, Leaver
- **Joiner:** a person enters the organisation. A trusted HR or identity source provides attributes; an identity is created and required accounts/access are evaluated.
- **Mover:** department, title, manager, location or employment status changes. Access should be recalculated; no-longer-needed permissions should be removed through policy and approval.
- **Leaver:** a person exits. Accounts and sessions should be disabled or access revoked promptly according to policy, legal requirements and application capabilities.

## Typical lifecycle flow
1. Receive a change from an authoritative source.
2. Validate and correlate identity data.
3. Apply identity attributes and lifecycle state.
4. Evaluate roles, policies and access requirements.
5. Request approval where required.
6. Provision or deprovision target access.
7. Reconcile the target state and retain audit evidence.

## Practice exercise
Create three sample employees: a new joiner, an employee moving from Finance to HR, and a leaver. For each, document source attributes, expected account changes, approvals and verification evidence. Do not use real employee data.

## Interview checks
- What is the difference between identity creation and account provisioning?
- Why is a mover event a risk if old access is not removed?
- What should happen if the source feed says a person is terminated but the target application is unavailable?
