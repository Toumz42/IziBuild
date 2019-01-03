/**
 * Created by ttomc on 06/01/2017.
 */
var agendaFields = [  "#idEvent","#titleEvent","#classeEvent","#dateEvent","#hourStart","#hourEnd"];
var $date;
var groupids = [];
var datePicker;


$(function()
{
    $(".page-title").empty().append("Agenda");
    var data = { "classeId" : $('#classeId').val()};
    $('#calendar').fullCalendar({
        locale: 'fr',
        height: 'auto',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        themeButtonIcons:
            {
                prev: 'arrow-material-p',
                next: 'arrow-material-n'
            },
        handleWindowResize: true,
        weekends: true, // Hide weekends
        defaultView: 'agendaWeek', // Only show week view
        minTime: '07:00:00', // Start time for the calendar
        maxTime: '22:00:00', // End time for the calendar
        theme: true,
        timezone: 'local',
        nowIndicator: true,
        displayEventTime: true, // Display event time
        navLinks: true,
        // editable: true,
        eventLimit: true, // allow "more" link when too many events
        eventClick: function (calEvent, jsEvent, view) {

            modalize($('#formAgenda'), $('#agendaAdderDiv'), true);
            fillEditFormAgenda(calEvent);
        },
        viewRender: function (view, element) {
            var val = $('.fc-day-header a');
            $.each(val, function (index, element) {
                var $el = $(element);
                var val = $el.html().split("|");
                var res = "<div style='text-align: left; padding-left:2em'><div>" + val[0] + "</div><div style='font-size: 2em'>" + val[1] + "</div></div>";
                // $el.html(res);
            });
        },
        views: {
            basic: {
                // options apply to basicWeek and basicDay views
            },
            agenda: {
                // options apply to agendaWeek and agendaDay views
            },
            week: {
                // options apply to basicWeek and agendaWeek views
                columnFormat: 'DD'
            },
            day: {
                // options apply to basicDay and agendaDay views
            }
        },
        eventRender: function (event, element) {
            console.log(event.toString());
        },
        events:
        //eventSources:
            //[
                // your event source
                {
                    //id: 1,
                    url: '/getMyCalendar',
                    type: 'GET',
                    error: function () {
                        // alert('there was an error while fetching events!');
                        // $(".fc-now-indicator").hide();
                        // $(".fc-now-indicator-arrow").hide()
                    },
                    color: '#D32F2F',   // a non-ajax option
                    textColor: 'white' // a non-ajax option
                }
                // any other sources...
            //]
    });

    agenda = $('#calendar');


    $date = $('#dateEvent').datepicker({
        i18n: {
            monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            monthsShort: [ 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.' ],
            weekdaysFull: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
            weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            clear: 'Effacer',
        },
        container: '#datepicker-container',
        firstDay: 1,
        format: 'dd mmm, yyyy',
        yearRange: [new Date().getFullYear(), new Date().getFullYear() + 20] //
    });
    $('#hourStart').timepicker({
        autoClose: false,
        twelveHour: false,
        container: '#datepicker-container',
        afterDone: function(Element, Time) {
            console.log(Element, Time);
        }
    });

    $('#hourEnd').timepicker({
        autoClose: false,
        twelveHour: false,
        container: '#datepicker-container',
        afterDone: function(Element, Time) {
            console.log(Element, Time);
        }
    });

    $.ajax({
        url: "/getAllPros",
        type: "GET",
        // data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function (ret, textStatus, jqXHR) {
            var json = $.parseJSON(ret);
            initAutoComplete(json);
        }
    });
    initTabProjects();

    $("#calendar button").each(function () {
        $(this).addClass("waves-effect waves-light");
        if (!$(this).hasClass("fc-prev-button") && !$(this).hasClass("fc-next-button")) {
            $(this).addClass("red accent-4 btn");
        }
    });

    $("#addEvent").click(function () {
        modalize($('#formAgenda'),$('#agendaAdderDiv'),false);
        turn($(this));
        $("#agendaAdderDiv").toggle("slide");
        $('html, body').animate({scrollTop: 0}, 500);
    });
    $("#subEvent").click(function(){
        if (check())
        {
            waitOn()
            var url = "/addEvent";
            var update = $("#idEvent").val() != "";
            if (update) {
                url  = "/updateEvent"
            }
            var data = {
                "idEvent" : $("#idEvent").val(),
                "titre" : $("#titleEvent").val(),
                "groupids" : groupids,
                "proj" : $("#projectSelect").val(),
                "dateEvent" :  $("#dateEvent").val(),
                "hourStart" :  $("#hourStart").val(),
                "hourEnd" :  $("#hourEnd").val()
            };
            $.ajax ({
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    var json = $.parseJSON(ret);
                    emptyFields(agendaFields);
                    if (update) {
                        myToast("L'evenement a bien été mis à jour");
                        waitOff();
                    } else{
                        turn($("#addEvent"));
                        $("#agendaAdderDiv").toggle("slide");
                        myToast("L'evenement a bien été ajouté");
                        waitOff();
                    }
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de l'evenement");
                    waitOff();
                }
            });
        }
    });
    //var source = calendar.fullCalendar( 'getEventSourceById', 1 );
    //calendar.fullCalendar( 'refetchEvents');
    $(document).ajaxStop(function () {

        // $("#mainTabs").tabs(
        //     {
        //         onShow: function () {
        //             $("#classeId").val(this.id);
        //             var data = { "classeId" : $('#classeId').val()};
        //             source.data = JSON.stringify(data);
        //
        //         }
        //     }
        // );
    });
});
function initAutoComplete(json) {
    var reset = true;
    if (!Array.isArray(json)) {
        json = [json];
        reset = false;
    }
    if (reset) {
        arrayData = [];
    }
    for (var i = 0; i < json.length; i++) {
        var objDataComplete = {
            "id": json[i].id,
            "text": json[i].name + " " + json[i].surname
        };
        if (arrayData.indexOf(objDataComplete) == -1) {
            arrayData.push(objDataComplete);
        }
    }
    autocomplete = $('#multipleInput').materialize_autocomplete({
        // data: objDataComplete,
        multiple: {
            enable: true,
            onAppend: function (item) {
                pushToGroup(item.id);
            },
            onRemove: function (item) {
                removeFromGroup(item.id);
            }
        },
        appender: {
            el: '.ac-users'
        },
        dropdown: {
            el: '#multipleDropdown',
            itemTemplate: '<li class="ac-item autocomplete-content" data-id="<%= item.id %>" data-text=\'<%= item.text %>\'><a href="javascript:void(0)"><%= item.text %></a></li>'
        },
        getData: function (value, callback) {
            callback(value, arrayData);
        }
    });
}

