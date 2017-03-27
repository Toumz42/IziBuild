/**
 * Created by ttomc on 23/03/2017.
 */
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