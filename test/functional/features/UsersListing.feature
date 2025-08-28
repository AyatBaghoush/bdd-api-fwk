Feature: Listing Users

@UsersListing
Scenario: Listing all users of the application
  Given I set service api endpoint to "users_listing"
  And   I set query params
        | key      | value |
        | page     | 2     |
        | per_page | 6     |
  When  I send GET HTTP request
  Then  I receive valid HTTP response code "200"
  And   Response should contain list of users
  And   Response should match JSON schema "usersListSchema.js"