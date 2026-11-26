# REST APIs and JSON for IAM integrations

## REST basics
A REST-style API exposes resources through HTTP methods. Common methods include:
- **GET** to read a resource.
- **POST** to create or submit a resource/action.
- **PUT** to replace a resource representation.
- **PATCH** to partially update a resource.
- **DELETE** to remove a resource, subject to API semantics.

Common status codes include 200 (success), 201 (created), 204 (success with no body), 400 (bad request), 401 (unauthenticated), 403 (forbidden), 404 (not found), 409 (conflict), 429 (rate limited) and 5xx (server error).

## JSON example
~~~json
{
  "employeeId": "E1007",
  "department": "Finance",
  "active": true
}
~~~

## Integration checklist
- Base URL and endpoint path.
- Authentication method and secret storage.
- Required headers and content type.
- Request schema and response schema.
- Pagination and rate limits.
- Timeouts, retries and idempotency.
- Error response handling and audit logging.
- Least-privilege API scopes.

## Practice exercise
Use a public mock API or local test server to send a GET request and inspect the status code, headers and JSON response. Then write down how an identity update could be represented safely.

## Interview checks
- Difference between 401 and 403?
- Why should an integration handle 429?
- What is pagination and why is it important?
