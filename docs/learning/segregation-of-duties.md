# Segregation of Duties (SoD)

## Concept
Segregation of Duties reduces the risk created when one person can perform conflicting activities. For example, the same person should generally not both create a vendor and approve that vendor's payment.

## Preventive and detective controls
- **Preventive:** evaluate a proposed access change before it is granted. A conflict can block the request or require a defined exception/approval path.
- **Detective:** identify conflicting access that already exists through analysis, reports or certification campaigns.

## Building a useful rule
A business-owned SoD rule should define:
- The two or more conflicting permissions or business functions.
- Risk description and severity.
- Applications and entitlement values in scope.
- Whether the rule is preventive, detective or both.
- Exception approver, justification and expiry.
- Remediation and evidence requirements.

## Example
Conflict: **Create_Payment_Beneficiary** + **Approve_Payment**. A user holding both may create a beneficiary and approve payments to that beneficiary. Confirm the actual risk and control design with the business owner.

## Practice exercise
Write two fictional conflicting entitlement pairs. For each, state the risk, affected applications, detection method, exception process and remediation.

## Interview checks
- What is an SoD conflict?
- How does preventive SoD differ from detective SoD?
- Why should exceptions have an owner and expiry date?
