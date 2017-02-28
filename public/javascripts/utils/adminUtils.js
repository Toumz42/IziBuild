/**
 * Created by ttomc on 26/02/2017.
 */
var imgEmptyDiv = "<div class='valign-wrapper'>" +
    "<img class='center-align responsive-img imgHome' src='/assets/images/empty.png'/>" +
    "</div>"+
    "<div>" +
    "<div class='center-align blue-text'> Désolé nous n'avons rien trouvé </div>" +
    "</div>";
var cardStart = "<ul class='stage'><div class='row'>"+
    "<div class='col push-s1 push-l1 m12 s12 l12'>"+ "<li>"+
    "<div class='card card-1'><div class='card-content'>"+
    "<div class='row'>";
var cardEnd = "</div></div></div></li></div></div></ul>";
var deleteIcon = "<i class='material-icons'>delete</i>";
var editIcon = "<i class='material-icons'>edit</i>";
var cardCollapseStart = "<ul class='stage' >"+
    "<div class='row' >"+
    "<div class='col m12 s12 l12 push-s1 push-m2 push-l1'>"+
    "<li>"+
    "<ul class='card-2 collapsible' data-collapsible='accordion'>"+
    "<li>"+
    "<div class='card-1 card card-content wrapped collapsible-header'>"+
    "<div class='row'>";
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
        tr.append("<td>" + json[i].id + "</td>");
        tr.append("<td>" + json[i].name + "</td>");
        tr.append("<td>" + json[i].surname + "</td>");
        div = $('<div class="right-align suppDiv"/>');
        div.append("<div class='buttonIcon edit'>" + editIcon + "</div>");
        div.append("<div class='buttonIcon delete'>" + deleteIcon+ "</div>");
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
        tr.append("<td id='idGroupe'>" + json[i].id + "</td>");
        tr.append("<td>" + json[i].theme + "</td>");
        tr.append("<td>" + json[i].date + "</td>");
        $(table).append(tr);
        tr = $('<tr/>');
        tr.append("<th>Membres du groupe</th>");
        $(table2).append(tr);
        for (var j = 0; j < json[i].users.length; j++) {
            tr = $('<tr/>');
            tr.append("<td>" + json[i].users[j].id + "</td>");
            tr.append("<td>" + json[i].users[j].name+ "</td>");
            tr.append("<td>" + json[i].users[j].surname + "</td>");
            $(table2).append(tr);
        }
        div = $('<div class="right-align suppDiv"/>');
        div.append("<div class='buttonIcon edit'>" + editIcon + "</div>");
        div.append("<div class='buttonIcon delete'>" + deleteIcon+ "</div>");
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
    if (!Array.isArray(json)) {
        json = [json];
    }
    for (var i = 0; i < json.length; i++) {
        table = $("<table class='responsive-table highlight'></table>");
        tr = $('<tr/>');
        tr.append("<th>Id</th>");
        tr.append("<th>Nom</th>");
        $(table).append(tr);
        tr = $('<tr/>');
        tr.append("<td>" + json[i].id + "</td>");
        tr.append("<td>" + json[i].name + "</td>");
        $('#classeTabUser').children().append("<li class='tab col s3'><a class='TabUser' id="+  json[i].id + ">"+ json[i].name+  "</a></li>");
        $('#classeTabGroup').children().append("<li class='tab col s3'><a class='TabGroup' id= "+  json[i].id+ ">"+ json[i].name +  "</a></li>");
        $(table).append(tr);
        div = $('<div class="right-align suppDiv"/>');
        div.append("<div class='buttonIcon edit'>" + editIcon + "</div>");
        div.append("<div class='buttonIcon delete'>" + deleteIcon+ "</div>");
        res.push(cardStart + table.prop('outerHTML') + div.prop('outerHTML')  + cardEnd);
    }
    return res;
}