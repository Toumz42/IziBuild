/**
 * Created by ttomc on 26/02/2017.
 */

var classeFields =["#classeName"];
var userFields =["#last_name", "#first_name", "#email", "#droit", "#classeUser", "#password"];
var grpFields =["#groupeName", "#theme", "#date"];

var imgEmptyDiv = "<div id='noData' class='valign-wrapper'>" +
    "<img class='center-align responsive-img noData imgHome' src='/assets/images/empty.png'/>" +
    "</div>"+
    "<div>" +
    "<div class='center-align blue-text'> Désolé nous n'avons rien trouvé </div>" +
    "</div>";
var cardStart = "<ul class='stage'><div class='row'>"+
    "<div class='col push-s1 push-l1 push-m1 m12 s12 l12'>"+ "<li>"+
    "<div class='card card-1'><div class='card-content'>"+
    "<div class='row'>";
var cardEnd = "</div></div></div></li></div></div></ul>";
var deleteIcon = "<i class='material-icons'>delete</i>";
var editIcon = "<i class='material-icons'>edit</i>";
var cardCollapseStart = '<ul class="stage">'+
    '<div class="row">'+
    '<div class="col m12 s12 l12 push-s1 push-l1 push-m1">'+
    '<li>'+
    '<ul class="card-2 collapsible" data-collapsible="accordion">'+
    '<li>'+
    '<div class="card-1 card card-content wrapped collapsible-header">'+
    '<div class="row">';
var cardCollapseMiddle = "</div></div>";
var cardCollapseEnd2 = "</li></ul></li></div></div></ul>";

function userToTab(json) {
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
        tr.append("<th>Prenom</th>");
        $(table).append(tr);
        tr = $('<tr/>');
        tr.append("<td>" + json[i].id + "<input type='hidden' class='idUser' value='" + json[i].id +"'>"+ "</td>");
        tr.append("<td>" + json[i].name + "</td>");
        tr.append("<td>" + json[i].surname + "</td>");
        div = $('<div class="right-align suppDiv"/>');
        div.append("<div class='buttonIcon edit' type='user' id='"+json[i].id+"'>" + editIcon + "</div>");
        div.append("<div class='buttonIcon delete' type='user' id='"+json[i].id+"'>" + deleteIcon + "</div>");
        $(table).append(tr);
        res.push(cardStart + table.prop('outerHTML') + div.prop('outerHTML') + cardEnd);
    }
    return res;
}

function groupeToTab(json) {
    var table;
    var tr;
    var res = [];
    if (!Array.isArray(json)) {
        json = [json];
    }
    for (var i = 0; i < json.length; i++) {
        var accordContent= "<div class='collapsible-body' id='suiviProjDiv"+json[i].id+"'></div>";
        table = $("<table class='responsive-table highlight'></table>");
        table2 = $("<table class='responsive-table highlight'></table>");
        tr = $('<tr/>');
        tr.append("<th >Id</th>");
        tr.append("<th> Theme </th>");
        tr.append("<th>Date de soutenance</th>");
        $(table).append(tr);
        tr = $('<tr/>');
        tr.append("<td>" + json[i].id + "<input type='hidden' class='idGroupe' value='" + json[i].id +"'>"+ "</td>");
        tr.append("<td>" + json[i].theme + "</td>");
        tr.append("<td>" + json[i].date + "</td>");
        $(table).append(tr);
        tr = $('<tr/>');
        tr.append("<th>Membres du groupe</th>");
        $(table2).append(tr);
        for (var j = 0; j < json[i].userList.length; j++) {
            tr = $('<tr/>');
            tr.append("<td>" + json[i].userList[j].id + "</td>");
            tr.append("<td>" + json[i].userList[j].name+ "</td>");
            tr.append("<td>" + json[i].userList[j].surname + "</td>");
            $(table2).append(tr);
        }
        div = $('<div class="right-align suppDiv"/>');
        div.append("<div class='buttonIcon edit' type='groupe' id='"+json[i].id+"'>" + editIcon + "</div>");
        div.append("<div class='buttonIcon delete' type='groupe' id='"+json[i].id+"'>" + deleteIcon + "</div>");
        getSuivis(json[i].id);
        var card = cardCollapseStart + table.prop('outerHTML') + table2.prop('outerHTML')
            + div.prop('outerHTML')
            + cardCollapseMiddle + $(accordContent).prop('outerHTML') 
            + cardCollapseEnd2;
        res.push(card);
    }
    return res;
}

function classeToTab(json) {
    var table;
    var tr;
    var res = [];
    var reset = true;
    if (!Array.isArray(json)) {
        json = [json];
        reset = false;
    }
    if (reset) {
        $('#classeTabGroup').find(".TabGroup").remove();
        $('#classeTabUser').find(".TabUser").remove();
    }
    for (var i = 0; i < json.length; i++) {
        table = $("<table class='responsive-table highlight'></table>");
        tr = $('<tr/>');
        tr.append("<th>Id</th>");
        tr.append("<th>Nom</th>");
        $(table).append(tr);
        tr = $('<tr/>');
        tr.append("<td>" + json[i].id + "<input type='hidden' class='idClasse' value='" + json[i].id +"'>"+ "</td>");
        tr.append("<td>" + json[i].name + "</td>");
        $('#classeTabGroup').children().append("<li class='tab col s3'><a class='TabGroup' id= " + json[i].id + ">" + json[i].name + "</a></li>");
        $('#classeTabUser').children().append("<li class='tab col s3'><a class='TabUser' id=" + json[i].id + ">" + json[i].name + "</a></li>");
        $(table).append(tr);
        div = $('<div class="right-align suppDiv"/>');
        div.append("<div class='buttonIcon edit' type='classe' id='"+json[i].id+"'>" + editIcon + "</div>");
        div.append("<div class='buttonIcon delete' type='classe' id='"+json[i].id+"'>" + deleteIcon + "</div>");
        res.push(cardStart + table.prop('outerHTML') + div.prop('outerHTML')  + cardEnd);
    }
    return res;
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
                tr.append("<th>Date de suivi</th>");
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

function fillEditFormUser(val,id) {
    var user = val[0];
    $("#idUser").val(id);
    $("#last_name").val(user.name);
    $("#first_name").val(user.surname);
    $("#email").val(user.email);
    $("#droit").val(user.droit);
    $("#classeUser").val(user.classeId);
    $('select').material_select();
    $("#password").val(user.password);
    activeFields(userFields);
}
function fillEditFormClasse(val,id) {
    var classe = val[0];
    $("#idClasse").val(id);
    $("#classeName").parent().children("label").addClass("active");
    $("#classeName").val(classe.name);
}
function fillEditFormGroupe(val,id) {
    var groupe = val[0];
    $("#idGroupe").val(id);
    $("#groupeName").val(groupe.name);
    $("#theme").val(groupe.theme);
    $("#date").val(groupe.date);
    groupids = [];
    $.each(groupe.users,function () {
        var chip = {
            'id' : this.id,
            'text' : this.name
        };
        autocomplete.append(chip)
    });
    activeFields(grpFields);
}

function emptyComplete(array) {
    for ( var i = array.length - 1 ; i >=0 ; i--) {
        var element = array[i];
        var chip = {
            'id' : element,
            'text' : null
        };
        autocomplete.remove(chip)
    }
    groupids = [];
}
