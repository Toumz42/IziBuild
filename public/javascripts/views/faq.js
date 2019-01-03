/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    //initAutoComplete();
    initConversations();
    //initNewMessage();
    $("#addQuestion").click(function () {
        $("#questionDiv").show();
    });
});

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
    dataGroup = JSON.stringify(dataGroup);
    $.ajax({url : "/getAllByTypeId",
        type: "POST",
        data: JSON.stringify({
            "id": 1
        }),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success :function(data)
        {
            data = JSON.parse(data);
            $(".collapsible").empty();
            refFaqToCollapsible(data);
        },
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


function refFaqToCollapsible(json) {
    var table;
    var tr;
    var res = [];
    if (!Array.isArray(json)) {
        json = [json];
    }
    if (json.length > 0) {
        $.each(json, function (index, element) {
            tr = $('<li/>');
            tr.append("<div class='collapsible-header'><i class='material-icons'>help</i>" + element.libelle + "</div>");
            tr.append("<div class='collapsible-body'><span>" + element.commentaire + ".</span></div>");
            $(".collapsible").append(tr);
            //$("#messagerie").show();
            //$("#noProj").hide();
        });
    } else {
        tr = $('<li/>');
        tr.append("<div class='collapsible-header'><i class='material-icons'>help</i>Comment ajouter des éléments ? </div>");
        tr.append("<div class='collapsible-body'><span>Rendez-vous dans l'interface d'administration</span></div>");
        $(".collapsible").append(tr);
    }
    $(".collapsible").collapsible();
}