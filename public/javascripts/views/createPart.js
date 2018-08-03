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
    $(".page-title").empty().append("Créer un compte");

    $("#password1").focusout(function () {
        checkPass();
    });
    $("#password2").focusout(function () {
        checkPass2();
    });


    $("#sub").click(function(){
        if (check())
        {
            var url = "/addUser";
            var data = {
                "idUser" : $("#idUser").val(),
                "name" : $("#last_name").val(),
                "surname" : $("#first_name").val(),
                "email" : $("#email").val(),
                "type" : $("#type").val(),
                "password" :  $("#password1").val()};

            $.ajax ({
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function(ret, textStatus, jqXHR){
                    myToast("Votre Compte a bien été créé !");
                    myToast("Vous allez etre redirigé vers la page d'accueil !");
                    setTimeout(function() { window.location = "/home"; }, 1000);
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout de l'utilisateur");
                }
            });
        }
    });


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

    Materialize.showStaggeredList($("#stage1"));

    //fixedMailInput();

    var options = [ {selector: '#stage2', offset: 0, callback: function(el) { Materialize.showStaggeredList($(el)); } } ];
    Materialize.scrollFire(options);

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
    } else if ($("#password1").val() == "") {
        $("#password1").focus();
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





