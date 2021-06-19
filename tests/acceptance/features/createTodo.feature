Feature: createTodo
  As a user
  I want to create a todo
  So that I would keep track of my todo

  Background:
    Given user has browsed to the homepage

  Scenario: user should be able to create a todo entering both subject and content
    When the user creates a todo entering subject "subject" and content "content"
    Then a new todo with subject "subject" and content "content" should be visible

  Scenario: user should not be able to create a todo entering subject only
    When the user creates a todo entering subject "subject" only
    Then an error with content error message "Please add content for your todo!" should be visible below content field

  Scenario: user should not be able to create a todo entering content only
    When the user tries to create a todo entering content "content" only
    Then an error with subject error message "Please enter a subject!" should be visible below subject field

  Scenario: user should not be able to create a blank todo
    When the user tries to create a blank todo
    Then an error with subject error message "Please enter a subject!" should be visible below subject field

  @skip @issue-clean-db
  Scenario: user should not be able to create a todo with already existing subject
    Given a todo with subject "subject" is already created
    When the user tries to create a todo entering already existing subject "subject" and content "new content"
    Then an error with errormessage "Todo with this Element title already exists." should be visible
