# Saviynt rules engineering: study checklist

> Rule types, trigger names and supported actions are product- and version-specific. Confirm exact configuration in the tenant documentation before implementing anything.

## Start with the business event
For every rule, write down:
- Triggering event and execution context.
- Identity/account attributes read by the rule.
- Conditions and expected outcomes.
- Objects or attributes changed.
- Dependencies, execution order and error handling.
- How the result will be tested and audited.

## Lifecycle examples
- **Joiner:** a new identity becomes eligible; evaluate required account creation and access processes.
- **Mover:** department, title or manager changes; reevaluate role and entitlement requirements and identify access to remove.
- **Leaver:** employment status changes to terminated; initiate appropriate disablement and revocation controls.

## Technical rules and user update rules
Use the exact rule category and trigger supported by the configured Saviynt version. Do not assume a rule that updates identity attributes is interchangeable with one that performs target-account operations. Separate decision logic from target-system execution where the platform design allows it.

## Safe testing matrix
| Test | Expected result |
|---|---|
| Valid new identity | Only intended joiner actions occur |
| Existing identity attribute changes | Only relevant mover logic runs |
| Terminated identity | Leaver controls are initiated |
| Missing required attribute | Safe handling; no unintended access |
| Duplicate source record | No duplicate identity/account creation |
| Target connector unavailable | Failure is visible and recoverable |

## Interview checks
- What event triggers the rule?
- How do you prove the rule ran?
- What would you check if the rule ran but the account was not created?
