/**
 * Created by ttomc on 11/12/2016.
 */
var groupids = [];
var arrayData = [];
var classes = [];
var groupes = [];
var projects = [];
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
    initPagination("/getProjectPages", "allUserAdmin");

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
    var users;
    $.ajax({
        url: "/getAllPros",
        type: "GET",
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR) {
            users = ret;
        }
    });

    $("#sub").click(function(){
        if (check())
        {
            waitOn();
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
                    projects = jsonToGlobalArray(projects, json);
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
                        waitOff();
                        myToast("L'utilisateur a bien été mis à jour");
                    } else{
                        initAutoComplete(json);
                        turn($("#addUser"));
                        $("#usersContent").append(res);
                        // $("#usersAdderDiv").toggle("slide");
                        waitOff();
                        myToast("L'utilisateur a bien été ajouté");
                    }
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    waitOff();
                    myToast("Erreur dans l'ajout de l'utilisateur");
                }
            });
        }
    });
    initSelectCategorie();


    $("#subGroupe").click(function(){
        if ( ($("#groupeName").val()!=""))
        {
            waitOn();
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
                    waitOff();
                },
                error : function (xhr, ajaxOptions, thrownError) {
                    myToast("Erreur dans l'ajout du groupe de projet");
                    waitOff();
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
            var id = parseInt(this.id);
            var type = self.attr("type");
            var data = {
                "type" : type,
                "id" : id
            };
            if (confirm("Voulez-vous supprimer ?")){
                waitOn();
                $.ajax ({
                    url: "/delete",
                    type: "POST",
                    data: JSON.stringify(data),
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                    success: function(ret, textStatus, jqXHR){
                        var json = $.parseJSON(ret);
                        initTabUser('allUser', 1);
                        if ( json ) {
                            self.closest("ul").remove();
                            myToast("La suppression a bien été effectuée");
                        }
                        waitOff();
                    },
                    error : function (xhr, ajaxOptions, thrownError) {
                        myToast("Erreur dans la recuperation");
                        waitOff();
                    }
                });}
        });

        $(".edit").click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = $(this);
            var id = this.id;
            var type = $(this).attr("type");
            modalize($('#formGroupe'),$('#projetAdderDiv'),true);
            var project = find(projects,id);
            fillEditFormProject(project,id);
        });
        initMaterial();
        initValidProj();
    });
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

function initAutoComplete(json, isPros) {
    var reset = true;
    if (!Array.isArray(json)) {
        console.log(json)
        json = [json];
        reset = false;
    }
    if(isPros){
        json = $.parseJSON(json);
    }
    if (reset) {
        var arrayData = [];
    }
    for (var i = 0; i < json.length; i++) {
        console.log(i, json[i])
        var objDataComplete = {
            "id": json[i].id,
            "text": json[i].name + " " + json[i].surname
        };
        if(arrayData !== undefined){
            if (arrayData.indexOf(objDataComplete) === -1) {
                arrayData.push(objDataComplete);
            }
        }
    }
    console.log(objDataComplete)
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
    waitOn();
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
            waitOff();
        },
        error : function (xhr, ajaxOptions, thrownError) {
            myToast("Erreur dans la recuperation");
            waitOff();
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



function initTabUser(tab , page) {
    var dataGroup = { 'page' : page };
    url = "/getAllProjectByPage";
    switch (tab) {
        case 'allUser':
            url = "/getAllProjectByPage";
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
            initAutoComplete(json);
            if ( json.length != 0 ) {
                $('.empty-projects').hide();
                projects = jsonToGlobalArray(projects, json);
                makeProjectDiv(json);
            } else {
                $("#usersContent").empty();
                res = cardStart + imgEmptyDiv + cardEnd;
                $("#usersContent").append(res);
                $('.empty-projects').show();
            }
        }
    });
}



