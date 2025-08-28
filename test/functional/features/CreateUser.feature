Feature: Create New User

@CreateUserPositive
Scenario: Creating a new user
  Given I set service api endpoint to "/register"
  And   I set "valid" payload
  When  I send POST HTTP request
  Then  I receive valid HTTP response code "200"
  And   Response should match JSON schema "UserCreateSchema.js"


@CreateUserNegative
Scenario: Creating a new user with missing password
  Given I set service api endpoint to "/register"
  And   I set "invalid" payload
  When  I send POST HTTP request
  Then  I receive valid HTTP response code "400"
  And   Response should contain error message "Missing password"