function pushToGroup(item) {
    groupids.push(item)
}

function removeFromGroup(item){
    var i = groupids.indexOf(item);
    if (i > -1) {
        groupids.splice(i, 1);
    }
}

function initSelectProject(json) {
    if (!Array.isArray(json)) {
        json = [json];
    }
    $.each(json,function (index, elem) {
        var opt = $("<option />");
        opt.prop("value",elem.id);
        opt.text(elem.theme +" ("+ elem.dateString+")");
        $("#projectSelect").append(opt);
    });
    $('select').formSelect();

}
function check() {
    if ($("#titleEvent").val() == "") {
        myToast("Merci d'ajouter un Titre");
        return false;
    }
    else if (autocomplete.$el.data("value") == "") {
        myToast("Merci d'ajouter un professeur");
        return false;
    }
    else if ($("#classeEvent").val() == "") {
        myToast("Merci d'ajouter un projet");
        return false;
    }
    else if ($("#dateEvent").val() == "") {
        myToast("Merci d'ajouter une date");
        return false;
    }
    else if ($("#hourStart").val() == "") {
        myToast("Merci d'ajouter une heure de début");
        return false;
    }else if ($("#hourEnd").val() == "") {
        myToast("Merci d'ajouter une heure de fin");
        return false;
    }
    return true
}
function fillEditFormAgenda(val) {
    var event = val;
    $("#idEvent").val(event.id);
    $("#titleEvent").val(event.title);
    $.each(event.proList,function () {
        var chip = {
            'id' : this.id,
            'text' : this.name +" "+ this.surname
        };
        autocomplete.append(chip)
    });
    $("#dateEvent").val(timeToDatePicker(event.start._d));
    var minutesStart = event.start._d.getMinutes() < 10 ? "0" + event.start._d.getMinutes() : event.start._d.getMinutes() ;
    var minutesEnd = event.end._d.getMinutes() < 10 ? "0" + event.end._d.getMinutes() : event.end._d.getMinutes() ;
    var hourStart = event.start._d.getHours() < 10 ? "0" + event.start._d.getHours(): event.start._d.getHours();
    var hourEnd = event.end._d.getHours() < 10 ? "0" + event.end._d.getHours() : event.end._d.getHours();
    $("#hourStart").val(hourStart +":"+ minutesStart);
    $("#hourEnd").val(hourEnd +":"+ minutesEnd);
    $('select').formSelect();
    activeFields(agendaFields);
}

function initTabProjects() {
    waitOn();
    var dataGroup = JSON.stringify({});
    $.ajax ({
        url: "/getProjects",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            initSelectProject(json);
            if ( json.length != 0 ) {
                classeToTabs(json);
            }
            waitOff();
        },
        error : function (xhr, ajaxOptions, thrownError) {
            myToast("Erreur dans initSelect");
            waitOff();
        }
    });
}
function classeToTabs(json) {
    var reset = true;
    if (!Array.isArray(json)) {
        json = [json];
        reset = false;
    }
    if (reset) {
        $('#mainTabs').find(".TabAgenda").remove();
    }
    for (var i = 0; i < json.length; i++) {
        $('#mainTabs').append("<li class='tab col s3'><a class='TabAgenda' id= " + json[i].id + ">" + json[i].name + "</a></li>");
    }
}