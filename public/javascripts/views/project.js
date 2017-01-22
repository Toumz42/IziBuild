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

            $("#tableProject").append(obj['html']);

        }
    });

});