// Tooltips Initialization
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
function colorTitle(id){
    if(!$("#"+id).find('.content_title').hasClass("anim")) {
        $("#"+id).find('.content_title').addClass("anim");
        setTimeout('$("#"+id).find(\'.content_title\').removeClass("anim");', 4000);
    }
}

function scroll(id) {
    $("body,html").animate(
    {
        scrollTop: $("#"+id).offset().top - 700
    },
    600); //speed//

}
$(document).on('click', '#js-top', function (e) {
    e.preventDefault();
    window.scrollTo(0,0);
});
function showShifter() {
    $("#shift-form").toggle(500);
}


function orderContainerId(){
    let i=1;
    $('.todos').children('.todo-box').each(function () {
        $(this).attr('id', i); // "this" is the current element in the loop
        i++;
    });
}
orderContainerId();

function toggleButton(){
    $(".todos").children().find(".top").show();
    $(".todos").children().find(".up").show();
    $(".todos").children().find(".down").show();
    $(".todos").children().find(".bottom").show();
    $(".todos").children().first().find(".top").hide();
    $(".todos").children().first().find(".up").hide();
    $(".todos").children().last().find(".down").hide();
    $(".todos").children().last().find(".bottom").hide();
}
toggleButton();

$('button[name=searchSubmit]').attr('disabled', 'disabled');

$('#search').keyup(function (e) {
    let key = e.which;
    if ($(this).val().length != 0){
        $('button[name=searchSubmit]').removeAttr('disabled');
    }
    else {
        $('button[name=searchSubmit]').attr('disabled', 'disabled');
    }

    if(key == 13)  // the enter key code
    {
        $('button[name = searchSubmit]').click();
    }
});
$(document).on('click','button[name = searchSubmit]', function (e) {
    e.preventDefault();
    let text = $("#search").val();
    let id = $('.content_title:contains("'+text+'")').parent().parent().parent().parent().attr('id');
    // scrollAndColor(id);
    $('.todos').children('.todo-box').each(function () {
        $(this).hide(); // "this" is the current element in the loop
    });
    $("#"+id).show();
});
$(document).on('blur','button[name = searchSubmit]', function (e) {
    e.preventDefault();
    $('.todos').children('.todo-box').each(function () {
        $(this).show(); // "this" is the current element in the loop
    });
});
$(document).on('blur','#search', function (e) {
    e.preventDefault();
    $('.todos').children('.todo-box').each(function () {
        $(this).show(); // "this" is the current element in the loop
    });
});

$(document).on('click', '#create', function (e) {
    e.preventDefault();
    let subject = $("#subject").val();
    let content = $("#content").val();
    if (subject === '') {
        console.log('enpty subject');
        $('<div class="text-danger error-message" style="font-size: 13px;font-weight: bold;">Please enter a subject!</div>')
            .insertAfter($("#subject"))
            .delay(2000)
            .fadeOut(function() {
                $(this).remove();
            });
        return;
    }
    else if ( content === ''){
        console.log('empty content');
        $('<div class="text-danger error-message" style="font-size: 13px;font-weight: bold;">Please enter content of your todo!</div>')
                .insertAfter($("#content"))
                .delay(2000)
                .fadeOut(function() {
                    $(this).remove();
                });
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/todo-create',
        data: {
            'subject': subject,
            'content': content,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (data) {


            if (data.message === 'nonunique') {
                $('<div class="text-danger error-message" style="font-size: 13px;font-weight: bold;">Todo with this Element title already exists.</div>')
                .insertAfter($("#subject"))
                .delay(2000)
                .fadeOut(function() {
                    $(this).remove();
                });
                $("#subject").attr('style', 'border-bottom:2px solid red;');
            }
            else {
                console.log(data.message);
                $(".error-message").hide();
                $("#subject").removeAttr('style');
                let ele = $("#1").clone();
                ele.appendTo('.todos');
                (ele.find('h3.content_title').text(subject));
                ele.find('.content-pos').text('#'+data.position);
                ele.find('.content-text').text(content);
                $('html, body').animate({
                    scrollTop: $('html, body').height()
                }, 'slow');
                orderContainerId();
                toggleButton();
                colorTitle(data.position);

                $("#subject").val("");
                $("#content").val("");
            }


        }
    })
});


//move to top
$(document).on('click', '.top', function (e) {
    let id = $(this).parent().parent().attr('id');
    $(this).parent().parent().prependTo(".todos");
    orderContainerId();
    toggleButton();
    scroll('1');
    colorTitle('1');
    $.ajax({
        type: 'POST',
        url: '/todo-top',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (e) {

        }
    });
});

//move to bottom
$(document).on('click', '.bottom', function (e) {
    let id = $(this).parent().parent().attr('id');
    $(this).parent().parent().appendTo(".todos");
    $('html, body').animate({
        scrollTop: $('html, body').height()
    }, 'slow');
    $.ajax({
        type: 'POST',
        url: '/todo-bottom',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (data) {
            orderContainerId();
            toggleButton();
            colorTitle(data.total);
        }
    });
});
//move up
$(document).on('click', '.up', function (e) {
    let id = $(this).parent().parent().attr('id');
    idd = (id - 1).toString();
    $(this).parent().parent().fadeOut(200);
    $("#"+idd).fadeOut("slow");
    $(this).parent().parent().insertBefore("#"+idd);
    $("#"+idd).fadeIn("slow");
    $(this).parent().parent().show().fadeIn(200);
    toggleButton();
    $.ajax({
        type: 'POST',
        url: '/todo-up',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (e) {
            colorTitle(id);
            orderContainerId();
            toggleButton()
        }
    });
});
//move down
$(document).on('click', '.down', function (e) {
    let id = parseInt($(this).parent().parent().attr('id'));
    idd = id + 1;
    $(this).parent().parent().fadeOut(200);
    $("#"+idd).fadeOut("slow");
    $(this).parent().parent()
    .insertAfter("#"+idd);
    $("#"+idd).fadeIn("slow");
    $(this).parent().parent().show().fadeIn(200);

    toggleButton();
    $.ajax({
        type: 'POST',
        url: '/todo-down',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (e) {
            colorTitle(id);
            orderContainerId();
            toggleButton()
        }
    });
});

function formSubmit(e) {
    e.preventDefault();
    let from = parseInt($("#from").val());
    let to = parseInt($("#to").val());
    $.ajax({
        type: 'POST',
        url: '/todo-shift',
        data: {
            'from': from,
            'to': to,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (data) {
            if (from > to) {
                $("#"+from).insertBefore("#"+to);
            }
            else if (from < to) {

                $("#"+from).insertAfter("#"+to);

            }
            orderContainerId();
            toggleButton();
            colorTitle(to);
            scroll(to);
        }
    });
}
