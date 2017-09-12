/**
 * Created by ttomc on 06/01/2017.
 */
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
        url: "/checkCfProjet",
        type: "GET",
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);

            if (json){
                $(".chefP").show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.status==403) {
                //handle error
            }
        }
    });

    $.ajax ({
        url: "/getGroupeProject",
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
                tr.append("<th>Id</th>");
                tr.append("<th>Date de soutenance</th>");
                tr.append("<th> Theme </th>");
                table.append(tr);
                tr = $('<tr/>');
                tr.append("<td>" + json[i].id + "</td>");
                tr.append("<td>" + json[i].theme + "</td>");
                tr.append("<td>" + json[i].date + "</td>");
                table.append(tr);
                tr = $('<tr/>');
                tr.append("<th>Id</th>");
                tr.append("<th> Nom </th>");
                tr.append("<th>Prénom</th>");
                table2.append(tr);
                for (var j = 0; j < json[i].userList.length; j++) {
                    tr = $('<tr/>');
                    tr.append("<td>" + json[i].userList[j].id + "</td>");
                    tr.append("<td>" + json[i].userList[j].name+ "</td>");
                    tr.append("<td>" + json[i].userList[j].surname + "</td>");
                    table2.append(tr);
                }
                res = table.prop('outerHTML');
                res2 = table2.prop('outerHTML');
            }
            $("#tableGrpProjectDiv").append(res);
            $("#tableGrpProjectDiv").append(res2);

        }
    });
    var res = '';
    $.ajax ({
        url: "/getProjects",
        type: "GET",
        data: JSON.stringify(data),
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
                tr.append("<th style='display: none'>Id</th>");
                tr.append("<th> Theme </th>");
                tr.append("<th>Date de soutenance</th>");
                table.append(tr);
                tr = $('<tr/>');
                tr.append("<td style='display: none'>" + json[i].id + "</td>");
                tr.append("<td>" + json[i].dateSuivi + "</td>");
                tr.append("<td>" + json[i].contenu + "</td>");
                table.append(tr);
                var checked = "";
                if (json[i].etat == 1) {
                    checked = "checked";
                }
                var toggle ="<div class='switch right-align'><label>"+
                    "   Validation  " +
                    "   <input disabled type='checkbox' "+checked+">"+
                    "   <span class='lever'></span> "+
                    "   </label></div> " ;
                var res = cardStart + table.prop('outerHTML') + toggle + cardEnd;
                $("#projectMainDiv").append(res);
            }

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
        $("#addCard").toggle('slide');
    });

    $("#subSuivi").click(function(){
        if ( $("#contenuSuivi").size()!="" && $("#dateSuivi").val()!="" )
        {
            var data = {"date" : $("#dateSuivi").val(),"contenu" : $("#contenuSuivi").val()};

            $.ajax ({
                url: "/addProject",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    $("#addCard").slideToggle();

                    var json = $.parseJSON(ret);

                    var table;
                    var tr;
                    var res='';
                    for (var i = 0; i < json.length; i++) {
                        table = $("<table class='responsive-table highlight'></table>");
                        tr = $('<tr/>');
                        tr.append("<th>Id</th>");
                        tr.append("<th>Date du suivi</th>");
                        tr.append("<th> Theme </th>");
                        table.append(tr);
                        tr = $('<tr/>');
                        tr.append("<td>" + json[i].id + "</td>");
                        tr.append("<td>" + json[i].theme + "</td>");
                        tr.append("<td>" + json[i].date + "</td>");
                        table.append(tr);
                        res = res + cardStart + table.prop('outerHTML') + cardEnd;
                    }
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


});