/**
 * Created by ttomc on 06/01/2017.
 */
var arrayData = [];
var users = {};
var currenTabNote;
$(function()
{
    $(".page-title").empty().append("Administration Notes");

    $(".addButton").click(function () {
        turn($(this));
        switch (this.id) {
            case "addNote":
                modalize($("#formNote"),$("#noteAdderDiv"),false);
                $("#noteAdderDiv").toggle("slide");
                break;
            case "addMatiere":
                modalize($("#formMatiere"),$("#matiereAdderDiv"),false);
                $("#matiereAdderDiv").toggle("slide");
                break;
        }
    });

    $.ajax ({
        url: "/getAllClasse",
        type: "POST",
        data: JSON.stringify({}),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if (!Array.isArray(json)) {
                json = [json];
            }
            initSelectClasse(json);

            $.each(json, function (index, element) {
                $('#matieresTabs').append("<li class='tab col s3'><a class='TabUser' id="+  element.id + ">"+ element.name+  "</a></li>");
                $('#notesTabs').append("<li class='tab col s3'><a class='TabUser' id="+  element.id + ">"+ element.name+  "</a></li>");
                // $('#classeTabGroup').children().append("<li class='tab col s3'><a class='TabGroup' id= "+  element.id+ ">"+ json[i].name +  "</a></li>");
            });

        }
    });

    initTabMatiere('allUser');
    initTabNote('allUser');
    initAutoComplete();


    $("#subNote").click(function(){
        if ( ($("#note").size()!=0))
        {
            var url = "/addNote";
            var update = $("#idNote").val() != "";
            if (update) {
                url  = "/updateNote"
            }
            var data = {
                "idNote" : $("#idNote").val(),
                "note" : $("#noteVal").val(),
                "user" : autocomplete.$el.data("value"),
                "matiere" : $("#matiereNote").val()
            };
            data = JSON.stringify(data);
            $.ajax ({
                url: url,
                type: "POST",
                data: data,
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    var json = $.parseJSON(ret);
                    noteToRow(json);
                    // classes = jsonToGlobalArray(classes, json);
                    if ($("#noteContent").find("#noData").length) {
                        $("#noteContent").empty();
                        initTabNote(currenTabNote);
                    }
                    emptyFields(classeFields);
                    $("#noteAdderDiv").toggle("slide");
                    turn($("#addNote"));
                    myToast("La classe a bien été ajouté");

                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de la classe");
                }
            });
        }
    });

    $("#subMatiere").click(function(){
        if ( ($("#matiere").size()!=0))
        {
            var url = "/addMatiere";
            var update = $("#idMatiere").val() != "";
            if (update) {
                url  = "/updateMatiere"
            }
            var data = {
                "idMatiere" : $("#idMatiere").val(),
                "matiere" : $("#matiereName").val(),
                "coef" : $("#coef").val(),
                "classe" : $("#classeMatiere").val()
            };
            data = JSON.stringify(data);
            $.ajax ({
                url: url,
                type: "POST",
                data: data,
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    var json = $.parseJSON(ret);
                    var res = matiereToTab(json);
                    // classes = jsonToGlobalArray(classes, json);
                    if ($("#matiereContent").find("#noData").length) {
                        $("#matiereContent").empty();
                    }
                    emptyFields(classeFields);
                    if (update) {
                        var ids = $("#matiereContent").find(".idMatiere");
                        if (ids.length) {
                            $.each(ids, function (index, el) {
                                $.each(res, function (index, element) {
                                    if ($(el).val() == $(element).find(".idMatiere").val()) {
                                        $(el).parents("ul.stage").remove();
                                        $("#matiereContent").append(element);
                                    }
                                });
                            });
                        } else {
                            $("#matiereContent").append(res);
                        }
                        myToast("La matiere a bien été mise à jour");
                    } else{
                        $("#matiereContent").append(res);
                        turn($("#addNote"));
                        myToast("La matiere a bien été ajouté");
                    }
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de la matiere");
                }
            });
        }
    });

    $('#mainTabs').click(function (e) {
        initTab(e.target.id);
    });
    $("#matieresTabs").show();
    $("select").material_select();

});



function initTab(tabName) {
    if (tabName == 'noteTab') {
        $("#notesTabs").show();
        $("#matieresTabs").hide();
        $("#notesTabs").children().removeAttr("style");
        $("#notesTabs").tabs({
            onShow: function () {
                currenTabNote = this.id;
                initTabNote(this.id);
            }
        });
    }
    if (tabName == 'matTab') {
        $("#matieresTabs").show();
        $("#notesTabs").hide();
        $("#matieresTabs").children().removeAttr("style");
        $("#matieresTabs").tabs({
            onShow: function () {
                initTabMatiere(this.id);
            }
        });
    }
}

