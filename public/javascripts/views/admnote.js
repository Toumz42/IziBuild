/**
 * Created by ttomc on 06/01/2017.
 */
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

            $.each(json, function (index, element) {
                $('#matieresTabs').append("<li class='tab col s3'><a class='TabUser' id="+  element.id + ">"+ element.name+  "</a></li>");
                $('#notesTabs').append("<li class='tab col s3'><a class='TabUser' id="+  element.id + ">"+ element.name+  "</a></li>");
                // $('#classeTabGroup').children().append("<li class='tab col s3'><a class='TabGroup' id= "+  element.id+ ">"+ json[i].name +  "</a></li>");
            });

        }
    });

    $("#subClasse").click(function(){
        if ( ($("#classeName").size()!=0))
        {
            var url = "/addNote";
            var update = $("#idNote").val() != "";
            if (update) {
                url  = "/updateNote"
            }
            var data = {
                "idNote" : $("#idNote").val(),
                "note" : $("#note").val(),
                "user" : $("#not").val(),
                "matiere" : $("#classeName").val()
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
                    if ($("#classeContent").find("#noData").length) {
                        $("#classeContent").empty();
                    }
                    emptyFields(classeFields);
                    if (update) {
                        var ids = $("#classeContent").find(".idClasse");
                        if (ids.length) {
                            $.each(ids, function (index, el) {
                                $.each(res, function (index, element) {
                                    if ($(el).val() == $(element).find(".idClasse").val()) {
                                        $(el).parents("ul.stage").remove();
                                        $("#classeContent").append(element);
                                    }
                                });
                            });
                        }else {
                            $("#classeContent").append(res);
                        }
                        myToast("La classe a bien été mise à jour");
                    } else{
                        $("#classeContent").append(res);
                        turn($("#addClasse"));
                        initSelectClasse(json);
                        $("#classeAdderDiv").toggle("slide");
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

function initTabNote(classeId) {
    var dataGroup = { 'classeId' : classeId };
    if (classeId == 'allGroup') {
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
                groupes = jsonToGlobalArray(groupes, json);
                res = groupeToTab(json);
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
            initAutoComplete(json);
            if ( json.length != 0 ) {
                users = jsonToGlobalArray(users, json);
                var res = userToTab(json);
                // initTab('userTab');
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
                $("#matiereContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#matiereContent").append(res);
            }
        }
    });
}
