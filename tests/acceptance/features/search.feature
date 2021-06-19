Feature: search todo
  As a user
  I want to search todo from my todo list
  So that I can read them

  Scenario: user should be able to find the desired todo entered in the search field
    Given user has browsed to the homepage
    When user enters the desired subject "sub"
    Then the todo "subject" should be listed on the autocomplete menu
