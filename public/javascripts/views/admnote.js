/**
 * Created by ttomc on 06/01/2017.
 */
var arrayData = [];
var users = {};
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
        type: "GET",
        // data: JSON.stringify(data),
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
                "note" : $("#note").val(),
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
                    var res = classeToTab(json);
                    classes = jsonToGlobalArray(classes, json);
                    if ($("#noteContent").find("#noData").length) {
                        $("#noteContent").empty();
                    }
                    emptyFields(classeFields);
                    if (update) {
                        var ids = $("#noteContent").find(".idClasse");
                        if (ids.length) {
                            $.each(ids, function (index, el) {
                                $.each(res, function (index, element) {
                                    if ($(el).val() == $(element).find(".idClasse").val()) {
                                        $(el).parents("ul.stage").remove();
                                        $("#noteContent").append(element);
                                    }
                                });
                            });
                        }else {
                            $("#noteContent").append(res);
                        }
                        myToast("La classe a bien été mise à jour");
                    } else{
                        $("#noteContent").append(res);
                        turn($("#addNote"));
                        $("#noteAdderDiv").toggle("slide");
                        myToast("La classe a bien été ajouté");
                    }
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de la classe");
                }
            });
        }
    });

    $('#mainTabs').click(function (e) {
        initTab(e.target.id);
    });
    $("#notesTabs").show();
    $("select").material_select();

});



function initTab(tabName) {
    if (tabName == 'noteTab') {
        $("#notesTabs").show();
        $("#matieresTabs").hide();
        $("#notesTabs").children().removeAttr("style");
        $("#notesTabs").children().tabs({
            onShow: function () {
                initTabUser(this.id);
            }
        });
    }
    if (tabName == 'matTab') {
        $("#matieresTabs").show();
        $("#notesTabs").hide();
        $("#matieresTabs").children().removeAttr("style");
        $("#matieresTabs").children().tabs({
            onShow: function () {
                initTabGroup(this.id);
            }
        });
    }
}

function initTabNote(classeId , matieres) {
    var dataGroup = { 'classeId' : classeId };
    if (classeId == 'allUser') {
        dataGroup={};
        $('#noteContent').empty();
    }
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllUser",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var res;
            var json = $.parseJSON(ret);
            if ( json.length != 0 ) {
                users = jsonToGlobalArray(users, json);
                res = noteToTab(json,matieres);
                initAutoComplete(json);
                if ($("#noteContent").find("#noData").length
                /*|| $("#projetContent").find(".idGroupe").val()*/) {
                    $("#noteContent").empty();
                }
                var ids = $("#noteContent").find(".idNote");
                if (ids.length) {
                    $.each(ids, function (index, el) {
                        $.each(res, function (index, element) {
                            if ($(el).val() == $(element).find(".idNote").val()) {
                                $(el).parents("ul.stage").remove();
                                $("#noteContent").append(element);
                            } else {
                                $(el).parents("ul.stage").remove();
                            }
                        });
                    });
                } else {
                    $("#noteContent").append(res);
                }
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
                initTabNote('allUser', json);
                if ($("#matiereContent").find("#noData").length) {
                    $("#matiereContent").empty();
                }
                var ids = $("#matiereContent").find(".idMatiere");
                if (ids.length) {
                    $.each(ids, function (index, el) {
                        $.each(res, function (index, element) {
                            if ($(el).val() == $(element).find(".idMatiere").val()) {
                                $(el).parents("ul.stage").remove();
                                $("#matiereContent").append(element);
                            } else {
                                $(el).parents("ul.stage").remove();
                            }
                        });
                    });
                } else {
                    $("#matiereContent").append(res);
                }
            } else {
                initTabNote('allUser');
                $("#matiereContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#matiereContent").append(res);
            }
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
            "id" : json[i].id,
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
function noteToTab(json, matieres) {
    var table;
    var tr;
    var res = [];
    if (!Array.isArray(json)) {
        json = [json];
    }
    table = $("<table class='responsive-table highlight'></table>");
    th = $('<tr id="headerTabNotes"/>');
    th.append("<th>Eleve</th>");
    if (matieres) {
        for (var k = 0; k < matieres.length; k++) {
            th.append("<th>"+matieres[k].matiere+"</th>");
        }
    }
    $(table).append(th);
    for (var i = 0; i < json.length; i++) {
        tr = $('<tr/>');
        tr.append("<td>" + json[i].id +
            "<input type='hidden' class='idUser' value='" + json[i].id +"'>" +
            json[i].name +" "+ json[i].surname + "</td>");
        if (json[i].noteList) {
            for (var j = 0; j < json[i].noteList.length; i++) {
                if (json[i].noteList[j].matiere.id) {
                tr.append("<td>" + json[i].id +
                    "<input type='hidden' class='idUser' value='" + json[i].id +"'>" +
                    json[i].name +" "+ json[i].surname + "</td>");
                }
            }
        }
        tr.append("<td><div class='buttonIcon edit' type='user' id='"+json[i].id+"'>" + editIcon + "</div></td>");
        tr.append("<td><div class='buttonIcon delete' type='user' id='"+json[i].id+"'>" + deleteIcon + "</div></td>");
        $(table).append(tr);
    }
    res.push(cardStart + table.prop('outerHTML') + cardEnd);
    return res;
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