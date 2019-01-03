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
    $(".page-title").empty().append("Administration");

    $("#signInCheck").click(function(){
        if ( $("#signInCheck").is( ":checked" ) ){
            $("#signInNameDiv").show();
        } else {
            $("#signInNameDiv").hide();
        }
    });
    initPagination("/getAllUserPages", "allUserAdmin");

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
            waitOn();
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
                        //initAutoComplete(json);
                        turn($("#addUser"));
                        $("#usersContent").append(res);
                        // $("#usersAdderDiv").toggle("slide");
                        myToast("L'utilisateur a bien été ajouté");
                    }
                    waitOff();
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de l'utilisateur");
                    waitOff();
                }
            });
        }
    });
    initSelectCategorie();


    // $("#allUser").click(function () {
    //     initTabUser()
    // });
    //
    //
    // $("#allGroup").click(function () {
    //     initTabGroup()
    // });

    initTabGroup('allGroup');
    initTabUser('allUser', 1);

    $('.datepicker').datepicker({
        i18n : {
            months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            monthsShort: [ 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.' ],
            weekdays: [ 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi' ],
            weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            weekdaysAbbrev: [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],
            clear: 'Effacer',
            cancel: 'Annuler'
        },
        container: '#datepicker-container',
        firstDay: 1,
        format: 'dd mmm, yyyy',
        yearRange: [new Date().getFullYear(), new Date().getFullYear() + 20] // Creates a dropdown of 15 years to control year
    });


    $('#droit').change(function (e) {
        var val = $(this).val();
        if (val == 0) {
            $('#classeUser').val(0);
            $('#classeUser option').prop("disabled",true);
            $('#classeUser').formSelect();
        }
        else{
            $('#classeUser option:not(".remain")').removeAttr("disabled");
            $('#classeUser').formSelect();
        }
    });

    //fixedMailInput();


    $('#mainTabs').tabs({
        onShow: function () {
            initTabUser(this.id, 1);
            switch (this.id) {
                case 'allUser':
                    initPagination("/getAllUserPages",this.id+"Admin");
                    break;
                case 'part':
                    initPagination("/getPartPages",this.id+"Admin");
                    break;
                case 'pro':
                    initPagination("/getProsPages",this.id+"Admin");
                    break;
            }
            $(".scale-transition").addClass("scale-in");
        }
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
                        initTabGroup('allGroup');
                        initTabUser('allUser', 1);
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
            }
        });
    });

    $('#userTab').click();
    $('.collapsible').collapsible();
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


function initSelectCategorie() {
    var dataGroup = JSON.stringify({code : "TYPE_METIER"});
    $.ajax ({
        url: "/getByCode",
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if (!Array.isArray(json)) {
                json = [json];
            }
            $.each(json,function (index, elem) {
                var opt = $("<option />");
                opt.prop("value",elem.id);
                opt.text(elem.libelle);
                if (!$("#categoriePro option[value="+elem.id+"]").length ) {
                    $("#categoriePro").append(opt);
                }
            });
            $('select').formSelect();
        }
    });
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
                $("#projetContent").empty();
                $.each(res, function (index, element) {
                    $("#projetContent").append(element);
                });
            } else {
                $('#projetContent').empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#projetContent").append(res);
            }
            $('.collapsible').collapsible();
        }
    });
}

function initTabUser(tab , page) {
    var dataGroup = { 'page' : page };
    url = "/getAllUserByPage";
    switch (tab) {
        case 'allUser':
            url = "/getAllUserByPage";
            $("#usersContent").empty();
            break;
        case 'part':
            url = "/getAllParticulierByPage";
            $("#usersContent").empty();
            break;
        case 'pro':
            url = "/getAllProsByPage";
            $("#usersContent").empty();
            break;
    }
    dataGroup = JSON.stringify(dataGroup);
    $.ajax ({
        url: url,
        type: "POST",
        data: dataGroup,
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            //initAutoComplete(json);
            if ( json.length != 0 ) {
                users = jsonToGlobalArray(users, json);
                var res = userToTab(json);
                $("#usersContent").empty();
                $.each(res, function (index, element) {
                    $("#usersContent").append(element);
                });
            } else {
                $("#usersContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#usersContent").append(res);
            }
        }
    });
}



