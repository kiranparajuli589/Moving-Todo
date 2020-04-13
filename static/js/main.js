const subjectSelector = '#subject'
const contentSelector = '#content'
const searchFieldSelector = '#search'
const searchSubmitButtonSelector = 'button[name=searchSubmit]'
const todoListSelector = '.todos'
const todoBoxSelector = '.todo-box'
const csrfInputSelector = 'input[name=csrfmiddlewaretoken]'
const contentTitleSelector = '.content_title'
const htmlBodySelector = 'body, html'
const shiftFormSelector = '#shift-form'
const shiftFromInputSelector = '#from'
const shiftToInputSelector = '#to'
const todoAnimationClassSelector = 'anim'
const errOnInputClassSelector = 'error-in-input'
const todoButtonContainerSelector = '.button-container'
const editSubjectFieldSelector = '#edit-subject'
const editContentFieldSelector = '#edit-content'
const editModalSpanSelector = '#editTodoModalLabel span'

// Tooltips Initialization
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

/**
 * color title of moving todoEntry
 * @param id
 */
function colorTitle(id){
    const el = $(`#${id}`).find(contentTitleSelector)
    if(!el.hasClass(todoAnimationClassSelector)) {
        el.addClass(todoAnimationClassSelector);
    }
}

/**
 * scrolls to the targeted todoEntry
 * @param id
 */
function scroll(id) {
    $(htmlBodySelector).animate({
        scrollTop: $(`#${id}`).offset().top - 700
    }, 600); //speed//
}

/**
 * sequentially order todoEntries created so far with ascending ids
 */
function orderContainerId(){
    let i=1;
    $(todoListSelector).children(todoBoxSelector).each(function () {
        $(this).attr('id', i); // "this" is the current element in the loop
        i++;
    });
}

/**
 * shows shifting form
 */
function showShifter() {
    $(shiftFormSelector).toggle(500);
}

/**
 * checks todoBoxes and manages button container for them
 * moving todoEntry not needed when there is only one or zero entry
 */
function toggleButton(){
    const el = $(todoListSelector);
    if ($(`${todoListSelector} ${todoBoxSelector}`).length > 1 ) {
        el.children().find(".top").show();
        el.children().find(".up").show();
        el.children().find(".down").show();
        el.children().find(".bottom").show();
        el.children().first().find(".top").hide();
        el.children().first().find(".up").hide();
        el.children().last().find(".down").hide();
        el.children().last().find(".bottom").hide();
    } else {
        $(todoButtonContainerSelector).hide()
    }
}

toggleButton();
orderContainerId();

/**
 * scroll page to the top
 */
$(document).on('click', '#js-top', function (e) {
    e.preventDefault();
    window.scrollTo(0,0);
});

/**
 * disable search submit button when page loaded
 */
$(searchSubmitButtonSelector).attr('disabled', 'disabled');

/**
 * only enable search submit btn if something has been typed inside search box
 */
$(searchFieldSelector).keyup(function (e) {
    let key = e.which;
    if ($(this).val().length !== 0){
        $(searchSubmitButtonSelector).removeAttr('disabled');
    }
    else {
        $(searchSubmitButtonSelector).attr('disabled', 'disabled');
    }
    if(key === 13) {  // keyboard Enter key code
        $(searchSubmitButtonSelector).click();
    }
});

/**
 * search submit function
 * shows search result with single todoEntry
 */
$(document).on('click', searchSubmitButtonSelector, function (e) {
    e.preventDefault();
    let text = $(searchFieldSelector).val();
    let id = $(`${contentTitleSelector}:contains(${text})`).parent().parent().parent().parent().attr('id');
    console.log(id)
    $(todoListSelector).children(todoBoxSelector).each(function () {
        $(this).hide(); // "this" is the current element in the loop
    });
    $(`#${id}`).show();
});

/**
 * search using click on submit buttom
 * how to get back from search result? quite easy...
 * just click anywhere outside search box then voila you're back to list
 */
$(document).on('blur', searchSubmitButtonSelector, function (e) {
    e.preventDefault();
    $(searchFieldSelector).val("") // also delete searched content from search box
    $(todoListSelector).children(todoBoxSelector).each(function () {
        $(this).show(); // "this" is the current element in the loop
    });
});

/**
 * search using keyboard pressing Enter key?
 * just get off from search input field using `Tab` then you're back to list
 */
$(document).on('blur', searchFieldSelector, function (e) {
    e.preventDefault();
    $(todoListSelector).children(todoBoxSelector).each(function () {
        $(this).show(); // "this" is the current element in the loop
    });
});

