/**
 * Created by ttomc on 11/12/2016.
 */
var objDataComplete = {};
var groupids = [];

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


    $("#addUser").click(function () {
        $("#usersAdderDiv").toggle("slide");
    });

    $("#addClasse").click(function () {
        $("#classeAdderDiv").toggle("slide");
    });

    $("#addGroupe").click(function () {
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

    $(".tabGroup").click(function () {

    });

    $(".tabUser").click(function () {

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
            var json = $.parseJSON(ret);
            var cardStart = "<ul class='stage'><div class='row'>"+
                "<div class='col m12 s12 l12 push-s1 push-l2'>"+ "<li>"+
                "<div class='card card-1'><div class='card-content'>"+
                "<div class='row'>";
            var cardEnd = "</div></div></div></li></div></div></ul>";
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
                var res = cardStart + table.prop('outerHTML') + cardEnd;
                $("#projet").append(res);
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
                "<div class='col m12 s12 l12 push-s1 push-l2'>"+ "<li>"+
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
                $("#users").append(res);
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
                "<div class='col m12 s12 l12 push-s1 push-l2'>"+ "<li>"+
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
                // initTab('userTab');
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
    $('#mainTabs').tabs(/*{
        onShow: function () {
            initTab(this.id)
        }
    }*/);
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
    var dataGroup = {'classeId':classeId };
    $.ajax ({
        url: "/getAllGroupeProject",
        type: "POST",
        data: JSON.stringify(dataGroup),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            var cardStart = "<ul class='stage'><div class='row'>"+
                "<div class='col m12 s12 l12 push-s1 push-l2'>"+ "<li>"+
                "<div class='card card-1'><div class='card-content'>"+
                "<div class='row'>";
            var cardEnd = "</div></div></div></li></div></div></ul>";
            var table;
            var tr;
            $("#projet").empty();
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
                var res = cardStart + table.prop('outerHTML') + cardEnd;
                $("#projet").append(res);
            }
        }
    });
}

function initTabUser(classeId) {
    var dataUser = { 'classeId': classeId };
    $.ajax ({
        url: "/getAllUser",
        type: "POST",
        data: JSON.stringify(dataUser),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            var cardStart = "<ul class='stage'><div class='row'>"+
                "<div class='col m12 s12 l12 push-s1 push-l2'>"+ "<li>"+
                "<div class='card card-1'><div class='card-content'>"+
                "<div class='row'>";
            var cardEnd = "</div></div></div></li></div></div></ul>";
            var table;
            var tr;
            $("#users").empty();
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
                $("#users").append(res);
            }
        }
    });
}