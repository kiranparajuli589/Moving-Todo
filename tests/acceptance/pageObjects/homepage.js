const util = require('util');
module.exports = {
    url() {
        return this.api.launch_url;
    },

    commands: {
        userCreatesTodoWithSubjectAndContent(subject,content) {
            return this.waitForElementVisible('@createNewTodoButton')
        .click('@createNewTodoButton')
        .waitForElementVisible('@modalDiv')
        .setValue('@subjectField', subject)
        .setValue('@contentField', content)
        .click('@createButton')
        .click('@closeBtn')
        },
        todoWithSubjectAndContentShouldBeVisible(subject, content) {
            return this.api.element('xpath', util.format(this.elements.todoBoxTitleContent.selector, subject, content), result => {
                if (result.value.message === undefined) {
                    return
                } else {
                    throw new Error("Could not find the todo with provided information")
                }
            })
        },
        userCreatesTodoWithSubjectOnly(subject) {
            return this.waitForElementVisible('@createNewTodoButton')
                .click('@createNewTodoButton')
                .waitForElementVisible('@modalDiv')
                .setValue('@subjectField', subject)
                .click('@createButton')
        },
        contentErrorMessageShouldBeVisibleBelowContentField(callback){
            return this.waitForElementVisible('@errorMessageCss')
                .getText('@errorMessageCss', result => {
                   callback(result.value);
                })
        },
        createTodoEnteringContentOnly(content){
            return this.waitForElementVisible('@createNewTodoButton')
                .click('@createNewTodoButton')
                .waitForElementVisible('@modalDiv')
                .setValue('@contentField', content)
                .click('@createButton')
                .click('@closeBtn')
        },
        subjectErrorMessageVisibleBelowSubjectField(callback){
            return this.waitForElementVisible('@errorMessageCss')
                .getText('@errorMessageCss', result => {
                    callback(result.value);
                })
        },
        triesToCreateBlankTodo(){
            return this.waitForElementVisible('@createNewTodoButton')
                .click('@createNewTodoButton')
                .waitForElementVisible('@modalDiv')
                .setValue('@subjectField', '')
                .setValue('@contentField', '')
                .click('@createButton')
        },
        triesToCreateTodoWithExistingSubjectAndContent(subject, content) {
            return this.waitForElementVisible('@createNewTodoButton')
                .click('@createNewTodoButton')
                .waitForElementVisible('@modalDiv')
                .setValue('@subjectField', subject)
                .setValue('@contentField', content)
                .click('@createButton')
                .click('@closeBtn')
        },
        errorMessageForUniqueSubjectIsVisible(callback){
            return this.waitForElementVisible('@errorMessageCss')
                .getText('@errorMessageCss', result => {
                    callback(result.value);
                })
        },
        todoWithEnteredSubjectAlreadyCreated(subject) {
            return this.api.element('xpath', util.format(this.elements.todoBoxTitle.selector, subject), result => {
                if (result.value.message === undefined) {
                    console.log("todo with given title found");
                    return
                } else {
                    throw new Error("Couldn't find the element with the given title");
                }
            })
        },
        entersDesiredSubjectInSearchField(subject){
            return this.waitForElementVisible('@searchField')
                .setValue('@searchField', subject)
                .pause(3000)
        },
        todoWithDesiredSubjectsAreListedInAutocompleteMenu(callback){
            return this.waitForElementVisible("@searchSuggestions")
                        .getText('@searchSuggestions', result => {
                            callback(result.value)
                        })
        },
    },

    elements: {
        createNewTodoButton: {
            selector: '//button[@data-target="#create-todo-modal"]',
            locateStrategy: 'xpath'
        },
        modalDiv: {
           selector: '.modal-content'
        },
        subjectField: {
            selector: '#subject'
        },
        contentField: {
            selector: '#content'
        },
        createButton: {
            selector: '#create'
        },
        closeBtn: {
            selector: '.close'
        },
        todoBoxTitleContent: {
            selector: "//div[contains(@class, 'todo-box') and div//h3/text() = '%s' and div//p/text()='%s']",
            locateStrategy: 'xpath'
        },
        errorMessageCss:{
            selector: '#error-message'
        },
        todoBoxTitle: {
            selector: "//div[contains(@class, 'todo-box') and div//h3/text()='%s']",
            locateStrategy: 'xpath'
        },
        searchField:{
            selector: '#search'
        },
        searchSuggestions:{
            selector: '.ui-menu-item'
        }
    }
};