/**
 * focuses subject field after clicking on createTodoButton
 */
$(document).on('click', '#create-todo-btn', function (e) {
    e.preventDefault();
    setTimeout(function() { $(subjectSelector).focus() }, 500);
})

/**
 * create todoEntry
 */
$(document).on('click', '#create', function (e) {
    e.preventDefault();
    let subject = $(subjectSelector).val();
    let content = $(contentSelector).val();
    const returnValue = validateTodoForm(subject, content)
    if (returnValue === 1) {
        return
    }
    $.ajax({
        type: 'POST',
        url: '/todo-create',
        data: {
            'subject': subject,
            'content': content,
            'csrfmiddlewaretoken': $(csrfInputSelector).val()
        },
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.message === 'non-unique') {
                $('<div class="text-danger" id="error-message">Todo with this Element title already exists.</div>')
                .insertAfter($(subjectSelector))
                $(subjectSelector).addClass(errOnInputClassSelector);
            }
            else {
                // if everything is ok then create a new todoBox for our brand new todoEntry
                console.log(data.message);
                let ele = $(todoBoxSelector).first().clone();
                ele.appendTo(todoListSelector);
                (ele.find('h3.content_title').text(subject));
                ele.find('.todo-pk').text('#'+data.position);
                ele.find('.content-text').text(content);
                $(htmlBodySelector).animate({
                    scrollTop: $(htmlBodySelector).height()
                }, 'slow');
                orderContainerId();
                toggleButton();
                colorTitle(data.position);
                // clear input fields after successful todoEntry creation
                $(subjectSelector).val("");
                $(contentSelector).val("");
            }
        }
    })
});

/**
 * move todoEntry to top
 */
$(document).on('click', '.top', function (e) {
    e.preventDefault();
    let id = $(this).parent().parent().attr('id');
    $(this).parent().parent().prependTo(todoListSelector);
    $.ajax({
        type: 'POST',
        url: '/todo-top',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $(csrfInputSelector).val()
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            orderContainerId();
            toggleButton();
            scroll('1');
            colorTitle('1');
        }
    });
});

/**
 * move todoEntry to bottom
 */
$(document).on('click', '.bottom', function (e) {
    e.preventDefault();
    let id = $(this).parent().parent().attr('id');
    $(this).parent().parent().appendTo(todoListSelector);
    $(htmlBodySelector).animate({
        scrollTop: $(htmlBodySelector).height()
    }, 'slow');
    $.ajax({
        type: 'POST',
        url: '/todo-bottom',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $(csrfInputSelector).val()
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            orderContainerId();
            toggleButton();
            colorTitle(data.total);
        }
    });
});

/**
 * move todoEntry one step up
 */
$(document).on('click', '.up', function (e) {
    e.preventDefault();
    const id = parseInt($(this).parent().parent().attr('id'));
    const newId = `#${(id - 1).toString()}`;
    $(this).parent().parent().fadeOut(200);
    $(newId).fadeOut("slow");
    $(this).parent().parent().insertBefore(newId);
    $(newId).fadeIn("slow");
    $(this).parent().parent().show().fadeIn(200);
    $.ajax({
        type: 'POST',
        url: '/todo-up',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $(csrfInputSelector).val()
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            colorTitle(id);
            orderContainerId();
            toggleButton()
        }
    });
});

/**
 * move todoEntry one step down
 */
$(document).on('click', '.down', function (e) {
    e.preventDefault();
    const id = parseInt($(this).parent().parent().attr('id'));
    const newId = `#${(id + 1).toString()}`;
    $(this).parent().parent().fadeOut(200);
    $(newId).fadeOut("slow");
    $(this).parent().parent().insertAfter(newId);
    $(newId).fadeIn("slow");
    $(this).parent().parent().show().fadeIn(200);

    toggleButton();
    $.ajax({
        type: 'POST',
        url: '/todo-down',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $(csrfInputSelector).val()
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            colorTitle(id);
            orderContainerId();
            toggleButton()
        }
    });
});

/**
 * submits todoEntry form for shifting todoEntry
 * @param e event
 */
function shiftFormSubmit(e) {
    e.preventDefault();
    let from = parseInt($(shiftFromInputSelector).val());
    let to = parseInt($(shiftToInputSelector).val());
    $.ajax({
        type: 'POST',
        url: '/todo-shift',
        data: {
            'from': from,
            'to': to,
            'csrfmiddlewaretoken': $(csrfInputSelector).val()
        },
        dataType: 'json',
        success: function (data) {
            if (from > to) {
                $(shiftFromInputSelector).insertBefore(shiftToInputSelector);
            }
            else if (from < to) {

                $(shiftFromInputSelector).insertAfter(shiftToInputSelector);

            }
            console.log(data);
            orderContainerId();
            toggleButton();
            colorTitle(to);
            scroll(to);
        }
    });
}

