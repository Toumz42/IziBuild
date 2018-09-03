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
            makeProjectDiv(json);
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
                    makeProjectDiv(json);
                }
            });
        }
    });

    initMaterial();
    initTabUser();
});

function makeProjectDiv(json) {
    if (json.length > 0) {
        var table;
        var tr;
        for (var i = 0; i < json.length; i++) {
            var projId = json[i].id;
            var accordContent= $("<div class='collapsible-body card card-1' data-projId='"+projId+"' id='suiviProjDiv"+projId+"'></div>");
            var divTaskEmpty= $("<div class='divTaskEmpty'></div>");
            var emptyTaskImg= $("<img class='imgTaskEmpty' src='/assets/images/worker.png'/>");
            var emptyTaskTxt= $("<div class='txtTaskEmpty'>Vous n'avez aucune tâche sur le projet en cours. Créez votre première tache en cliquant ci dessous !</div>");
            divTaskEmpty.append(emptyTaskImg).append(emptyTaskTxt);
            accordContent.append(divTaskEmpty);
            table = $("<table class='responsive-table highlight'></table>");
            table2 = $("<table class='responsive-table highlight'></table>");
            table3 = $("<table class='responsive-table highlight taskTable'></table>");
            table4 = $("<table class='responsive-table highlight hide addTaskTable'></table>");
            tr = $('<tr/>');
            tr.append("<th style='width: 25%'>Projet</th>");
            tr.append("<th> Theme </th>");
            tr.append("<th>Date</th>");
            table.append(tr);
            tr = $('<tr/>');
            tr.append("<td>&nbsp;<span style='display: none'>"+projId+"</span></td>");
            tr.append("<td>" + json[i].theme + "</td>");
            tr.append("<td>" + json[i].date + "</td>");
            table.append(tr);
            tr = $('<tr/>');
            tr.append("<th style='width: 25%'>Artisans</th>");
            tr.append("<th> Nom </th>");
            tr.append("<th>Prénom</th>");
            tr.append("<th>Metier</th>");
            table2.append(tr);
            for (var j = 0; j < json[i].proList.length; j++) {
                tr = $('<tr/>');
                tr.append("<td>&nbsp;<span style='display: none'>"+json[i].user.id+"</span></td>");
                tr.append("<td>" + json[i].proList[j].name + "</td>");
                tr.append("<td>" + json[i].proList[j].surname + "</td>");
                tr.append("<td>" + json[i].proList[j].categorie.libelle + "</td>");
                table2.append(tr);
            }
            for (var k = 0; k < json[i].taskList.length; k++) {
                tr = $('<tr/>');
                tr.append("<td>&nbsp;<span style='display: none'>"+json[i].user.id+"</span></td>");
                tr.append("<td>" + javaToFrenchDate(json[i].taskList[k].dateTask) + "</td>");
                tr.append("<td>" + json[i].taskList[k].contenu + "</td>");
                var checked = "";
                if (json[i].etat == 1) {
                    checked = "checked";
                }
                var toggle ="<div class='switch right-align'><label>"+
                    "   Validation  " +
                    "   <input type='checkbox' id='"+json[i].taskList[k].id+"' type='checkbox' "+checked+">"+
                    "   <span class='lever'>" +
                    "</span></label></div> ";
                tr.append("<td>" + toggle + "</td>");
                tr.append("<td>" +
                    "<div class='deleteIcon' data-taskId='"+json[i].taskList[k].id+"'>"+deleteIcon+"</div>"+
                "</td>");
                table3.append(tr);
            }
            tr = $('<tr/>');
            tr.append("<td>" +
                "<div class='input-field col s3 m3 l3'>" +
                "   <input id='dateTask"+projId+"' type='text' class='datepicker'>" +
                "   <label for='dateTask"+projId+"'>Date</label>" +
                "</div>" +
                "<div class='input-field col s9 m9 l9'>" +
                "   <textarea id='contenu"+projId+"' type='text' class='materialize-textarea'></textarea>" +
                "   <label for='contenu"+projId+"'>Contenu</label>" +
                "</div>" +
                "</td>");
            tr.append("<td>" +
               "<div class='checkIcon'>"+ checkIcon + "</div>"+
                "</td>");
            tr.append("<td>" +
                "<div class='closeIcon'>"+closeIcon +"</div>"+
                "</td>");
            table4.append(tr);
            if (json[i].taskList.length > 0) {
                accordContent.empty();
                accordContent.append(table3);
            }
            accordContent.append("<div class='buttonIcon addTask' type='groupe' id='"+json[i].id+"'>" + addIcon + "</div>");
            accordContent.append(table4);
            //var res1 = cardStart + table.prop('outerHTML');
            //var res2 = table2.prop('outerHTML') + cardEnd;
            //var res = res1 + res2;
            div = $('<div class="right-align suppDiv"/>');
            div.append("<div class='buttonIcon edit' type='groupe' id='"+json[i].id+"'>" + editIcon + "</div>");
            div.append("<div class='buttonIcon delete' type='groupe' id='"+json[i].id+"'>" + deleteIcon + "</div>");
            var card = cardCollapseStart + table.prop('outerHTML') + table2.prop('outerHTML')
                + div.prop('outerHTML')
                + cardCollapseMiddle + $(accordContent).prop('outerHTML')
                + cardCollapseEnd2;
            $("#projectMainDiv").append(card);
        }
        // div = $('<div class="right-align suppDiv"/>');
        // div.append("<div class='buttonIcon edit' type='groupe' id='"+json[i].id+"'>" + editIcon + "</div>");
        // div.append("<div class='buttonIcon delete' type='groupe' id='"+json[i].id+"'>" + deleteIcon + "</div>");
        $("#noProj").hide();
        initMaterial();
    }else {
        $("#noProj").show();
    }
    $(".addTask").click(function () {
        $(this).parents(".collapsible-body").find(".addTaskTable").removeClass("hide");
    });
    $(".closeIcon").click(function () {
        $(this).parents(".collapsible-body").find(".addTaskTable").addClass("hide");
    });
    $(".deleteIcon").click(function () {
        var taskid = $(this).parent().attr("data-taskId");
        var data = {
            "id": taskid,
            "type": "task"
        };
        $.ajax({
            url: "/delete",
            type: "POST",
            data: JSON.stringify(data),
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success: function (ret, textStatus, jqXHR) {
                if (ret) {
                    $(this).parents("tr").remove()
                }
            }
        });
    });
    $(".checkIcon").click(function () {
        var collapseBody = $($(this).parents(".collapsible-body"));
        var id = collapseBody.attr("data-projId");
        var addTable = collapseBody.find(".addTaskTable");
        var taskTable = collapseBody.find(".taskTable");
        var emptyDiv = collapseBody.find(".divTaskEmpty");
        var noTaskTable = $(taskTable).length < 1;
        if (noTaskTable) {
            taskTable = $("<table class='responsive-table highlight taskTable'></table>");
        } else {
            taskTable = $(taskTable);
        }
        if ($("#contenu"+id).val() != "" && $("#dateTask"+id).val() != "") {
            var data = {
                "idProj": id,
                "contenu": $("#contenu"+id).val(),
                "date": $("#dateTask"+id).val(),
            };

            $.ajax({
                url: "/addTask",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function (ret, textStatus, jqXHR) {
                    $(addTable).addClass("hide");
                    $(emptyDiv).remove();
                    var json = $.parseJSON(ret);
                    tr = $('<tr/>');
                    tr.append("<td>&nbsp;<span style='display: none'>"+json.id+"</span></td>");
                    tr.append("<td>" + javaToFrenchDate(json.dateTask) + "</td>");
                    tr.append("<td>" + json.contenu + "</td>");
                    var checked = "";
                    if (json.etat == 1) {
                        checked = "checked";
                    }
                    var toggle ="<div class='switch right-align'><label>"+
                        "   Validation  " +
                        "   <input type='checkbox' id='"+json.id+"' type='checkbox' "+checked+">"+
                        "   <span class='lever'>" +
                        "</span></label></div> ";
                    tr.append("<td>" + toggle + "</td>");
                    taskTable.append(tr);
                    if (noTaskTable) {
                        collapseBody.append(taskTable);
                    }
                }
            });
        }
    });

}

function initTabUser() {

    dataGroup={};
    $("#usersContent").empty();
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllPros",
        type: "GET",
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

function initMaterial() {
    $('.collapsible').collapsible();

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
}