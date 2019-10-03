const { Given, When, Then } = require('cucumber');
const { client } = require('nightwatch-api');
const assert = require('assert');

Given('user has browsed to the homepage', () => client.page.homepage().navigate());

When('the user creates a todo entering subject {string} and content {string}' , (subject, content) => client.page.homepage().userCreatesTodoWithSubjectAndContent(subject,content));

Then('a new todo with subject {string} and content {string} should be visible', (subject, content) => client.page.homepage().todoWithSubjectAndContentShouldBeVisible(subject, content));

When('the user creates a todo entering subject {string} only', (subject) => client.page.homepage().userCreatesTodoWithSubjectOnly(subject));

Then('an error with content error message {string} should be visible below content field', (errorMessage) => {
    return client.page.homepage().contentErrorMessageVisibleBelowContentField((actualErrorMessage) => {
        assert.strictEqual(errorMessage, actualErrorMessage)})});

When('the user tries to create a todo entering content {string} only', (content) => client.page.homepage().createTodoEnteringContentOnly(content));

Then('an error with subject error message {string} should be visible below subject field', (errorMessage) => {
    return client.page.homepage().subjectErrorMessageVisibleBelowSubjectField((actualErrorMessage) => {
        assert.strictEqual(errorMessage, actualErrorMessage)})});

When ('the user tries to create a blank todo', () => client.page.homepage().triesToCreateBlankTodo());

When('the user tries to create a todo entering already existing subject {string} and content {string}', (subject, content) => client.page.homepage().triesToCreateTodoWithExistingSubjectAndContent(subject,content));

Then('an error with errormessage {string} should be visible', (errorMessage) => {
    return client.page.homepage().errorMessageForUniqueSubjectIsVisible((actualErrorMessage) => {
        assert.strictEqual(errorMessage, actualErrorMessage)})});

Given('a todo with subject {string} is already created', (subject) => client.page.homepage().todoWithEnteredSubjectAlreadyCreated(subject));