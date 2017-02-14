/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    $(".page-title").empty().append("Projets");
    var cardStart = "<ul class='stage'><div class='row'>"+
        "<div class='col m12 s12 l12 push-s1 push-l2'>"+ "<li>"+
        "<div class='card card-1'><div class='card-content'>"+
        "<div class='row'>";
    var cardEnd = "</div></div></div></li></div></div></ul>";
    data=null;

    $.ajax ({
        url: "/getGroupeProject",
        type: "GET",
        // data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            var table;
            var tr;
            for (var i = 0; i < json.length; i++) {
                table = $("<table class='responsive-table highlight'></table>");
                table2 = $("<table class='responsive-table highlight'></table>");
                tr = $('<tr/>');
                tr.append("<th>Id</th>");
                tr.append("<th> Theme </th>");
                tr.append("<th>Date de soutenance</th>");
                table.append(tr);
                tr = $('<tr/>');
                tr.append("<td>" + json[i].id + "</td>");
                tr.append("<td>" + json[i].theme + "</td>");
                tr.append("<td>" + json[i].date + "</td>");
                table.append(tr);
                tr = $('<tr/>');
                tr.append("<th>Id</th>");
                tr.append("<th> Nom </th>");
                tr.append("<th>Prénom</th>");
                table2.append(tr);
                for (var j = 0; j < json[i].users.length; j++) {
                    tr = $('<tr/>');
                    tr.append("<td>" + json[i].users[j].id + "</td>");
                    tr.append("<td>" + json[i].users[j].name+ "</td>");
                    tr.append("<td>" + json[i].users[j].surname + "</td>");
                    table2.append(tr);
                }
                res = table.prop('outerHTML');
                res2 = table2.prop('outerHTML');
            }
            $("#tableGrpProjectDiv").append(res);
            $("#tableGrpProjectDiv").append(res2);

        }
    });
    var res = null;
    $.ajax ({
        url: "/getProjects",
        type: "GET",
        data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            var table;
            var tr;
            for (var i = 0; i < json.length; i++) {
                table = $("<table class='responsive-table highlight'></table>");
                table2 = $("<table class='responsive-table highlight'></table>");
                tr = $('<tr/>');
                tr.append("<th>Id</th>");
                tr.append("<th> Theme </th>");
                tr.append("<th>Date de soutenance</th>");
                table.append(tr);
                tr = $('<tr/>');
                tr.append("<td>" + json[i].id + "</td>");
                tr.append("<td>" + json[i].dateSuivi + "</td>");
                tr.append("<td>" + json[i].contenu + "</td>");
                table.append(tr);
                // for (var j = 0; j < json[i].users.length; j++) {
                //     tr = $('<tr/>');
                //     tr.append("<td>" + json[i].users[j].id + "</td>");
                //     tr.append("<td>" + json[i].users[j].name+ "</td>");
                //     tr.append("<td>" + json[i].users[j].surname + "</td>");
                //     table2.append(tr);
                // }
                var res = cardStart + table.prop('outerHTML') + cardEnd;
            }
            $("#projectMainDiv").append(res);

        }
    });

    $("#addSuivi").click(function () {
        $("#addCard").slideToggle();
    });

    $("#subSuivi").click(function(){
        if ( $("#contenuSuivi").size()!="" && $("#dateSuivi").val()!="" )
        {
            var data = {"date" : $("#dateSuivi").val(),"contenu" : $("#contenuSuivi").val()};

            $.ajax ({
                url: "/addProject",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    $("#addCard").slideToggle();

                    var json = $.parseJSON(ret);

                    var table;
                    var tr;
                    for (var i = 0; i < json.length; i++) {
                        table = $("<table class='responsive-table highlight'></table>");
                        tr = $('<tr/>');
                        tr.append("<th>Id</th>");
                        tr.append("<th>Date du suivi</th>");
                        tr.append("<th> Theme </th>");
                        table.append(tr);
                        tr = $('<tr/>');
                        tr.append("<td>" + json[i].id + "</td>");
                        tr.append("<td>" + json[i].theme + "</td>");
                        tr.append("<td>" + json[i].date + "</td>");
                        table.append(tr);
                        var res = cardStart + table.prop('outerHTML') + cardEnd;
                    }
                    $("#projectMainDiv").append(res);
                }
            });
        }
    });

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
});