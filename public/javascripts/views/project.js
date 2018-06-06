/**
 * Created by ttomc on 06/01/2017.
 */
var groupids = [];
$(function()
{
    $(".page-title").empty().append("Projet");
    var cardStart = "<ul class='stage'><div class='row'>"+
        "<div class='col m12 s12 l12 push-s1 push-m1 push-l1'>"+ "<li>"+
        "<div class='card card-1'><div class='card-content'>"+
        "<div class='row'>";
    var cardEnd = "</div></div></div></li></div></div></ul>";
    data=null;


    $.ajax ({
        url: "/getProjects",
        type: "GET",
        // data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            var table;
            var tr;
            for (var i = 0; i < json.length; i++) {
                table = $("<table class='responsive-table highlight'></table>");
                table2 = $("<table class='responsive-table highlight'></table>");
                tr = $('<tr/>');
                //tr.append("<th>Id</th>");
                tr.append("<th> Theme </th>");
                tr.append("<th>Date</th>");
                table.append(tr);
                tr = $('<tr/>');
                // tr.append("<td>" + json[i].id + "</td>");
                tr.append("<td>" + json[i].theme + "</td>");
                tr.append("<td>" + json[i].date + "</td>");
                table.append(tr);
                tr = $('<tr/>');
                //tr.append("<th>Id</th>");
                tr.append("<th> Nom </th>");
                tr.append("<th>Prénom</th>");
                tr.append("<th>Metier</th>");
                table2.append(tr);
                for (var j = 0; j < json[i].proList.length; j++) {
                    tr = $('<tr/>');
                    //tr.append("<td>" + json[i].proList[j].id + "</td>");
                    tr.append("<td>" + json[i].proList[j].name+ "</td>");
                    tr.append("<td>" + json[i].proList[j].surname + "</td>");
                    tr.append("<td>" + json[i].proList[j].surname + "</td>");
                    table2.append(tr);
                }
                var res1 = cardStart + table.prop('outerHTML');
                var res2 = table2.prop('outerHTML') + cardEnd;
            }
            var res = res1 + res2;
            $("#projectMainDiv").append(res);

        }
    });
    var turned = false;
    $("#addSuivi").click(function () {
        if (turned) {
            $(this).css({
                '-webkit-transform': 'rotate(0deg)',
                '-moz-transform': 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)'
            });
            turned = false;
        } else {
            $(this).css({
                '-webkit-transform': 'rotate(45deg)',
                '-moz-transform': 'rotate(45deg)',
                '-ms-transform': 'rotate(45deg)',
                'transform': 'rotate(45deg)'
            });
            turned = true;
        }
        $("#projetAdderDiv").toggle('slide');
    });

    $("#subProject").click(function(){
        if ($("#theme").val() != "" && $("#date").val() != "") {
            var data = {
                "theme": $("#theme").val(),
                "date": $("#date").val(),
                "groupids": groupids
            };

            $.ajax({
                url: "/addProject",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function (ret, textStatus, jqXHR) {
                    $("#addCard").slideToggle();

                    var json = $.parseJSON(ret);

                    var table;
                    var tr;
                    var res = '';
                    for (var i = 0; i < json.length; i++) {
                        table = $("<table class='responsive-table highlight'></table>");
                        tr = $('<tr/>');
                        //tr.append("<th>Id</th>");
                        tr.append("<th> Theme </th>");
                        tr.append("<th>Date</th>");
                        table.append(tr);
                        tr = $('<tr/>');
                        //tr.append("<td>" + json[i].id + "</td>");
                        tr.append("<td>" + json[i].theme + "</td>");
                        tr.append("<td>" + json[i].date + "</td>");
                        table.append(tr);
                        table.append(tr);
                        tr = $('<tr/>');
                        //tr.append("<th>Id</th>");
                        tr.append("<th> Nom </th>");
                        tr.append("<th>Prénom</th>");
                        table2.append(tr);
                        for (var j = 0; j < json[i].proList.length; j++) {
                            tr = $('<tr/>');
                            //tr.append("<td>" + json[i].proList[j].id + "</td>");
                            tr.append("<td>" + json[i].proList[j].name+ "</td>");
                            tr.append("<td>" + json[i].proList[j].surname + "</td>");
                            table2.append(tr);
                        }
                        res1 = cardStart + table.prop('outerHTML');
                        res2 = table2.prop('outerHTML') + cardEnd;
                    }
                    var res = res1 + res2;
                    $("#projectMainDiv").append(res);
                }
            });
        }
    });


    $('.datepicker').pickadate({
        monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthsShort: [ 'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec' ],
        weekdaysFull: [ 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi' ],
        weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        weekdaysLetter: [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],

        labelMonthNext: 'Mois suivant',
        labelMonthPrev: 'Mois precédent',
        labelMonthSelect: 'Selection mois',
        labelYearSelect: 'Selection année',

        today: 'Auj',
        clear: 'Effacer',
        close: 'Fermer',
        firstDay: true,
        formatSubmit: 'yyyy-mm-dd',
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
    initTabUser();

});


function initTabUser() {

    dataGroup={};
    $("#usersContent").empty();
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllArtisan",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            initAutoComplete(json);
        }
    });
}
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