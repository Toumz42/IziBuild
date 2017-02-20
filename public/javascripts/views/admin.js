/**
 * Created by ttomc on 11/12/2016.
 */
var objDataComplete = {};
var groupids = [];
var imgEmptyDiv = "<div class='valign-wrapper'>" +
                            "<img class='center-align responsive-img imgHome' src='/assets/images/empty.png'/>" +
                    "</div>"+
                    "<div>" +
                            "<div class='center-align blue-text'> Désolé nous n'avons rien trouvé </div>" +
                    "</div>";
var cardStart = "<ul class='stage'><div class='row'>"+
    "<div class='col push-s1 push-l1 m10 s10 l10'>"+ "<li>"+
    "<div class='card card-1'><div class='card-content'>"+
    "<div class='row'>";
var cardEnd = "</div></div></div></li></div></div></ul>";

$(function()
{
    $(".page-title").empty().append("Administration");

    $("#signInCheck").click(function(){
        if ( $("#signInCheck").is( ":checked" ) ){
            $("#signInNameDiv").show();
        } else {
            $("#signInNameDiv").hide();
        }
    });

    var turnedUser = false;
    $("#addUser").click(function () {
        if (turnedUser) {
            $(this).css({
                '-webkit-transform': 'rotate(0deg)',
                '-moz-transform': 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)'
            });
            turnedUser = false;
        } else {
            $(this).css({
                '-webkit-transform': 'rotate(45deg)',
                '-moz-transform': 'rotate(45deg)',
                '-ms-transform': 'rotate(45deg)',
                'transform': 'rotate(45deg)'
            });
            turnedUser = true;
        }
        $("#usersAdderDiv").toggle("slide");
    });

    var turnedClasse = false;
    $("#addClasse").click(function () {
        if (turnedClasse) {
            $(this).css({
                '-webkit-transform': 'rotate(0deg)',
                '-moz-transform': 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)'
            });
            turnedClasse = false;
        } else {
            $(this).css({
                '-webkit-transform': 'rotate(45deg)',
                '-moz-transform': 'rotate(45deg)',
                '-ms-transform': 'rotate(45deg)',
                'transform': 'rotate(45deg)'
            });
            turnedClasse = true;
        }
        $("#classeAdderDiv").toggle("slide");
    });

    var turnedGroupe = false;
    $("#addGroupe").click(function () {
        if (turnedGroupe) {
            $(this).css({
                '-webkit-transform': 'rotate(0deg)',
                '-moz-transform': 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)'
            });
            turnedGroupe = false;
        } else {
            $(this).css({
                '-webkit-transform': 'rotate(45deg)',
                '-moz-transform': 'rotate(45deg)',
                '-ms-transform': 'rotate(45deg)',
                'transform': 'rotate(45deg)'
            });
            turnedGroupe = true;
        }
        $("#projetAdderDiv").toggle("slide");
    });

    $("#sub").click(function(){
        if ( ($("#email").size()!=0) && ($("#password").size()!=0) )
        {

            var data = {"name" : $("#last_name").val(),
                "surname" : $("#first_name").val(),
                "email" : $("#email").val(),
                "password" :  $("#password").val()};

            $.ajax ({
                url: "/addUser",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){

                }
            });
        }
    });

    $("#subClasse").click(function(){
        if ( ($("#classeName").size()!=0))
        {

            var data = {"name" : $("#classeName").val()};

            $.ajax ({
                url: "/addClasse",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){

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

                }
            });
        }
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
            var cardStart = "<ul class='stage'><div class='row'>"+
                "<div class='col m12 s12 l12  push-s1 push-m2 push-l1'>"+ "<li>"+
                "<div class='card card-1'><div class='card-content'>"+
                "<div class='row'>";
            var cardEnd = "</div></div></div></li></div></div></ul>";
            if ( json.length != 0 ) {
                var table;
                var tr;
                for (var i = 0; i < json.length; i++) {
                    table = $("<table class='responsive-table highlight'></table>");
                    tr = $('<tr/>');
                    tr.append("<th>Id</th>");
                    tr.append("<th> Theme </th>");
                    tr.append("<th>Date de soutenance</th>");
                    $(table).append(tr);
                    tr = $('<tr/>');
                    tr.append("<td>" + json[i].id + "</td>");
                    tr.append("<td>" + json[i].theme + "</td>");
                    tr.append("<td>" + json[i].date + "</td>");
                    $(table).append(tr);
                    for (var j = 0; j < json[i].users.length; j++) {
                        tr = $('<tr/>');
                        tr.append("<td>" + json[i].users[j].id + "</td>");
                        tr.append("<td>" + json[i].users[j].name+ "</td>");
                        tr.append("<td>" + json[i].users[j].surname + "</td>");
                        $(table).append(tr);
                    }
                    res = cardStart + table.prop('outerHTML') + cardEnd;
                    $("#projetContent").append(res);

                }
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
            var cardStart = "<ul class='stage'><div class='row'>"+
                "<div class='col m12 s12 l12  push-s1 push-m2 push-l1'>"+ "<li>"+
                "<div class='card card-1'><div class='card-content'>"+
                "<div class='row'>";
            var cardEnd = "</div></div></div></li></div></div></ul>";
            var table;
            var tr;
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
                $(table).append(tr);
                // for (var j = 0; j < json[i].users.length; j++) {
                //     tr = $('<tr/>');
                //     tr.append("<td>" + json[i].users[j].id + "</td>");
                //     tr.append("<td>" + json[i].users[j].name+ "</td>");
                //     tr.append("<td>" + json[i].users[j].surname + "</td>");
                //     $(table).append(tr);
                // }
                var res = cardStart + table.prop('outerHTML') + cardEnd;
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
            var cardStart = "<ul class='stage'><div class='row'>"+
                "<div class='col m12 s12 l12  push-s1 push-m2 push-l1'>"+ "<li>"+
                "<div class='card card-1'><div class='card-content'>"+
                "<div class='row'>";
            var cardEnd = "</div></div></div></li></div></div></ul>";
            var table;
            var tr;
            for (var i = 0; i < json.length; i++) {
                table = $("<table class='responsive-table highlight'></table>");
                tr = $('<tr/>');
                tr.append("<th>Id</th>");
                tr.append("<th>Nom</th>");
                $(table).append(tr);
                tr = $('<tr/>');
                tr.append("<td>" + json[i].id + "</td>");
                tr.append("<td>" + json[i].name + "</td>");
                initTab('userTab');
                $('#classeTabUser').children().append("<li class='tab col s3'><a class='TabUser' id="+  json[i].id + ">"+ json[i].name+  "</a></li>");
                $('#classeTabGroup').children().append("<li class='tab col s3'><a class='TabGroup' id= "+  json[i].id+ ">"+ json[i].name +  "</a></li>");
                // $('#mainTabs').children().removeAttr("style");
                $(table).append(tr);
                // for (var j = 0; j < json[i].users.length; j++) {
                //     tr = $('<tr/>');
                //     tr.append("<td>" + json[i].users[j].id + "</td>");
                //     tr.append("<td>" + json[i].users[j].name+ "</td>");
                //     tr.append("<td>" + json[i].users[j].surname + "</td>");
                //     $(table).append(tr);
                // }
                var res = cardStart + table.prop('outerHTML') + cardEnd;
                $("#classe").append(res);
            }
        }
    });

    $('.datepicker').pickadate({
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
    for (var i=0; i<json.length;i++) {
        objDataComplete["id"] = json[i].id ;
        objDataComplete["text"] = json[i].name + " " + json[i].surname;

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
            itemTemplate: '<li class="ac-item" data-id="<%= item.id %>" data-text=\'<%= item.text %>\'><a href="javascript:void(0)"><%= item.text %></a></li>'
        },
        getData: function (value, callback) {
            // ...
            callback(value, [objDataComplete]);
        }
    });
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
            if (json.length != 0) {
                var table;
                var tr;
                $('#projetContent').empty();
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
                    getSuivis(json[i].id);
                    res = cardCollapseStart + table.prop('outerHTML') + table2.prop('outerHTML') + cardCollapseMiddle + $(accordContent).prop('outerHTML') + cardCollapseEnd2;
                    $("#projetContent").append(res);
                }
                $(".collapsible").collapsible({accordion: false});
            }else
            {
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
            var cardStart = "<ul class='stage'><div class='row'>"+
                "<div class='col m12 s12 l12  push-s1 push-m2 push-l1'>"+ "<li>"+
                "<div class='card card-1'><div class='card-content'>"+
                "<div class='row'>";
            var cardEnd = "</div></div></div></li></div></div></ul>";
            var table;
            var tr;
            $('#usersContent').empty();
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
                table.append(tr);
                // for (var j = 0; j < json[i].users.length; j++) {
                //     tr = $('<tr/>');
                //     tr.append("<td>" + json[i].users[j].id + "</td>");
                //     tr.append("<td>" + json[i].users[j].name+ "</td>");
                //     tr.append("<td>" + json[i].users[j].surname + "</td>");
                //     $(table).append(tr);
                // }
                var res = cardStart + table.prop('outerHTML') + cardEnd;
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



