/**
 * Created by ttomc on 11/12/2016.
 */
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

    $("#subGroupe").click(function(){
        if ( ($("#groupeName").size()!=0))
        {

            var data = {"name" : $("#groupeName").val(),"theme" : $("#theme").val(),"date" : $("#date").val()};

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

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    Materialize.showStaggeredList($("#stage1"));

    var options = [ {selector: '#stage2', offset: 0, callback: function(el) { Materialize.showStaggeredList($(el)); } } ];
    Materialize.scrollFire(options);
    $('ul.tabs').tabs();

});