function initTabNote(classeId) {
    var data = { 'classeId' : classeId };
    if (classeId == 'allUser') {
        data={};
        $('#noteContent').empty();
    }

    $.ajax ({
        url: "/getAllClasse",
        type: "POST",
        data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var res;
            var json = $.parseJSON(ret);
            if (!Array.isArray(json)) {
                json = [json];
                reset = false;
            }
            if ( json.length != 0 ) {
                $("#noteContent").empty();
                $.each(json,function (index,element) {
                    res = noteToTab(element);
                    // if ($("#noteContent").find("#noData").length
                    // || $("#projetContent").find(".idGroupe").val()*/) {
                    // }
                    // var ids = $("#noteContent").find(".idNote");
                    // if (ids.length) {
                    //     $.each(ids, function (index, el) {
                            $.each(res, function (index, element) {
                                // if ($(el).val() == $(element).find(".idNote").val()) {
                                //     $(el).parents("ul.stage").remove();
                                    $("#noteContent").append(element);
                                // } else {
                                //     $(el).parents("ul.stage").remove();
                                // }
                            // });
                        });
                    // } else {
                    //     $("#noteContent").append(res);
                    // }
                });
            } else
            {
                $('#noteContent').empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#noteContent").append(res);
            }
        }
    });
}

function initTabMatiere(classeId) {
    var dataGroup = { 'classeId' : classeId };
    if (classeId == 'allUser') {
        dataGroup={};
        $("#matiereContent").empty();
    }
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllMatiere",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if ( json.length != 0 ) {
                var res = matiereToTab(json);
                // initTab('userTab');
                // if ($("#matiereContent").find("#noData").length) {
                    $("#matiereContent").empty();
                // }
                // var ids = $("#matiereContent").find(".idMatiere");
                // if (ids.length) {
                //     $.each(ids, function (index, el) {
                        $.each(res, function (index, element) {
                            // if ($(el).val() == $(element).find(".idMatiere").val()) {
                            //     $(el).parents("ul.stage").remove();
                                $("#matiereContent").append(element);
                            // } else {
                            //     $(el).parents("ul.stage").remove();
                            // }
                        // });
                    });
                // } else {
                //     $("#matiereContent").append(res);
                // }
            } else {
                initTabNote('allUser');
                $("#matiereContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#matiereContent").append(res);
            }
        }
    });
}

function initAutoComplete() {
    var json;
    var dataGroup = JSON.stringify({});
    $.ajax({
        url: "/getAllUser",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function (ret, textStatus, jqXHR) {
            json = $.parseJSON(ret);
            users = jsonToGlobalArray(users, json);

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
                    "id" : json[i].id,
                    "text": json[i].name + " " + json[i].surname,
                    "classe":json[i].classeId
                };
                if (arrayData.indexOf(objDataComplete) == -1) {
                    arrayData.push(objDataComplete);
                }
            }
            autocomplete = $('#multipleInput').materialize_autocomplete({
                // data: objDataComplete,
                multiple: {
                    enable: false,
                },
                appender: {
                    el: '.ac-users'
                },
                onSelect : function(item) {
                    initSelectMatiere(item.id);
                },
                onDelete : function() {
                    $('#matiereNote :not(.remain)').remove();
                    $('select').material_select();
                },
                dropdown: {
                    el: '#multipleDropdown',
                    itemTemplate: '<li class="ac-item autocomplete-content" data-id="<%= item.id %>" data-classe="<%= item.classe %>" data-text=\'<%= item.text %>\'><a href="javascript:void(0)"><%= item.text %></a></li>'
                },
                getData: function (value, callback) {
                    callback(value, arrayData);
                }
            });
        }
    });
}
function noteToTab(json) {
    var table;
    var tr;
    var res = [];
    var matieres = json.matiereList;
    // if (!Array.isArray(json)) {
    //     json = [json];
    // }
    var users = json.userList;
    if (users.length ) {
        table = $("<table class='responsive-table highlight' id='classeTable" + json.id + "'></table>");
        th = $('<tr id="headerTabNotes"/>');
        th.append("<th>Eleve</th>");
        if (matieres) {
            for (var k = 0; k < matieres.length; k++) {
                th.append("<th id='" + matieres[k].id + "' >" + matieres[k].matiere + "</th>");
            }
        }
        $(table).append(th);
        for (var i = 0; i < users.length; i++) {
            tr = $("<tr class='idUserNote' value='" + users[i].id + "' />");
            tr.append("<td>" + users[i].id +
                "<input type='hidden' class='idUser' value='" + users[i].id + "'>" +
                users[i].name + " " + users[i].surname + "</td>");
            var append = false;
            for (var l = 0; l < matieres.length; l++) {
                if (users[i].noteList.length) {
                    for (var j = 0; j < users[i].noteList.length; j++) {
                        if (users[i].noteList[j].matiere.id == matieres[l].id) {
                            tr.append("<td>" +
                                "<input type='hidden' class='idUser' value='" + users[i].noteList[j].matiere.id + "'>" +
                                users[i].noteList[j].note + "</td>");
                            append = false;
                            break;
                        } else {
                            append = true;
                        }
                    }
                } else {
                    append = true;
                }
                if (append) {
                    tr.append("<td></td>");
                    append = false;
                }
            }
            tr.append("<td><div class='buttonIcon edit' type='user' id='" + users[i].id + "'>" + editIcon + "</div></td>");
            tr.append("<td><div class='buttonIcon delete' type='user' id='" + users[i].id + "'>" + deleteIcon + "</div></td>");
            $(table).append(tr);
        }
        res.push(cardStart + table.prop('outerHTML') + cardEnd);
    }
    return res;
}

