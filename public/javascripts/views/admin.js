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
    $(".page-title").empty().append("Administration Projet");

    $("#signInCheck").click(function(){
        if ( $("#signInCheck").is( ":checked" ) ){
            $("#signInNameDiv").show();
        } else {
            $("#signInNameDiv").hide();
        }
    });


    $("#password1").focusout(function () {
        checkPass();
    });
    $("#password2").focusout(function () {
        checkPass2();
    });

    $(".addButton").click(function () {
        turn($(this));
        switch (this.id) {
            case "addUser":
                modalize($("#formSign"),$("#usersAdderDiv"),false);
                $("#usersAdderDiv").toggle("slide");
                break;
            case "addClasse":
                modalize($("#formClasse"),$("#classeAdderDiv"),false);
                $("#classeAdderDiv").toggle("slide");
                break;
            case "addGroupe":
                modalize($("#formGroupe"),$("#projetAdderDiv"),false);
                $("#projetAdderDiv").toggle("slide");
                break;
        }
    });

    $("#sub").click(function(){
        if (check())
        {
            var url = "/addUser";
            var update = $("#idUser").val() != "";
            if (update) {
                url  = "/updateUser"
            }
            var data = {
                "idUser" : $("#idUser").val(),
                "name" : $("#last_name").val(),
                "surname" : $("#first_name").val(),
                "email" : $("#email").val(),
                "droit" : $("#droit").val(),
                "classe" : $("#classeUser").val(),
                "password" :  $("#password1").val()};

            $.ajax ({
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    $("#usersAdderDiv").toggle("slide");
                    var json = $.parseJSON(ret);
                    var res = userToTab(json);
                    users = jsonToGlobalArray(users, json);
                    if ($("#usersContent").find("#noData").length) {
                        $("#usersContent").empty();
                    }
                    emptyFields(userFields);
                    if (update) {
                        var ids = $("#usersContent").find(".idUser");
                        if (ids.length) {
                            $.each(ids, function (index, el) {
                                $.each(res, function (index, element) {
                                    if ($(el).val() == $(element).find(".idUser").val()) {
                                        $(el).parents("ul.stage").remove();
                                        $("#usersContent").append(element);
                                    }
                                });
                            });
                        } else {
                            $("#usersContent").append(res);
                        }
                        myToast("L'utilisateur a bien été mis à jour");
                    } else{
                        initAutoComplete(json);
                        turn($("#addUser"));
                        $("#usersContent").append(res);
                        // $("#usersAdderDiv").toggle("slide");
                        myToast("L'utilisateur a bien été ajouté");
                    }
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de l'utilisateur");
                }
            });
        }
    });

    $("#subClasse").click(function(){
        if ( ($("#classeName").size()!=0))
        {
            var url = "/addClasse";
            var update = $("#idClasse").val() != "";
            if (update) {
                url  = "/updateClasse"
            }
            var data = {
                "idClasse" : $("#idClasse").val(),
                "name" : $("#classeName").val()
            };
            data = JSON.stringify(data);
            $.ajax ({
                url: url,
                type: "POST",
                data: data,
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    var json = $.parseJSON(ret);
                    var res = classeToTab(json);
                    classes = jsonToGlobalArray(classes, json);
                    if ($("#classeContent").find("#noData").length) {
                        $("#classeContent").empty();
                    }
                    emptyFields(classeFields);
                    if (update) {
                        var ids = $("#classeContent").find(".idClasse");
                        if (ids.length) {
                            $.each(ids, function (index, el) {
                                $.each(res, function (index, element) {
                                    if ($(el).val() == $(element).find(".idClasse").val()) {
                                        $(el).parents("ul.stage").remove();
                                        $("#classeContent").append(element);
                                    }
                                });
                            });
                        }else {
                            $("#classeContent").append(res);
                        }
                        myToast("La classe a bien été mise à jour");
                    } else{
                        $("#classeContent").append(res);
                        turn($("#addClasse"));
                        initSelectClasse(json);
                        // $("#classeAdderDiv").toggle("slide");
                        myToast("La classe a bien été ajouté");
                    }
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de la classe");
                }
            });
        }
    });



    $("#subGroupe").click(function(){
        if ( ($("#groupeName").val()!=""))
        {
            var url = "/addProjectGroup";
            var update =  $("#idGroupe").val() != "";
            if (update) {
                url  = "/updateProjectGroup";
                if (groupids) {

                }
            }
            var data = {
                "idGroup" : $("#idGroupe").val(),
                "theme": $("#theme").val(),
                "date" : $("#date").val(),
                "groupids" : groupids
            };
            $.ajax ({
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    var res;
                    var json = $.parseJSON(ret);
                    res = groupeToTab(json);
                    groupes = jsonToGlobalArray(groupes, json);
                    if ($("#projetContent").find("#noData").length) {
                        $("#projetContent").empty();
                    }
                    emptyFields(grpFields);
                    emptyComplete(groupids);
                    if (update) {
                        var ids = $("#projetContent").find(".idGroupe");
                        if (ids.length) {
                            $.each(ids, function (index, el) {
                                $.each(res, function (index, element) {
                                    if ($(el).val() == $(element).find(".idGroupe").val()) {
                                        $(el).parents("ul.stage").remove();
                                        $("#projetContent").append(element);
                                    }
                                });
                            });
                        } else {
                            $("#projetContent").append(res);
                        }
                        myToast("Le groupe a bien été mis à jour");
                    } else {
                        $("#projetContent").append(res);
                        turn($("#addGroupe"));
                        // $("#projetAdderDiv").toggle("slide");
                        myToast("Le groupe de projet a bien été ajouté");
                    }
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout du groupe de projet");
                }
            });
        }
    });

    // $("#allUser").click(function () {
    //     initTabUser()
    // });
    //
    //
    // $("#allGroup").click(function () {
    //     initTabGroup()
    // });

    initTabClasse();
    initTabGroup('allGroup');
    initTabUser('allUser');

    $('.datepicker').pickadate({
        monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthsShort: [ 'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec' ],
        weekdaysFull: [ 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi' ],
        weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        weekdaysLetter: [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],

        labelMonthNext: 'Mois suivant',
        labelMonthPrev: 'Mois precédent',
        labelMonthSelect: 'Selection mois',
        labelYearSelect: 'Selection année',
        container: '#datepicker-container',

        today: 'Auj',
        clear: 'Effacer',
        close: 'Fermer',
        firstDay: true,
        formatSubmit: 'yyyy-mm-dd',
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    $('#droit').change(function (e) {
        var val = $(this).val();
        if (val == 0) {
            $('#classeUser').val(0);
            $('#classeUser option').prop("disabled",true);
            $('#classeUser').material_select();
        }
        else{
            $('#classeUser option:not(".remain")').removeAttr("disabled");
            $('#classeUser').material_select();
        }
    });
    Materialize.showStaggeredList($("#stage1"));

    fixedMailInput();

    var options = [ {selector: '#stage2', offset: 0, callback: function(el) { Materialize.showStaggeredList($(el)); } } ];
    Materialize.scrollFire(options);
    $('#mainTabs').tabs({
        onShow: function () {
            $(".scale-transition").addClass("scale-in");
        }
    });

    $('#mainTabs').click(function (e) {
        initTab(e.target.id);
    });
    $(document).ajaxStop(function(event,request,settings){
        $(".delete").click(function () {
            var self = $(this);
            var id = this.id;
            var type = self.attr("type");
            var data = {
                "type" : type,
                "id" : id
            };
            if (confirm("Voulez-vous supprimer ?")){
            $.ajax ({
                url: "/delete",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    var json = $.parseJSON(ret);
                    initTabClasse();
                    initTabGroup('allGroup');
                    initTabUser('allUser');
                    if ( json ) {
                        self.closest("ul").remove();
                        myToast("La suppression a bien été effectuée");
                    }
                }
            });}
        });

        $(".edit").click(function () {
            var self = $(this);
            var id = this.id;
            var type = $(this).attr("type");
            switch (type) {
                case "user" :
                    modalize($('#formSign'),$('#usersAdderDiv'),true);
                    var user = find(users,id);
                    fillEditFormUser(user,id);
                    break;
                case "classe" :
                    modalize($('#formClasse'),$('#classeAdderDiv'),true);
                    var classe = find(classes,id);
                    fillEditFormClasse(classe,id);
                    break;
                case "groupe" :
                    modalize($('#formGroupe'),$('#projetAdderDiv'),true);
                    var groupe = find(groupes,id);
                    fillEditFormGroupe(groupe,id);
                    break;
            }
        });
    });

    $('#userTab').click();
});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function check() {

    if ($("#email").val() == "" || !validateEmail($("#email").val())) {
        $("#email").addClass("invalid");
        myToast("Merci d'ajouter un email valide");
        return false;
    } else
    {
        $("#email").addClass("valid");
        if (checkPass()) {
            myToast("Merci d'ajouter un Mot de passe");
            return false;
        }
        else if ($("#droit").val() == "") {
            myToast("Merci d'ajouter un type de Profil");
            return false;
        }
        else if ($("#classeUser").val() == "") {
            myToast("Merci d'ajouter une Classe");
            return false;
        }
        else if ($("#first_name").val() == "") {
            myToast("Merci d'ajouter un Prenom");
            return false;
        }
        else if ($("#last_name").val() == "") {
            myToast("Merci d'ajouter un Nom");
            return false;
        }
    }
    return true
}
function checkGroupe() {

    if ($("#theme").val() == "") {
        myToast("Merci d'ajouter un Theme au Groupe");
        return false;
    }
    else if ($("#date").val() == "") {
        myToast("Merci d'ajouter une date d'oral");
        return false;
    }
    else if (groupids == [] ) {
        myToast("Merci d'ajouter des élèves");
        return false;
    }
    return true
}
function checkPass2()
{
    if ($("#password2").val() != "") {
        if ($("#password1").val() == $("#password2").val()) {
            $("#password2").addClass("valid");
            $("#password2").removeClass("invalid");
            return true;
        }
        else {
            $("#password2").removeClass("valid");
            $("#password2").addClass("invalid");
            $("#password2").focus();
        }
    } else {
        $("#password2").removeClass("invalid");
        $("#password2").focus();
    }
    return false;
}
function checkPass()
{
    if ($("#password1").val() != "") {
        if ($("#password1").val().length < 6){
            myToast("Minimum 6 caractères!");
            $("#password1").removeClass("valid");
            $("#password1").addClass("invalid");
            $("#password1").focus();
        }
    }
    return false;
}

