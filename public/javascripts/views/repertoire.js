/**
 * Created by ttomc on 11/12/2016.
 */
var groupids = [];
var arrayData = [];
var classes = [];
var groupes = [];
var users = [];
var autocomplete;
$(function()
{
    currentPage = 1;
    $(".page-title").empty().append("Répertoire");
    initPagination("/getProsPages", "proRep");
    getPros(currentPage);
    $('#userTab').click();
});

function initAutoComplete(json) {
    if (!Array.isArray(json)) {
        json = [json];
        reset = false;
    }
    for (var i = 0; i < json.length; i++) {
        var objDataComplete = {
            "id" : json[i].id,
            "text": json[i].name + " " + json[i].surname
        };
        if (arrayData.indexOf(objDataComplete) == -1) {
            arrayData.push(objDataComplete);
        }
    }
    autocomplete = $('#multipleInput').materialize_autocomplete({
        // data: objDataComplete,
        multiple: {
            enable: false,
        },
        appender: {
            el: '.ac-users'
        },
        dropdown: {
            el: '#multipleDropdown',
            itemTemplate: '<li class="ac-item autocomplete-content" data-id="<%= item.id %>" data-text=\'<%= item.text %>\'><a href="javascript:void(0)"><%= item.text %></a></li>'
        },
        getData: function (value, callback) {
            callback(value, arrayData);
        }
    });
}

function getPros(page) {

    dataGroup={page : page};

    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllProsByPage",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            initAutoComplete(json);
            if ( json.length != 0 ) {
                users = jsonToGlobalArray(users, json);
                $(".collection").empty();
                usersToCollections(json)
            } else {
                $(".collection").empty();
            }
        }
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
        tr.append("<img src='/assets/images/avatar/worker.png' alt='' class='circle'>");
        tr.append("<span style='font-weight: bold' class='title'>" + element.name +" "+ element.surname + "</span>");
        tr.append("<p style='font-weight: 400' id='info"+element.id+"'>"+element.categorie.libelle+"<br></p>");
        tr.append("<div class='open-conversation secondary-content' style='cursor:pointer' id='"+element.id+"'><i class='material-icons'>send</i></div>");
        $(".collection").append(tr);
        $(".open-conversation").click(function () {
            window.location.href = "/conversation?id=" + this.id;
        });
        $("#messagerie").show();
        $("#noProj").hide();

    });

    return res;
}

