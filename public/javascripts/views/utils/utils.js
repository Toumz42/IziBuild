/**
 * Created by ttomc on 23/03/2017.
 */

var imgEmptyDiv = "<div id='noData' class='valign-wrapper'>" +
    "<img class='center-align responsive-img noData imgHome' src='/assets/images/empty.png'/>" +
    "</div>"+
    "<div>" +
    "<div class='center-align blue-text'> Désolé nous n'avons rien trouvé </div>" +
    "</div>";
var cardStart = "<ul class='stage'><div class='row'>"+
    "<div class='col push-s1 push-l1 push-m1 m12 s12 l12'>"+ "<li>"+
    "<div class='card card-1'><div class='card-content'>"+
    "<div class='row'>";

var cardStartcol = "<ul class='stage'><div class='row'>"+
    "<div class='col m12 s12 l12'>"+ "<li>"+
    "<div class='card card-1'><div class='card-content'>"+
    "<div class='row'>";
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
    var childs = parent.find('*');
    if (set) {
        el.addClass("modal col l7");
        $(".modal").modal(
            {
                startingTop: '25%',
                endingTop: '25%',
                complete: function() {
                    parent.hide();
                    var id = this[0].id;
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
                    alert('Closed');
                } // Callback for Modal close
            }
        );

        $.each(childs,function () {
            self = $(this);
            if (self.is("form")) {
                return false;
            } else if (self.is(".card-content")) {
                self.removeClass("card-content");
                self.addClass("card-content-bak");
            } else {
                self.css("height", "0");
            }
        });
        el.modal('open');
        parent.show();
    } else {
        el.removeClass("modal col l7");
        el.removeAttr('style');
        $.each(childs,function () {
            self = $(this);
            if (self.is("form")) {
                return false;
            } else if (self.is(".card-content-bak")) {
                self.removeClass("card-content-bak");
                self.addClass("card-content");
            } else {
                self.css("height", "");
            }
        });
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
    $('#email').on('click input keypress paste',function(e) {
        $(this).attr('type','text');
        var index = String($(this).val()).indexOf(requiredText);
        if ( index == -1) {
            var input = $(this).val().replace("ecole-isitech.fr","").replace("@ecole-isitech.f","");
            $(this).val(input + requiredText);
            index = String($(this).val()).indexOf(requiredText);
        } else if ( index == 1) {
            var input = $(this).val().replace("@ecole-isitech.fr","");
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
        }

        inp.focus();
    });
    $('#email').on('change',function(e) {
        $(this).attr('type','email');
    });
}