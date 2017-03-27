/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    $(".page-title").empty().append("Administration Notes");
    $.ajax ({
        url: "/getAllClasse",
        type: "GET",
        // data: JSON.stringify(data),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if (!Array.isArray(json)) {
                json = [json];
            }

            $.each(json, function (index, element) {
                $('#mainTabs').append("<li class='tab col s3'><a class='TabUser' id="+  element.id + ">"+ element.name+  "</a></li>");
                // $('#classeTabGroup').children().append("<li class='tab col s3'><a class='TabGroup' id= "+  element.id+ ">"+ json[i].name +  "</a></li>");
            });

        }
    });
});


