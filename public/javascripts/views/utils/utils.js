/**
 * Created by ttomc on 23/03/2017.
 */

var imgEmptyDiv = "<div id='noData' class='valign-wrapper'>" +
    "<img class='center-align responsive-img noData imgHome' src='/assets/images/empty.png'/>" +
    "</div>"+
    "<div>" +
    "<div class='center-align red-text'> Désolé nous n'avons rien trouvé </div>" +
    "</div>";
var cardStart = "<ul class='stage'><div class='row'>"+
    "<div class='col push-s1 push-l1 push-m1 m12 s12 l12'>"+ "<li>"+
    "<div class='card card-1'><div class='card-content'>";

var cardStartcol = "<ul class='stage'><div class='row'>" +
    "<div class='col m12 s12 l12'>" + "<li>" +
    "<div class='card card-1'><div class='card-content'>";
var cardEnd = "</div></div></div></li></div></div></ul>";
var deleteIcon = "<i class='material-icons'>delete</i>";
var editIcon = "<i class='material-icons'>edit</i>";
var cardCollapseStart = '<ul class="stage">'+
    '<div class="row">'+
    '<div class="col m12 s12 l12 push-s1 push-l1 push-m1">'+
    '<li>'+
    '<ul class="card-2 collapsible" data-collapsible="accordion">'+
    '<li>'+
    '<div class="card-1 card card-content wrapped collapsible-header">'+
    '<div class="row">';
var cardCollapseMiddle = "</div></div>";
var cardCollapseEnd2 = "</li></ul></li></div></div></ul>";

function turn(selector) {
    var turned = selector.hasClass("rotate45");
    if (turned) {
        selector.addClass("unRotate");
        selector.removeClass("rotate45");
    } else {
        selector.addClass("rotate45");
        selector.removeClass("unRotate");
    }
}

function myToast(toastContent) {
    $toastContent = $("<span style='white-space: nowrap'>"+toastContent+"</span>");
    Materialize.toast($toastContent, 3000, 'rounded')
}
function emptyFields(array) {
    $.each(array,function () {
        $(""+this).val("");
    });
    $('select').material_select();
}
function find(array, id) {
    return $.grep(array, function(e){ return e.id == id; });
}
function jsonToGlobalArray(array, json) {
    if (!Array.isArray(json)) {
        if (array.indexOf(json) == -1) {
            array.push(json);
        }
    } else {
        array = json;
    }
    return array;
}

function modalize(el,parent,set) {
    if (set) {
        el.addClass("modal");
        $(".modal").modal(
            {
                startingTop: '25%',
                endingTop: '5%',
                complete: function() {
                    parent.hide();
                    var id = this.id;
                    switch (id) {
                        case "formGroupe":
                            emptyFields(grpFields);
                            emptyComplete(groupids);
                            break;
                        case "formSign":
                            emptyFields(userFields);
                            break;
                        case "formClasse":
                            emptyFields(classeFields);
                            break;
                        case "formAgenda":
                            emptyFields(agendaFields);
                            break;
                    }
                } // Callback for Modal close
            }
        );
        el.modal('open');
        parent.show();
    } else {
        el.modal('close');
        el.show();
    }
}
function activeFields(array) {
    $.each(array,function () {
        $(""+this).parent().children("label").addClass("active");
    });
}

function fixedMailInput() {
    var requiredText = '@ecole-isitech.fr';
    $('#email').val(requiredText);
    var trig = false;
    $('#email').on('click keyup paste',function(e) {
        $(this).attr('type','text');
        var index = String($(this).val()).indexOf(requiredText);
        if ( index == -1) {
            var input = $(this).val().replace("ecole-isitech.fr","").replace("@ecole-isitech.f","");
            $(this).val(input + requiredText);
            index = String($(this).val()).indexOf(requiredText);
        } else if ( index == 1) {
            var input = $(this).val().replace("@ecole-isitech.fr","");
            input = input.replace("@","")
            $(this).val(input + requiredText);
            index = String($(this).val()).indexOf(requiredText);
        }
        var inp = this;
        if (inp.selectionStart == $(inp).val().length ) {
            if (inp.createTextRange) {
                var part = inp.createTextRange();
                part.move("character", 0);
                part.select();
            } else if (inp.setSelectionRange) {
                inp.setSelectionRange(index, index);
            }
        } else {
            if (inp.createTextRange) {
                var part = inp.createTextRange();
                part.move("character", 0);
                part.select();
            } else if (inp.setSelectionRange) {
                inp.setSelectionRange(index, index);
            }
        }

        inp.focus();
    });
    $('#email').on('change',function(e) {
        $(this).attr('type','email');
    });
}
function extractUrlParams(){
    var t = location.search.substring(1).split('&');
    var f = [];
    for (var i=0; i<t.length; i++){
        var x = t[ i ].split('=');
        f[x[0]]=x[1];
    }
    return f;
}

function makePagination(json, func) {
    $(".pagination li:not(:first)").remove();
    maxPage = json;
    for (var j = 1 ; j <= json ; j++){
        if (j === 1) {
            li = $("<li class=\"pageli indigo active\"><a id='" + j + "'>" + j + "</a></li>");
        } else {
            li = $("<li class=\"pageli waves-effect\"><a  id='" + j + "'>" + j + "</a></li>");
        }
        $(".pagination").append(li);
        $("a#"+j).click(function () {
            jumpToPage(this, func);
        });
    }
    if (maxPage !== 1) {
        li = $("<li id=\"lastArrow\" class=\"waves-effect\"><a onclick='pageNext()'><i class=\"material-icons\">chevron_right</i></a></li>")
    }
    $(".pagination").append(li)
}

function pageNext() {
    jumpToPage(currentPage + 1)
}

function initPagination(url , type) {
    $.ajax ({
        url: url,
        type: "GET",
        //data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if ( json.length != 0 ) {
                makePagination(json, type);
            } else {
                $("#usersContent").empty();
            }
        }
    });
}

function jumpToPage(page, func) {
    currentPage = page;
    var pageNb = Number(page.id);
    switch (func) {
        case 'proRep':
            getPros(pageNb);
            break;
        case 'proAdmin':
            initTabUser('pro', pageNb);
            break;
        case 'partAdmin':
            initTabUser('part', pageNb);
            //getPartAdmin(pageNb);
            break;
        case 'allUserAdmin':
            initTabUser('allUser', pageNb);
            //getPartAdmin(pageNb);
            break;
    }
    $(".pageli.active").removeClass("indigo active").addClass("waves-effect");
    if (pageNb === 1) {
        $("#firstArrow").addClass("disabled");
        $("#lastArrow").removeClass("disabled");
    } else if (pageNb === maxPage) {
        $("#firstArrow").removeClass("disabled");
        $("#lastArrow").addClass("disabled");
    } else {
        $("#lastArrow").removeClass("disabled");
        $("#firstArrow").removeClass("disabled");
    }
    $(page).parent().addClass("indigo active").removeClass("waves-effect");
}