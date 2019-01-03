/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    $(".page-title").empty().append("Notes");
    initTabUser();
});
   
function initTabUser() {
    var dataGroup={};
    waitOn();
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getMyNotes",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if ( json.length != 0 ) {
                // users = jsonToGlobalArray(users, json);
                var res = userNoteToTab(json);
                // initTab('userTab');
                if ($("#note").find("#noData").length) {
                    $("#note").empty();
                }
                var ids = $("#usersContent").find(".idUser");
                if (ids.length) {
                    $.each(ids, function (index, el) {
                        $.each(res, function (index, element) {
                            if ($(el).val() == $(element).find(".idUser").val()) {
                                $(el).parents("ul.stage").remove();
                                $("#note").append(element);
                            } else {
                                $(el).parents("ul.stage").remove();
                            }
                        });
                    });
                } else {
                    $("#note").append(res);
                }
            } else {
                $("#note").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#note").append(res);
            }
            waitOff();
        },
        error : function (xhr, ajaxOptions, thrownError) {
            myToast("Erreur dans la recuperation");
            waitOff();
        }
    });
}


function userNoteToTab(json) {
    var table;
    var tr;
    var res = [];
    if (!Array.isArray(json)) {
        json = [json];
    }
    $.each(json,function (index, element) {
        table = $("<table class='responsive-table highlight'></table>");
        tr = $('<tr/>');
        tr.append("<th>Id</th>");
        tr.append("<th>Nom</th>");
        tr.append("<th>Prenom</th>");
        $(table).append(tr);
        tr = $('<tr/>');
        tr.append("<td>" + element.id + "<input type='hidden' class='idUser' value='" + element.id + "'>" + "</td>");
        tr.append("<td>" + element.name + "</td>");
        tr.append("<td>" + element.surname + "</td>");
        $(table).append(tr);

        var notes = element.noteList;
        var notesTitles = ['Matiere','Coefficient','Note'];
        var table2 = $("<table class='responsive-table highlight' id='classeTable" + element.id + "'></table>");
        tr = $("<tr class='idUserNote' value='" + element.id + "' />");
        $.each(notesTitles, function (index, title) {
            tr.append("<th>" + title+ "</th>");
        });
        $(table2).append(tr);
        var moyenne = 0;
        var coef = 0;
        $.each(notes, function (index, note) {
            tr = $("<tr/>");
            tr.append("<td>" + note.matiere.matiere + "</td>");
            tr.append("<td>" + note.matiere.coef + "</td>");
            tr.append("<td>" + note.note + "</td>");
            moyenne += note.note * note.matiere.coef;
            coef += note.matiere.coef;
            $(table2).append(tr);
        });
        tr = $("<tr/>");
        tr.append("<td></td>");
        tr.append("<td> Moyenne </td>");
        tr.append("<td>"+ Math.round((moyenne / coef) * 100 )/100 +"</td>");
        $(table2).append(tr);

        res.push(cardStart + table.prop('outerHTML') + table2.prop('outerHTML') + cardEnd);
    });

    return res;
}