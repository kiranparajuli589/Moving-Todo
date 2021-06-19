const { When, Then } = require('cucumber');
const { client } = require('nightwatch-api');
const assert = require('assert');

When('user enters the desired subject {string}', (subject)=> client.page.homepage().entersDesiredSubjectInSearchField(subject));

Then('the todo {string} should be listed on the autocomplete menu', (subject) => {
   return client.page.homepage().todoWithDesiredSubjectsAreListedInAutocompleteMenu((searchedSubject) => {
        assert.strictEqual(searchedSubject, subject)
    })});

