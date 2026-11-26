# Active Directory and LDAP fundamentals

## LDAP and Active Directory
LDAP is a protocol used to access and manage directory information. Microsoft Active Directory is a directory service that supports LDAP among other protocols and provides directory objects such as users, groups and organisational units.

## Useful directory terms
- **DN (Distinguished Name):** full path identifying an object in the directory.
- **OU (Organisational Unit):** container used to organise objects and delegate administration.
- **CN (Common Name):** a naming component in a DN.
- **DC (Domain Component):** a domain naming component.
- **Group membership:** relationship that grants or represents access to resources.
- **Bind account:** account used by an integration to authenticate to the directory.

## Example DN
**CN=Alex User,OU=Employees,DC=example,DC=com**

## Integration checks
- Correct LDAP host and port.
- LDAPS/TLS certificate trust where required.
- Bind DN and least-privilege permissions.
- Base DN and search filters.
- Attribute mappings and object classes.
- Paging, referral and timeout behaviour.
- Group membership and nested-group handling.

## Practice exercise
In a lab domain, create a test OU and two test users, then place them in a test group. Document the DN, base DN, username attribute and group membership attribute. Never test with production credentials.

## Interview checks
- What is the difference between LDAP and Active Directory?
- What is a DN?
- What does a base DN control in a search?
