/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    $(".page-title").empty().append("Agenda");

    $('#calendar').fullCalendar({
        locale: 'fr',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        themeButtonIcons :
        {
            prev: 'arrow-material-p',
            next: 'arrow-material-n'
        },
        handleWindowResize: true,
        weekends: false, // Hide weekends
        defaultView: 'agendaWeek', // Only show week view
        minTime: '07:30:00', // Start time for the calendar
        maxTime: '22:00:00', // End time for the calendar
        theme : true,
        displayEventTime: true, // Display event time
        navLinks: true,
        // editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
            {
                title: 'All Day Event',
                start: '2017-02-01'
            },
            {
                title: 'Long Event',
                start: '2017-02-07',
                end: '2017-02-21'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2017-02-09T16:00:00'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2017-02-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2017-02-11',
                end: '2017-02-13'
            },
            {
                title: 'Meeting',
                start: '2017-02-12T10:30:00',
                end: '2017-02-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2017-02-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2017-02-12T14:30:00'
            },
            {
                title: 'Happy Hour',
                start: '2017-02-12T17:30:00'
            },
            {
                title: 'Dinner',
                start: '2017-02-12T20:00:00'
            },
            {
                title: 'Birthday Party',
                start: '2017-02-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2017-02-28'
            }
        ]
    });

    $("button").each(function () {
        $(this).addClass("waves-effect waves-light btn light-blue")
    });
});