# Java Collections and JDBC revision

## Collections overview
- **List:** ordered collection; allows duplicates. Examples: ArrayList, LinkedList.
- **Set:** stores unique elements. Examples: HashSet, LinkedHashSet, TreeSet.
- **Map:** key-value pairs with unique keys. Examples: HashMap, LinkedHashMap, TreeMap.
- **Queue:** supports processing elements in a defined order. Examples: ArrayDeque, PriorityQueue.

Choose a collection based on ordering, uniqueness, lookup needs and concurrency requirements.

## JDBC flow
1. Obtain a database connection using a configured JDBC driver.
2. Prepare a parameterised SQL statement.
3. Execute the query or update.
4. Read results from ResultSet when applicable.
5. Commit or roll back a transaction when using manual transaction control.
6. Close resources using try-with-resources.

## Safe example
~~~java
String sql = "SELECT employee_id, department FROM employees WHERE employee_id = ?";
try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, employeeId);
    try (ResultSet resultSet = statement.executeQuery()) {
        while (resultSet.next()) {
            System.out.println(resultSet.getString("employee_id"));
            System.out.println(resultSet.getString("department"));
        }
    }
}
~~~

Use PreparedStatement for parameter values rather than concatenating user input into SQL. Manage credentials outside source code.

## Practice exercise
Write a Java method that retrieves a fictional employee's department by employee ID. Handle no matching row and database exceptions.

## Interview checks
- Difference between List, Set and Map?
- Why use PreparedStatement?
- What is the purpose of try-with-resources?