function noteToRow(user) {
    var table;
    var tr;

    table = $("#classeTable"+user.classeId);
    var cols = th.find("*");
    th = $('#headerTabNotes');
    tr = $("<tr class='idUserNote' value='" + user.id +"' />");
    oldTr = $("tr.idUserNote[value='"+user.id+"']");
    tr.append("<td>" +
        "<input type='hidden' class='idUserNote' value='" + user.id +"'>" +
        user.name +" "+ user.surname + "</td>");
    var append = false;
    var cols = th.find("*");
    for (var l = 1; l < cols.length; l++) {
        if (user.noteList.length) {
            for (var j = 0; j < user.noteList.length; j++) {
                if (user.noteList[j].matiere.id == cols[l].id) {
                    tr.append("<td>"  +
                        "<input type='hidden' class='idUser' value='" + user.noteList[j].matiere.id +"'>" +
                        user.noteList[j].note + "</td>");
                    append = false;
                    break;
                } else {
                    append = true;
                }
            }
        } else {
            append = true;
        }
        if (append) {
            tr.append("<td></td>");
            append=false;
        }
    }
    tr.append("<td><div class='buttonIcon edit' type='user' id='"+user.id+"'>" + editIcon + "</div></td>");
    tr.append("<td><div class='buttonIcon delete' type='user' id='"+user.id+"'>" + deleteIcon + "</div></td>");
    if (oldTr.length) {
        oldTr.replaceWith(tr);
    } else {
        table.append(tr);
    }
    
}

function matiereToTab(json) {
    var table;
    var tr;
    var res = [];
    if (!Array.isArray(json)) {
        json = [json];
    }
    for (var i = 0; i < json.length; i++) {
        table = $("<table class='responsive-table highlight'></table>");
        tr = $('<tr/>');
        tr.append("<th>Id</th>");
        tr.append("<th>Nom</th>");
        tr.append("<th>Coeficient</th>");
        $(table).append(tr);
        tr = $('<tr/>');
        tr.append("<td>" + json[i].id + "<input type='hidden' class='idMatiere' value='" + json[i].id +"'>"+ "</td>");
        tr.append("<td>" + json[i].matiere + "</td>");
        tr.append("<td>" + json[i].coef+ "</td>");
        tr.append("<td><div class='buttonIcon edit' type='user' id='"+json[i].id+"'>" + editIcon + "</div></td>");
        tr.append("<td><div class='buttonIcon delete' type='user' id='"+json[i].id+"'>" + deleteIcon + "</div></td>");
        $(table).append(tr);
        res.push(cardStart + table.prop('outerHTML') + cardEnd);
    }
    return res;
}
function initSelectClasse(json) {
    var reset=true;
    if (!Array.isArray(json)) {
        json = [json];
        reset = false;
    }
    if (reset) {
        if ($("#classeMatiere .remain").length) {
            var $a = $($("#classeMatiere .remain")[0].outerHTML);
            $("#classeMatiere").empty();
            $("#classeMatiere").append($a);
        }
    }
    $.each(json,function (index, elem) {
        var opt = $("<option />");
        opt.prop("value",elem.id);
        opt.text(elem.name);
        if (!$("#classeMatiere option[value="+elem.id+"]").length ) {
            $("#classeMatiere").append(opt);
        }
    });
    $('select').material_select();
}
function initSelectMatiere(id) {
    var data = {};
    if (id) {
        data = {"userId": id};
    }
    $.ajax({
        url: "/getAllMatiere",
        type: "POST",
        data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function (ret, textStatus, jqXHR) {
            var json = $.parseJSON(ret);
            $('#matiereNote :not(.remain)').remove();
            $.each(json,function (index, elem) {
                var opt = $("<option />");
                opt.prop("value",elem.id);
                opt.text(elem.matiere);
                if (!$("#matiereNote option[value="+elem.id+"]").length ) {
                    $("#matiereNote").append(opt);
                }
            });
            $('select').material_select();
        }
    });
}