function initAutoComplete(json) {
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
            enable: true,
            onAppend: function (item) {
                pushToGroup(item.id);
            },
            onRemove: function (item) {
                removeFromGroup(item.id);
            }
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


function initSelectClasse(json) {
    var reset=true;
    if (!Array.isArray(json)) {
        json = [json];
        reset = false;
    }
    if (reset) {
        $('#classeUser :not(.remain)').remove();
    }
    $.each(json,function (index, elem) {
        var opt = $("<option />");
        opt.prop("value",elem.id);
        opt.text(elem.name);
        if (!$("#classeUser option[value="+elem.id+"]").length ) {
            $("#classeUser").append(opt);
        }
    });
    $('select').material_select();

}

function pushToGroup(item) {
    groupids.push(item)
}

function removeFromGroup(item){
    var i = groupids.indexOf(item);
    if (i > -1) {
        groupids.splice(i, 1);
    }
}
function initTab(tabName) {
    if (tabName == 'userTab') {
        $("#classeTabUser").show();
        $("#classeTabGroup").hide();
        $("#classeTabUser").children().removeAttr("style");
        $("#classeTabUser").children().tabs({
            onShow: function () {
                initTabUser(this.id);
            }
        });
    }
    if (tabName == 'projTab') {
        $("#classeTabGroup").show();
        $("#classeTabUser").hide();
        $("#classeTabGroup").children().removeAttr("style");
        $("#classeTabGroup").children().tabs({
            onShow: function () {
                initTabGroup(this.id);
            }
        });
    }
    if (tabName == 'classeTab') {
        $("#classeTabUser").hide();
        $("#classeTabGroup").hide();

    }
}



function initTabClasse() {
    $.ajax ({
        url: "/getAllClasse",
        type: "POST",
        data: JSON.stringify({}),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            initSelectClasse(json);
            if ( json.length != 0 ) {
                classes = jsonToGlobalArray(classes, json);
                var res = classeToTab(json);
                // if ($("#classeContent").find("#noData").length) {
                    $("#classeContent").empty();
                // }
                // var ids = $("#classeContent").find(".idClasse");
                // if (ids.length) {
                //     $.each(ids, function (index, el) {
                        $.each(res, function (index, element) {
                            // if ($(el).val() == $(element).find(".idClasse").val()) {
                            //     $(el).parents("ul.stage").remove();
                                $("#classeContent").append(element);
                        //     } else {
                        //         $(el).parents("ul.stage").remove();
                        //     }
                        // });
                    });
                // }else {
                //     $("#classeContent").append(res);
                // }
            } else {
                $("#classeContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#classeContent").append(res);
            }
        }
    });
}

