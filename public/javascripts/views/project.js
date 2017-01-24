/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    $(".page-title").empty().append("Projets");

    data=null;

    $.ajax ({
        url: "/getGroupeProject",
        type: "GET",
        data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var obj = $.parseJSON(ret)

            $("#tableGrpProject").append(obj['html']);

        }
    });

    $.ajax ({
        url: "/getProjects",
        type: "GET",
        data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var obj = $.parseJSON(ret);

            $("#tableProject").append(obj['html']);

        }
    });

    var form = "<form id='formSign' class='col s12 blue-text'>"+
                    "<span class='card-title blue-text'>Nouveau Suivi Projet</span>"+
                    "    <div class='row'>"+
                        "    <div class='input-field col s12'>"+
                        "       <input type='date' class='datepicker'>"+
                        "    </div>"+
                    "    </div>"+
                        "<div class='row'>"+
                            "<div class='input-field col s12'>"+
                                 "<textarea id='textarea1' class='materialize-textarea' length='120'></textarea>"+
                                 "<label for='textarea1'>Textarea</label>"+
                            "</div>"+
                        "</div>"+
                    "<a id='sub' class='waves-effect waves-light btn' style='float: right;background: #00abff'>Valider</a>"+
                "</form>";
    $("#addSuivi").click(function () {
        $("#addSuiviDiv").empty().append(form);
        $("#addCard").slideToggle();
    });
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
});