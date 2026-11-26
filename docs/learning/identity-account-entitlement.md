# Identity, account and entitlement

## Core objects
- **Identity:** the digital representation of a person or non-human subject in the governance system.
- **Account:** a login or record belonging to that identity in a target application. One identity can have accounts in multiple applications.
- **Entitlement:** a permission-bearing value inside an application, such as a group, role, licence or application permission.
- **Application:** the managed target system that owns accounts and entitlements.
- **Correlation:** the process of linking an imported account to the correct identity using configured attributes and matching logic.

## Example
An employee identity may be linked to an Active Directory account and a finance application account. The AD account may hold group memberships; the finance account may hold application roles. These are different accounts and entitlements even though they belong to one person.

## Common data-quality risks
- Duplicate employee identifiers.
- Missing or inconsistent email addresses.
- Reused usernames.
- Incorrect account-to-identity correlation.
- Entitlements imported without descriptions or owners.

## Practice exercise
Draw a relationship diagram for one identity, two accounts and four entitlements. Identify the unique key used for correlation and describe what should happen when no match or multiple matches are found.

## Interview checks
- Can one identity have multiple accounts?
- Is an account the same thing as an entitlement?
- Why is accurate correlation important before certification or provisioning?