function makeProjectDiv(json) {
    if (json.length > 0) {
        var table;
        var tr;
        for (var i = 0; i < json.length; i++) {
            var projId = json[i].id;
            var accordContent= $("<div class='collapsible-body card card-1' data-projId='"+projId+"' id='suiviProjDiv"+projId+"'></div>");
            var divTaskEmpty= $("<div class='divTaskEmpty'></div>");
            var emptyTaskImg= $("<img class='imgTaskEmpty' src='/assets/images/worker.png'/>");
            var emptyTaskTxt= $("<div class='txtTaskEmpty'>Vous n'avez aucune tâche sur le projet en cours. Créez votre première tache en cliquant ci dessous !</div>");
            divTaskEmpty.append(emptyTaskImg).append(emptyTaskTxt);
            accordContent.append(divTaskEmpty);
            table = $("<table class='responsive-table '></table>");
            var table2 = $("<table class='responsive-table '></table>");
            var table3 = $("<table class='responsive-table  taskTable'></table>");
            var table4 = $("<table class='responsive-table  hide addTaskTable'></table>");
            tr = $('<tr/>');
            tr.append("<th style='width: 25%;color:black;'>Projet</th>");
            tr.append("<th> Theme </th>");
            tr.append("<th>Date</th>");
            tr.append("<th></th>");
            table.append(tr);
            tr = $('<tr/>');
            tr.append("<td>&nbsp;<span style='display: none'>"+projId+"</span></td>");
            tr.append("<td>" + json[i].theme + "</td>");
            tr.append("<td>" + json[i].dateString + "</td>");
            tr.append("<td></td>");
            table.append(tr);
            tr = $('<tr/>');
            tr.append("<th style='width: 25%;color:black;'>Artisans</th>");
            tr.append("<th> Nom </th>");
            tr.append("<th>Prénom</th>");
            tr.append("<th>Metier</th>");
            if(json[i].proList.length > 0){
                table2.append(tr);
            }
            for (var j = 0; j < json[i].proList.length; j++) {
                tr = $('<tr/>');
                tr.append("<td>&nbsp;<span style='display: none'>"+json[i].user.id+"</span></td>");
                tr.append("<td>" + json[i].proList[j].name + "</td>");
                tr.append("<td>" + json[i].proList[j].surname + "</td>");
                tr.append("<td>" + json[i].proList[j].categorie.libelle + "</td>");
                table2.append(tr);
            }
            table4.append('<tr><td style="\n' +
                '    padding: 0 0px 0 25px;\n' +
                '">Tâches</td></tr>');
            for (var k = 0; k < json[i].taskList.length; k++) {
                tr = $('<tr/>');
                tr.append("<td>&nbsp;<span style='display: none'>"+json[i].user.id+"</span></td>");
                tr.append("<td>" +
                    "<div class='input-field col s3 m3 l3'>" +
                    "   <input id='dateTask"+json[i].taskList[k].id+"' data-taskId='"+json[i].taskList[k].id+"' type='text' class='datepicker' value='" + timeToDatePicker(json[i].taskList[k].dateTask) + "'>" +
                    "   <label for='dateTask"+json[i].taskList[k].id+"'>Date</label>" +
                    "</div>" +
                    "<div class='input-field col s9 m9 l9' style=\"\n" +
                    "    width: 59%;\n" +
                    "\">" +
                    "   <textarea id='contenu"+json[i].taskList[k].id+"' data-taskId='"+json[i].taskList[k].id+"' type='text' class='materialize-textarea'>"+json[i].taskList[k].contenu+"</textarea>" +
                    "   <label for='contenu"+json[i].taskList[k].id+"'>Contenu</label>" +
                    "</div>");
                var checked = "";
                if (json[i].taskList[k].etat == 1) {
                    checked = "checked";
                }
                var toggle ="<div class='switch right-align'><label>"+
                    "   Validation  " +
                    "   <input type='checkbox' id='"+json[i].taskList[k].id+"' class='validTask' type='checkbox' "+checked+">"+
                    "   <span class='lever'>" +
                    "</span></label></div> ";
                tr.append("<td>" + toggle + "</td>");
                tr.append("<td>" +
                    "<div class='deleteIcon' data-taskId='"+json[i].taskList[k].id+"'>"+deleteIcon+"</div>"+
                    "</td>");
                table3.append(tr);
            }
            tr = $('<tr/>');
            tr.append("<td>" +
                "<div class='input-field col s3 m3 l3'>" +
                "   <input id='dateTask"+projId+"' type='text' class='datepicker'>" +
                "   <label for='dateTask"+projId+"'>Date</label>" +
                "</div>" +
                "<div class='input-field col s9 m9 l9' style=\"\n" +
                "    width: 59%;\n" +
                "\">" +
                "   <textarea id='contenu"+projId+"' type='text' class='materialize-textarea'></textarea>" +
                "   <label for='contenu"+projId+"'>Contenu</label>" +
                "</div>" + "<div class='icons-container'><div class='checkIcon'>"+ checkIcon + "</div>" +
                "<div class='closeIcon'>"+closeIcon +"</div></div>" +
                "</td>");
            tr.append();
            tr.append();
            //table3.prepend('<tr><td><h5>Tâches</h5></td></tr>');
            table4.append(tr);
            if (json[i].taskList.length > 0) {
                accordContent.empty();
                accordContent.append(table3);
            }
            accordContent.append("<div class='buttonIcon addTask' type='groupe' id='"+json[i].id+"'>" + addIcon + "</div>");
            accordContent.append(table4);
            //var res1 = cardStart + table.prop('outerHTML');
            //var res2 = table2.prop('outerHTML') + cardEnd;
            //var res = res1 + res2;
            div = $('<div class="right-align suppDiv"/>');
            div.append("<div class='buttonIcon edit' type='projet' id='"+json[i].id+"'>" + editIcon + "</div>");
            div.append("<div class='buttonIcon delete' type='projet' id='"+json[i].id+"'>" + deleteIcon + "</div>");
            var card = cardCollapseStart + table.prop('outerHTML') + table2.prop('outerHTML')
                + div.prop('outerHTML')
                + cardCollapseMiddle + $(accordContent).prop('outerHTML')
                + cardCollapseEnd2;
            $("#users").append(card);
        }
        // div = $('<div class="right-align suppDiv"/>');
        // div.append("<div class='buttonIcon edit' type='groupe' id='"+json[i].id+"'>" + editIcon + "</div>");
        // div.append("<div class='buttonIcon delete' type='groupe' id='"+json[i].id+"'>" + deleteIcon + "</div>");
        $("#noProj").hide();
        initMaterial();
        $('.collapsible-body').find('label').addClass('active');
    }else {
        $("#noProj").show();
    }
    $(".addTask").click(function () {
        $(this).parents(".collapsible-body").find(".addTaskTable").removeClass("hide");
    });
    $(".closeIcon").click(function () {
        $(this).parents(".collapsible-body").find(".addTaskTable").addClass("hide");
    });
    $(".deleteIcon").click(function () {
        var task = $(this);
        var taskid = parseInt($(this).attr("data-taskid"));
        var data = {
            "id": taskid,
            "type": "task"
        };
        $.ajax({
            url: "/delete",
            type: "POST",
            data: JSON.stringify(data),
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success: function (ret, textStatus, jqXHR) {
                task.parents('tr').remove();
            }
        });
    });
    $(".checkIcon").click(function () {
        var collapseBody = $($(this).parents(".collapsible-body"));
        var id = collapseBody.attr("data-projId");
        var addTable = collapseBody.find(".addTaskTable");
        var taskTable = collapseBody.find(".taskTable");
        var emptyDiv = collapseBody.find(".divTaskEmpty");
        var noTaskTable = $(taskTable).length < 1;
        if (noTaskTable) {
            taskTable = $("<table class='responsive-table  taskTable'></table>");
        } else {
            taskTable = $(taskTable);
        }
        if ($("#contenu"+id).val() != "" && $("#dateTask"+id).val() != "") {
            var data = {
                "idProj": id,
                "contenu": $("#contenu"+id).val(),
                "date": $("#dateTask"+id).val(),
            };

            $.ajax({
                url: "/addTask",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function (ret, textStatus, jqXHR) {
                    $(addTable).addClass("hide");
                    $(emptyDiv).remove();
                    var json = $.parseJSON(ret);
                    tr = $('<tr/>');
                    tr.append("<td>&nbsp;<span style='display: none'>"+json.id+"</span></td>");
                    tr.append("<td>" + javaToFrenchDate(json.dateTask) + "</td>");
                    tr.append("<td>" + json.contenu + "</td>");
                    var checked = "";
                    if (json.etat == 1) {
                        checked = "checked";
                    }
                    var toggle ="<div class='switch right-align'><label>"+
                        "   Validation  " +
                        "   <input type='checkbox' id='"+json.id+"' class='validTask' type='checkbox' "+checked+">"+
                        "   <span class='lever'>" +
                        "</span></label></div> ";
                    tr.append("<td>" + toggle +
                        "<div class='deleteIcon' data-taskId='"+json[i].taskList[k].id+"'>"+deleteIcon+"</div>"
                        + "</td>");
                    taskTable.append(tr);
                    if (noTaskTable) {
                        collapseBody.append(taskTable);
                    }
                    initValidProj();
                }
            });
        }
    });
    initMaterial();
    initValidProj();
}