/**
 * populate edit form with existing data
 */
$(document).on('click', '.edit', function (e) {
    e.preventDefault();
    const pk = $(this).parent().parent().find('.todo-pk')[0].innerText.trim()
    const subject = $(this).parent().parent().find('.content_title')[0].innerHTML
    const content = $(this).parent().parent().find('.content-text')[0].innerHTML
    const spanElement = $(editModalSpanSelector)
    let spanContent = spanElement[0].innerText
    if (spanContent === '#') {
        spanElement[0].innerText += pk
    }
    $(editSubjectFieldSelector).val(subject)
    $(editContentFieldSelector).val(content)
})

/**
 * update todoBox after successful edit
 * @param pk PK of todoEntry
 * @param subject
 * @param content
 */
function updateTodoBox(pk, subject, content) {
    const els = document.getElementsByClassName('todo-pk')
    let found;
    for (let i = 0; i < els.length; i++) {
        if (els[i].innerText.trim() === pk) {
            found = els[i];
            break;
        }
    }
    const todoBoxPosnSelector = `#${found.id.slice(1)}` //remove beginning * char
    const todoBox = $(todoBoxPosnSelector)
    todoBox.find('.content_title')[0].innerText = subject
    todoBox.find('.content-text')[0].innerText = content
    colorTitle(todoBoxPosnSelector)
    $(todoBoxPosnSelector).animate({
        scrollTop: $(todoBoxPosnSelector).height()
    }, 'slow');
}


/**
 * edit todoEntry
 */
$(document).on('click', '#edit-todo', function (e) {
    const pk = $(editModalSpanSelector)[0].innerText.slice(1)
    const subject = $(editSubjectFieldSelector).val();
    const content = $(editContentFieldSelector).val();

    const returnValue = validateTodoForm(subject, content, 'edit')
    if (returnValue === 1) {
        return
    }

    $.ajax({
        type: 'POST',
        url: '/todo-edit',
        data: {
            'id': pk,
            'new_subject': subject,
            'new_content': content,
            'csrfmiddlewaretoken': $(csrfInputSelector).val()
        },
        dataType: 'json',
        success: function (data) {
            $('#edit-todo-modal').find('.close').click()
            console.log(data);
            // orderContainerId();
            // toggleButton();
            updateTodoBox(pk, subject, content)
            // scroll(to);
        }
    });
})

function validateTodoForm(subject, content, type='create') {
    let subSel
    let conSel
    if (type === 'create') {
        subSel = subjectSelector
        conSel = contentSelector
    } else if(type === 'edit') {
        subSel = editSubjectFieldSelector
        conSel = editContentFieldSelector
    }

    if (!subject) {
        console.log('empty subject');
        // if there is no empty subject error msg on view then add empty subject error msg
        if ($(subSel).next()[0].id !== 'error-message') {
            $("#error-message").fadeOut(function() {
                $(this).remove();
            });
            $('<div class="text-danger" id="error-message">Please enter a subject!</div>')
                .insertAfter($(subSel))
            $(subSel).addClass(errOnInputClassSelector)
            return 1;
        } else { //otherwise leave the empty subject msg and do nothing
            return 1
        }
    }
    // if subject is not empty and there is no subject error msg on view then clear the error msg
    else if($(subSel).next()[0].id === 'error-message') {
        $("#error-message").fadeOut(function() {
            $(this).remove();
        });
        $(subSel).removeClass(errOnInputClassSelector)
    }
    // now if content is empty, also at this point we have subject non-empty
    if (!content) {
        console.log('empty content');
        // if there is no empty content msg on view then add empty content error msg
        if ($(conSel).next().length === 0 ) {
            $("#error-message").fadeOut(function() {
                $(this).remove();
            });
            $('<div class="text-danger" id="error-message">Please add content for your todo!</div>')
                .insertAfter($(conSel))
            $(conSel).addClass(errOnInputClassSelector)
            return 1;
        } else { //otherwise leave the empty content msg and do nothing
            return 1
        }
    }
    // if content is not empty and there is no content error msg on view then clear the error msg
    else if($(conSel).next().length === 0) {
        //do nothing, just proceed to save todoEntry
    }
    // if content is not empty and there is content error msg on view, then clear the error msg and proceed
    else {
        $("#error-message").fadeOut(function() {
            $(this).remove();
        });
        $(conSel).removeClass(errOnInputClassSelector)
    }
}

