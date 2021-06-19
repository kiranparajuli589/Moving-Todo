Feature: search todo
  As a user
  I want to search todo from my todo list
  So that I can inspect my previous todos

  Background:
    Given user has browsed to the homepage

  Scenario: user should be able to find the desired todo entered in the search field
    When user enters the desired subject "sam"
    Then the todo "Sample Todo" should be listed on the autocomplete menu