function initTabGroup(classeId) {
    var dataGroup = { 'classeId' : classeId };
    if (classeId == 'allGroup') {
        dataGroup={};
        $('#projetContent').empty();
    }
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllGroupeProject",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var res;
            var json = $.parseJSON(ret);
            if ( json.length != 0 ) {
                groupes = jsonToGlobalArray(groupes, json);
                res = groupeToTab(json);
                // if ($("#projetContent").find("#noData").length
                //|| $("#projetContent").find(".idGroupe").val()) {
                    $("#projetContent").empty();
                // }
                // var ids = $("#projetContent").find(".idGroupe");
                // if (ids.length) {
                //     $.each(ids, function (index, el) {
                        $.each(res, function (index, element) {
                            // if ($(el).val() == $(element).find(".idGroupe").val()) {
                            //     $(el).parents("ul.stage").remove();
                                $("#projetContent").append(element);
                            // } else {
                            //     $(el).parents("ul.stage").remove();
                            // }
                        });
                    // });
                // } else {
                //     $("#projetContent").append(res);
                // }
            } else
            {
                $('#projetContent').empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#projetContent").append(res);
            }
        }
    });
}

function initTabUser(classeId) {
    var dataGroup = { 'classeId' : classeId };
    if (classeId == 'allUser') {
        dataGroup={};
        $("#usersContent").empty();
    }
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: "/getAllUser",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            initAutoComplete(json);
            if ( json.length != 0 ) {
                users = jsonToGlobalArray(users, json);
                var res = userToTab(json);
                // initTab('userTab');
                // if ($("#usersContent").find("#noData").length) {
                    $("#usersContent").empty();
                // }
                // var ids = $("#usersContent").find(".idUser");
                // if (ids.length) {
                //     $.each(ids, function (index, el) {
                        $.each(res, function (index, element) {
                //             if ($(el).val() == $(element).find(".idUser").val()) {
                //                 $(el).parents("ul.stage").remove();
                                $("#usersContent").append(element);
                //             } else {
                //                 $(el).parents("ul.stage").remove();
                //             }
                        });
                //     });
                // } else {
                //     $("#usersContent").append(res);
                // }
            } else {
                $("#usersContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#usersContent").append(res);
            }
        }
    });
}



