/**
 * Created by ttomc on 06/01/2017.
 */
var groupids = [];
$(function()
{
    $(".page-title").empty().append("Projet");
    var cardStart = "<ul class='stage'><div class='row'>"+
        "<div class='col m12 s12 l12'>"+ "<li>"+
        "<div class='card card-1'><div class='card-content'>"+
        "<div class='row'>";
    var cardEnd = "</div></div></div></li></div></div></ul>";
    data=null;


    $.ajax ({
        url: "/getProjectsPro",
        type: "GET",
        // data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            makeProjectDiv(json);
            waitOff();
        },
        error : function (xhr, ajaxOptions, thrownError) {
            myToast("Erreur dans la recuperation");
            waitOff();
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
        $('html, body').animate({scrollTop: 0}, 500);
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
                    waitOff();
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans la recuperation");
                    waitOff();
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
            table = $("<table class='responsive-table'></table>");
            table2 = $("<table class='responsive-table'></table>");
            table3 = $("<table class='responsive-table taskTable'></table>");
            table4 = $("<table class='responsive-table hide addTaskTable'></table>");
            tr = $('<tr/>');
            tr.append("<th>" + "</th>");
            tr.append("<th> Theme </th>");
            tr.append("<th>Date</th>");
            tr.append("<th>Adresse</th>");
            table.append(tr);
            tr = $('<tr/>');
            tr.append("<td>&nbsp;<span style='display: none'>"+projId+"</span></td>");
            tr.append("<td>" + json[i].theme + "</td>");
            tr.append("<td>" + json[i].date + "</td>");
            tr.append("<td>" + json[i].adresse + "</td>");
            table.append(tr);
            tr = $('<tr/>');
            tr.append("<th style='width: 25%;color:black;'>Projet</th>");
            //tr.append("<th style='width: 25%'>Utilisateur</th>");
            tr.append("<th> Nom </th>");
            tr.append("<th>Prénom</th>");
            tr.append("<th></th>");
            table2.append(tr);
            tr = $('<tr/>');
            tr.append("<td>&nbsp;<span style='display: none'>"+json[i].user.id+"</span></td>");
            //tr.append("<td>" + "</td>");
            tr.append("<td>" + json[i].user.name + "</td>");
            tr.append("<td>" + json[i].user.surname + "</td>");
            tr.append("<td></td>");
            table2.append(tr);
            tr = $('<tr/>');
            if (json[i].proList > 0) {
                tr.append("<th style='width: 25%;color:black;'> Arstisans </th>");
                tr.append("<th> Nom </th>");
                tr.append("<th>Prénom</th>");
                tr.append("<th>Metier</th>");
                table2.append(tr);
                for (var j = 0; j < json[i].proList.length; j++) {
                    tr = $('<tr/>');
                    tr.append("<td>&nbsp;<span style='display: none'>"+json[i].proList[j].id + "</span></td>");
                    tr.append("<td>" + json[i].proList[j].name + "</td>");
                    tr.append("<td>" + json[i].proList[j].surname + "</td>");
                    tr.append("<td>" + json[i].proList[j].categorie.libelle + "</td>");
                    table2.append(tr);
                }
            }
            table4.append('<tr><td style="\n' +
                '    padding: 0 0px 0 25px;\n' +
                '">Tâches</td></tr>');
            for (var k = 0; k < json[i].taskList.length; k++) {
                tr = $('<tr/>');
                tr.append("<td>&nbsp;<span style='display: none'>"+json[i].user.id+"</span></td>");
                tr.append("<td>" +
                    "<div class='input-field col s3 m3 l3'>" +
                    "   <input id='dateTask"+json[i].taskList[k].id+"' data-taskId='"+json[i].taskList[k].id+"' type='text' class='datepicker' value='" + timeToDatePicker(json[i].taskList[k].dateTask) + "'>" +
                    "   <label for='dateTask"+json[i].taskList[k].id+"'>Date</label>" +
                    "</div>" +
                    "<div class='input-field col s9 m9 l9' style=\"\n" +
                    "    width: 59%;\n" +
                    "\">" +
                    "   <textarea id='contenu"+json[i].taskList[k].id+"' data-taskId='"+json[i].taskList[k].id+"' type='text' class='materialize-textarea'>"+json[i].taskList[k].contenu+"</textarea>" +
                    "   <label for='contenu"+json[i].taskList[k].id+"'>Contenu</label>" +
                    "</div>");
                var checked = "";
                if (json[i].taskList[k].etat == 1) {
                    checked = "checked";
                }
                var toggle ="<div class='switch right-align'><label>"+
                    "   Validation  " +
                    "   <input type='checkbox' id='"+json[i].taskList[k].id+"' class='validTask' type='checkbox' "+checked+">"+
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
                "<div class='input-field col s9 m9 l9' style=\"\n" +
                "    width: 59%;\n" +
                "\">" +
                "   <textarea id='contenu"+projId+"' type='text' class='materialize-textarea'></textarea>" +
                "   <label for='contenu"+projId+"'>Contenu</label>" +
                "</div>" + "<div class='icons-container'><div class='checkIcon'>"+ checkIcon + "</div>" +
                "<div class='closeIcon'>"+closeIcon +"</div></div>" +
                "</td>");
            tr.append();
            tr.append();
            //table3.prepend('<tr><td><h5>Tâches</h5></td></tr>');
            table4.append(tr);
            if (json[i].taskList.length > 0) {
                accordContent.empty();
                accordContent.append(table3);
            }
            accordContent.append("<div class='buttonIcon addTask' type='groupe' id='"+json[i].id+"'>" + addIcon + "</div>");
            accordContent.append(table4);

            //var res1 = cardStart + table.prop('outerHTML') + table1.prop('outerHTML');
            //var res2 = table2.prop('outerHTML') + cardEnd;
            div = $('<div class="right-align suppDiv"/>');
            var card = cardCollapseStart
                + table2.prop('outerHTML')
                + table.prop('outerHTML')
                + div.prop('outerHTML')
                + cardCollapseMiddle + $(accordContent).prop('outerHTML')
                + cardCollapseEnd2;
            $("#projectMainDiv").append(card);
        }
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
    $(".taskInput").change(function () {
        var id = $(this).data("taskid");
        var type = this.id;
        var data = {
            "idTask": id,
            "contenu": $(this).val(),
            "type": type
        };
        $.ajax({
            url: "/changeTasksbyId",
            type: "POST",
            data: JSON.stringify(data),
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success: function (ret, textStatus, jqXHR) {
                myToast("Tâche mise à jour !")
            }
        });
    });
    $(".delete").click(function () {
        var self = this;
        var id = this.id;
        var data = {
            "id": id,
            "type": "projet"
        };
        $.ajax({
            url: "/delete",
            type: "POST",
            data: JSON.stringify(data),
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success: function (ret, textStatus, jqXHR) {
                $(self).parents(".stage").slideToggle();
                setTimeout(function () {
                    $(self).parents(".stage").remove();
                }, 750);
            }
        });
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
                    tr.append("<td>" +
                    "<div class='input-field col s3 m3 l3'>" +
                    "   <input id='dateTask"+json[i].taskList[k].id+"' data-taskId='"+json[i].taskList[k].id+"' type='text' class='datepicker' value=" + timeToDatePicker(json[i].taskList[k].dateTask) + "'>" +
                    "   <label for='dateTask"+json[i].taskList[k].id+"'>Date</label>" +
                    "</div>" +
                    "<div class='input-field col s9 m9 l9' style=\"\n" +
                    "    width: 59%;\n" +
                    "\">" +
                    "   <textarea id='contenu"+json[i].taskList[k].id+"' data-taskId='"+json[i].taskList[k].id+"' type='text' class='materialize-textarea'>json[i].taskList[k].contenu</textarea>" +
                    "   <label for='contenu"+json[i].taskList[k].id+"'>Contenu</label>" +
                    "</div>");

                    var checked = "";
                    if (json.etat == 1) {
                        checked = "checked";
                    }
                    var toggle = "<div class='switch right-align'><label>" +
                        "   Validation  " +
                        "   <input type='checkbox' id='" + json.id + "'  class='validTask' type='checkbox' " + checked + ">" +
                        "   <span class='lever'>" +
                        "</span></label></div> ";
                    tr.append("<td>" + toggle + "</td><td>" +
                        "<div class='deleteIcon' data-taskId='" + json.id + "'>" + deleteIcon + "</div>"
                        + "</td>");
                    taskTable.append(tr);
                    if (noTaskTable) {
                        collapseBody.append(taskTable);
                    }
                    initValidProj();
                    $(".taskInput").change(function () {
                        var id = $(this).data("taskid");
                        var type = this.id;
                        var data = {
                            "idTask": id,
                            "contenu": $(this).val(),
                            "type": type
                        };
                        $.ajax({
                            url: "/changeTasksbyId",
                            type: "POST",
                            data: JSON.stringify(data),
                            dataType: "text",
                            contentType: "application/json; charset=utf-8",
                            success: function (ret, textStatus, jqXHR) {
                                myToast("Tâche mise à jour !")
                            }
                        });
                    });
                    initMaterial();
                }
            });
        }
    });
    initMaterial();
    initValidProj();
}

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
