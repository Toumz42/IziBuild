/**
 * Created by ttomc on 11/12/2016.
 */
var groupids = [];
var arrayData = [];


$(function()
{
    $(".page-title").empty().append("Administration Projet");

    $("#signInCheck").click(function(){
        if ( $("#signInCheck").is( ":checked" ) ){
            $("#signInNameDiv").show();
        } else {
            $("#signInNameDiv").hide();
        }
    });

    $("#addUser").click(function () {
        turn($(this));
        $("#usersAdderDiv").toggle("slide");
    });

    $("#addClasse").click(function () {
        turn($(this));
        $("#classeAdderDiv").toggle("slide");
    });

    $("#addGroupe").click(function () {
        turn($(this));
        $("#projetAdderDiv").toggle("slide");
    });

    $("#sub").click(function(){
        if ( ($("#email").size()!=0) && ($("#password").size()!=0) )
        {

            var data = {"name" : $("#last_name").val(),
                "surname" : $("#first_name").val(),
                "email" : $("#email").val(),
                "droit" : $("#droit").val(),
                "password" :  $("#password").val()};

            $.ajax ({
                url: "/addUser",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    $("#usersAdderDiv").toggle("slide");
                    var json = $.parseJSON(ret);
                    var res = userToTab(json);
                    $("#usersContent").append(res);
                    turn($("#addUser"));
                    $("#usersAdderDiv").toggle("slide");
                    myToast("L'utilisateur a bien été ajouté");
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de l'utilisateur");
                }
            });
        }
    });

    $("#subClasse").click(function(){
        if ( ($("#classeName").size()!=0))
        {
            var data = {"name" : $("#classeName").val()};
            data = JSON.stringify(data);
            $.ajax ({
                url: "/addClasse",
                type: "POST",
                data: data,
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    var json = $.parseJSON(ret);
                    var res = classeToTab(json);
                    $("#classeContent").append(res);
                    turn($("#addClasse"));
                    $("#classeAdderDiv").toggle("slide");
                    myToast("La classe a bien été ajouté");
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de la classe");
                }
            });
        }
    });

    $("#subGroupe").click(function(){
        if ( ($("#groupeName").val()!=""))
        {
            var data = {
                "name" : $("#groupeName").val(),
                "theme" : $("#theme").val(),
                "date" : $("#date").val(),
                "groupids" : groupids
            };
            $.ajax ({
                url: "/addProjectGroup",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    var res;
                    var json = $.parseJSON(ret);
                    res = groupeToTab(json);
                    $("#projetContent").append(res);
                    turn($("#addGroupe"));
                    $("#projetAdderDiv").toggle("slide");
                    myToast(" Le groupe de projet a bien été ajouté");
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout du groupe de projet");
                }
            });
        }
    });

    $("#allUser").click(function () {
        initTabUser()
    });


    $("#allGroup").click(function () {
        initTabGroup()
    });

    $.ajax ({
        url: "/getAllGroupeProject",
        type: "GET",
        // data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var res;
            var json = $.parseJSON(ret);
            if ( json.length != 0 ) {
                var res = groupeToTab(json);
                $.each(res, function (index, element) {
                    $("#projetContent").append(element);
                });
            } else
            {
                $('#projetContent').empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#projetContent").append(res);
            }
        }
    });

    $.ajax ({
        url: "/getAllUser",
        type: "GET",
        // data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            initAutoComplete(json);
            if ( json.length != 0 ) {
                var res = userToTab(json);
                initTab('userTab');
                $.each(res, function (index, element) {
                    $("#usersContent").append(element);
                });
            } else {
                $("#usersContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#usersContent").append(res);
            }
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
            initSelectClasse(json);
            if ( json.length != 0 ) {
                var res = classeToTab(json);
                $.each(res, function (index, element) {
                    $("#classeContent").append(element);
                });
            } else {
                $("#classeContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#classeContent").append(res);
            }
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


    Materialize.showStaggeredList($("#stage1"));

    var options = [ {selector: '#stage2', offset: 0, callback: function(el) { Materialize.showStaggeredList($(el)); } } ];
    Materialize.scrollFire(options);
    $('.ul.tabs').tabs();

    $('#mainTabs').click(function (e) {
        initTab(e.target.id)
    });
    $('#userTab').click();
});


