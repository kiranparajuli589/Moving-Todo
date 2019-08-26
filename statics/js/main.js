function showShifter() {
    $("#shift-form").toggle(500);
}

var elementsNameArray = {{ elements_name_array }};
console.log(elementsNameArray);
$("#search").autocomplete({source: elementsNameArray});

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

//move to top
$(document).on('click', '.top', function (e) {
    let id = $(this).parent().parent().attr('id');
    console.log(id);
    $(this).parent().parent().prependTo(".todos");
    toggleButton();
    $.ajax({
        type: 'POST',
        url: '{% url 'top' %}',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (e) {
            orderContainerId();
            scrollAndColor('1');


        }
    });
});

//move to bottom
$(document).on('click', '.bottom', function (e) {
    let id = $(this).parent().parent().attr('id');
    $(this).parent().parent().appendTo(".todos");
    toggleButton();
    $.ajax({
        type: 'POST',
        url: '{% url 'bottom' %}',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (data) {
            orderContainerId();
            toggleButton();
            scrollAndColor(data.total);
        }
    });
});
//move up
$(document).on('click', '.up', function (e) {
    let id = $(this).parent().parent().attr('id');
    id = (id - 1).toString();
    $(this).parent().parent().fadeOut(200);
    $("#"+id).fadeOut("slow");
    $(this).parent().parent().insertBefore("#"+id);
    $("#"+id).fadeIn("slow");
    $(this).parent().parent().show().fadeIn(200);
    toggleButton();
    $.ajax({
        type: 'POST',
        url: '{% url 'up' %}',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (e) {
            orderContainerId();
            toggleButton()
        }
    });
});
//move down
$(document).on('click', '.down', function (e) {
    let id = parseInt($(this).parent().parent().attr('id'));
    id = id + 1;
    $(this).parent().parent().fadeOut(200);
    $("#"+id).fadeOut("slow");
    $(this).parent().parent()
    .insertAfter("#"+id);
    $("#"+id).fadeIn("slow");
    $(this).parent().parent().show().fadeIn(200);

    toggleButton();
    $.ajax({
        type: 'POST',
        url: '{% url 'down' %}',
        data: {
            'position': id,
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        },
        dataType: 'json',
        success: function (e) {
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
        url: '{% url 'shifter' %}',
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
            scrollAndColor(to);
            orderContainerId();
            toggleButton()
        }
    });
}
$('#search').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
        $('button[name = searchSubmit]').click();
    }
});
$(document).on('click','button[name = searchSubmit]', function (e) {
    e.preventDefault();
    let text = $("#search").val();
    console.log(text);
    let id = $('.content_title:contains("'+text+'")').parent().parent().parent().parent().attr('id');
    scrollAndColor(id);
});
function scrollAndColor(id) {
    $("body,html").animate(
    {
        // scrollTop: $("#"+id).offset()
        scrollTop: $("#"+id).offset().top - 80
    },
    600); //speed//
    $("#"+id).find(".content_title").addClass('change-to-red');
    setTimeout(function(){
        $("#"+id).find(".content_title").removeClass('change-to-red');
    },1000);
}