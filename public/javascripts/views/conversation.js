/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    var params = extractUrlParams();
    idUser = params.id;
    $(".page-title").empty().append("Messagerie");
    initConversation();
    initNewMessage();
    $("#addMsg").click(function () {
        $("#msgDiv").show();
    });
    $.ajax({
        url: "/getUserById",
        type: "POST",
        data: JSON.stringify({id : idUser}),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function (ret, textStatus, jqXHR) {
            var json = $.parseJSON(ret);
            $("#nameConvers").text(json.name +" "+ json.surname);
        }
    });
});


function initConversation() {
    waitOn();
    var dataGroup = {id: idUser};
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllMessageFromUserAndDestinataire",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if (json.length != 0) {
                // users = jsonToGlobalArray(users, json);
                usersToCards(json);
                $("#messagerie").empty();
                // initTab('userTab');
            } else {
                $("#messagerie").hide();
                $("#noProj").show();
            }
            waitOff();
        },
        error : function (xhr, ajaxOptions, thrownError) {
            myToast("Erreur dans la recuperation");
            waitOff();
        }
    });
}

function initNewMessage() {
    $("#subMsg").click(function () {
        var dataGroup = {
            id: idUser,
            message: $("#message").val(),
        };
        dataGroup = JSON.stringify(dataGroup);
        $.ajax({
            url: "/sendMessage",
            type: "POST",
            data: dataGroup,
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success: function (ret, textStatus, jqXHR) {
                initConversation();
                $("#message").val("");
            }
        });
    });
}


function usersToCards(json) {
    var table;
    var tr;

    var res = [];
    if (!Array.isArray(json)) {
        json = [json];
    }
    var expediteur = '';
    $("#conversation").empty();
    $.each(json,function (index, element) {
        var rightLeft = " grey msgRight";
        if (element.type === 'dest') {
            rightLeft = " indigo msgLeft";
            expediteur = element.message.expediteur.name + " " + element.message.expediteur.surname;
        }
        tr = $('<div class="col m6 s6 l6 card white-text msgCard '+ rightLeft+' "/>');
        tr.append("<img src='/assets/images/avatar/user.png' alt='' style='width: 50px;height: 50px' class='circle'>");
        tr.append("<p style='font-weight: 400;margin: 10px;' id='text'>"+element.message.message+"</p>");
        tr.append("<div id='date' class='msgDate'>"+element.message.date+"</div>");
        $("#conversation").append(tr);
        $("#conversation").show();
        $("#noProj").hide();

    });
    $("#nameConvers").text(expediteur);
    return res;
}