function initAutoComplete(json) {
    if (!Array.isArray(json)) {
        json = [json];
    }
    for (var i = 0; i < json.length; i++) {
        var objDataComplete = {};
        objDataComplete["id"] = json[i].id;
        objDataComplete["text"] = json[i].name + " " + json[i].surname;
        arrayData.push(objDataComplete);
    }
    var multiple = $('#multipleInput').materialize_autocomplete({
        data: objDataComplete,
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

function initSelectClasse(json) {
    if (!Array.isArray(json)) {
        json = [json];
    }
    $.each(json,function (index, elem) {
        var opt = $("<option />");
        opt.prop("value",elem.id);
        opt.text(elem.name);
        $("#classeUser").append(opt);
    });
    $('select').material_select();

}

function pushToGroup(item) {
    groupids.push(item)
}

function removeFromGroup(item){
    groupids.pop(item)
}
function initTab(tabName) {
    if (tabName == 'userTab') {
        $("#classeTabUser").show();
        $("#classeTabGroup").hide();
        $("#classeTabUser").children().removeAttr("style");
        $("#classeTabUser").children().tabs({
            onShow: function () {
                initTabUser(this.id)
            }
        });
    }
    if (tabName == 'projTab') {
        $("#classeTabGroup").show();
        $("#classeTabUser").hide();
        $("#classeTabGroup").children().removeAttr("style");
        $("#classeTabGroup").children().tabs({
            onShow: function () {
                initTabGroup(this.id)
            }
        });
    }
    if (tabName == 'classeTab') {
        $("#classeTabUser").hide();
        $("#classeTabGroup").hide();

    }
}



function initTabGroup(classeId) {
    var dataGroup = {'classeId':classeId};
    if (classeId == 'allGroup') {
        dataGroup=null;
    }
    $.ajax ({
        url: "/getAllGroupeProject",
        type: "POST",
        data: JSON.stringify(dataGroup),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var res;
            var json = $.parseJSON(ret);
            if (json.length != 0) {
                var table;
                $('#projetContent').empty();
                var res = groupeToTab(json);
                $.each(res,function (index,elem) {
                    $("#projetContent").append(elem);
                });
                $(".collapsible").collapsible({accordion: false});
            } else {
                $('#projetContent').empty();
                res = cardCollapseStart + imgEmptyDiv + cardCollapseMiddle + cardCollapseEnd2;
                $("#projetContent").append(res);
            }
        }
    });
}

function initTabUser(classeId) {
    var dataGroup = JSON.stringify({'classeId':classeId});
    if (classeId == 'allUser') {
        dataGroup=null;
    }
    $.ajax ({
        type: "POST",
        data: dataGroup,
        url: "/getAllUser",
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            $('#usersContent').empty();
            if ( json.length != 0 ) {
                var res = userToTab(json);
                $.each(res, function (index, element) {
                    $("#usersContent").append(element);
                });
            } else {
                $("#usersContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#usersContent").append(res);
            }
        }
    });
}
function getSuivis( id ) {
    var data = {"id" : id};
    $.ajax ({
        url: "/getProjects",
        type: "POST",
        data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success : function (ret) {
            var json = $.parseJSON(ret);
            var table;
            var tr;
            var res='';
            for (var i = 0; i < json.length; i++) {
                table = $("<table class='responsive-table highlight'></table>");
                table2 = $("<table class='responsive-table highlight'></table>");
                tr = $('<tr/>');
                tr.append("<th>Id</th>");
                tr.append("<th>Date de suivi </th>");
                tr.append("<th>Contenu </th>");
                table.append(tr);
                tr = $('<tr/>');
                tr.append("<td>" + json[i].id + "</td>");
                tr.append("<td>" + json[i].dateSuivi + "</td>");
                tr.append("<td>" + json[i].contenu + "</td>");
                table.append(tr);
                var checked = "";
                if (json[i].etat == 1) {
                    checked = "checked";
                }
                var toggle ="<div class='switch right-align'><label>"+
                    "   Validation  " +
                    "   <input type='checkbox' id='"+json[i].id+"' type='checkbox' "+checked+">"+
                    "   <span class='lever'>" +
                    "</span></label></div> ";
                res = res + cardStart + table.prop('outerHTML') + toggle + cardEnd;
            }
            $("#suiviProjDiv"+id).empty().append(res);
            $(".switch").find("input[type=checkbox]").on("change",function() {
                var status = $(this).prop('checked');
                var data = {id: this.id, state: status};
                $.ajax({
                    url: "/toggleStateSuivi",
                    type: "POST",
                    data: JSON.stringify(data),
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                    success: function(ret, textStatus, jqXHR){

                    }
                });
            });
        }
    });
}
function turn(selector) {
    var turned = selector.hasClass("rotate45");
    if (turned) {
        selector.addClass("unRotate");
        selector.removeClass("rotate45");
    } else {
        selector.addClass("rotate45");
        selector.removeClass("unRotate");
    }
}

function myToast(toastContent) {
    $toastContent = $("<span style='white-space: nowrap'>"+toastContent+"</span>");
    Materialize.toast($toastContent, 3000, 'rounded')
}


