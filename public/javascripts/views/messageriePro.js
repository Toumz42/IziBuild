/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    initAutoComplete();
    initConversations();
    initNewMessage();
    $("#addMsg").click(function () {
        $("#msgDiv").show();
    });
});

function initNavbar() {
    $(".nav-wrapper").append(" <div class='nav-content'>\n" +
        "      <span class='nav-title'>Messagerie</span>\n" +
        "      <a class='btn-floating btn-large halfway-fab waves-effect waves-light indigo'>" +
        "        <i class='material-icons'>add</i>" +
        "      </a>" +
        "    </div>")

}
function initAutoComplete() {
    var json;
    var dataGroup = JSON.stringify({});
    $.ajax({
        url: "/getAllUser",
        type: "GET",
        // data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function (ret, textStatus, jqXHR) {
            json = $.parseJSON(ret);
            var reset = true;
            if (!Array.isArray(json)) {
                json = [json];
                reset = false;
            }
            if (reset) {
                arrayData = [];
            }
            for (var i = 0; i < json.length; i++) {
                var objDataComplete = {
                    "id": json[i].id,
                    "text": json[i].name + " " + json[i].surname,
                };
                if (arrayData.indexOf(objDataComplete) == -1) {
                    arrayData.push(objDataComplete);
                }
            }
            var single = $('#singleInput').materialize_autocomplete({
                multiple: {
                    enable: false
                },
                dropdown: {
                    el: '#singleDropdown',
                    itemTemplate: '<li class="ac-item" data-id="<%= item.id %>" data-text=\'<%= item.text %>\'><a href="javascript:void(0)"><%= item.text %></a></li>'
                },
                onSelect: function (item) {
                    $("#destId").val(item.id);
                },
                getData: function (value, callback) {
                    callback(value, arrayData);
                }
            });
        }
    });
}

function initConversations() {
    var dataGroup={};
    waitOn();
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllConversations",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if (json.length != 0) {
                // users = jsonToGlobalArray(users, json);
                usersToCollections(json);
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
    $("#sendMessage").click(function () {
        var dataGroup = {
            id: $("#destId").val(),
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
                initConversations();
            }
        });
    });
}


function usersToCollections(json) {
    var table;
    var tr;
    var res = [];
    if (!Array.isArray(json)) {
        json = [json];
    }
    $.each(json,function (index, element) {
        tr = $('<li class="collection-item avatar" />');
        tr.append("<input type='hidden' class='idUser' value='" + element.id + "'>");
        var img = element.droit === 1 ? 'worker' : 'user';
        tr.append("<img src='/assets/images/avatar/"+img+".png' alt='' class='circle'>");
        tr.append("<span style='font-weight: bold' class='title'>" + element.name +" "+ element.surname + "</span>");
        tr.append("<p style='font-weight: 400' id='info"+element.id+"'><span class='lastMsg'> </span><br><span class='lastMsgDate'> </span> </p>");
        var dataGroup={ id : element.id};
        dataGroup = JSON.stringify(dataGroup);
        waitOn();
        $.ajax ({
            url: "/getLastMessageFromUserAndDestinataire",
            type: "POST",
            data: dataGroup,
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success: function(ret, textStatus, jqXHR){
                var json = $.parseJSON(ret);
                if ( json.length != 0 ) {
                    // users = jsonToGlobalArray(users, json);
                    if (json.type === 'exp') {
                        $("#info" + json.message.destinataire.id + " .lastMsg").text(json.message.message);
                        $("#info" + json.message.destinataire.id + " .lastMsgDate").text(json.message.date);
                    }
                    if (json.type === 'dest') {
                        $("#info" + json.message.expediteur.id + " .lastMsg").text(json.message.message);
                        $("#info" + json.message.expediteur.id+" .lastMsgDate").text(json.message.date)
                    }
                    // initTab('userTab');

                }
                waitOff();
            },
            error : function (xhr, ajaxOptions, thrownError) {
                myToast("Erreur dans la recuperation");
                waitOff();
            }
        });
        tr.append("<div class='open-conversation secondary-content' style='cursor:pointer' id='"+element.id+"'><i class='material-icons'>send</i></div>");
        if ($("#messagerie .collection").length > 0) {
            $("#messagerie .collection").append(tr);
            $("#noProj").hide();
            $("#messagerie").show();
        } else {
            if (element.id == 1) {
                $("#incidents .collection").append(tr);
                $("#noProj").hide();
                $("#incidents").show();
            }
        }
        $(".open-conversation").click(function () {
            window.location.href = "/conversation?id=" + this.id;
        });

    });

    return res;
}