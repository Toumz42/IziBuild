$(function()
{
/*
   $(".contenu").css({ 'padding-left': $("#menu").width() });
   $(".contenu").width($(window).width() - $("#menu").width());   // contenu à la taille de la page


    $("#btn_addSession").show();
    $("#btn_addSession").unbind();
    $("#btn_addSession").attr("title","Ajouter un référenciel")
*/


    $("#refRefresh").click(function(){refreshList()})

//    $("#btn_addRecord").show();
    $("#btn_addRecord").unbind();
    $("#btn_addRecord").attr("title", "Ajouter un référentiel");

    $("#btn_addRecord").click(function()
    {

        $('#referentielCreationModal').empty();
        var data = {
            "typeId": $("#cbx_referentiel").val()
        };
        $.ajax ({
            url : "/addNewRef",
            data :JSON.stringify(data),
            dataType: "text",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success : function (ns) {
                ns = JSON.parse(ns);
                if (ns.isError) {
                    alert(ns.messageRetour);
                }
                else {
                    $("#idReferentiel").val(ns.id);
                    $("#inputReferentiel .field").val("");
                    $("#inputReferentiel .fieldText").text("");
                    refreshEcranSaisie(ns);
                }
            }
        });
    });

    $("#btnReferentielSupprime").click(function()
    {
        var id = $('#idReferentiel').val();
        supprimerReferentiel(id);
    });

    $(document).keyup(function(e){
        if (e.keyCode == 27) { $("#btnReferentielRetour").click();}
        /*else if (e.keyCode == 46) {
            $("#btnReferentielSupprime").click();
        } else if(e.keyCode == 13){
            $("#btnReferentielRetour").click();
        }*/
    });

    $("#inputReferentiel").hide();

    $("#btnReferentielRetour").click(function()
    {
        waitOn();
        $.ajax({
            type: "POST",
            url : "/getAllByTypeId",
            data : JSON.stringify({"id" : $("#cbx_referentiel").val()}),
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                data = JSON.parse(data);
                $("#tableReferentiel tbody").empty();
                $.each(data,function(index,value)
                {
                    $("#tableReferentiel tbody").append('<tr id="'+value.id+'"><td>'+value.code+'</td><td>'+value.libelle+'</td><td>'+value.commentaire+'</td></tr>');
                });
                $("#cbx_referentiel").prop("disabled", false);
                $("#inputReferentiel").hide("slide");
                waitOff();
            },
            error : function (xhr, ajaxOptions, thrownError) {
                myToast("Erreur dans la recuperation");
                waitOff();
            }
        });
    });
    waitOn();
    $.ajax({
        url : "/getAllTypes",
        type: "POST",
        success: function(data) {
            $("#cbx_referentiel").empty();
            $("#cbx_referentiel").append('<option value="-1">Choisir un type de référentiel</option>');
            $.each(data,function(index,value)
            {
                $("#cbx_referentiel").append('<option value="'+value+'">'+index+'</option>');
            });
            $('select').formSelect();
            waitOff();
        },
        error : function (xhr, ajaxOptions, thrownError) {
            myToast("Erreur dans la recuperation");
            waitOff();
        }
    });

    $("#cbx_referentiel").change(function()
    {
        if ($("#cbx_referentiel").val() >= 0) {
            $("#btn_addRecord").show();
        } else {
            $("#btn_addRecord").hide();
        }
        refreshList();
    });
    if ($("#cbx_referentiel").val() == null) {
        $("#btn_addRecord").hide();
    }

    $("#code").change(function () { saveByChamps("code", $("#code").val()); });
    $("#libelle").change(function(){ saveByChamps("libelle", $("#libelle").val()); });
    $("#commentaireLong").change(function(){ saveByChamps("commentaireLong", $("#commentaireLong").val()); });
    $("#isActif").change(function(){ saveByChamps("isActif", $("#isActif").prop("checked")); });

    $(document).on('click','#tableReferentiel tbody tr',function(){
        var id = this.id;
        $.ajax({
            type: "POST",
            url  : "/getReferentiel",
            data : JSON.stringify({"id": id}),
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success : function(data) {
                data = JSON.parse(data);
                if (data != null) {
                    refreshEcranSaisie(data);
                } else {
                    alert("Problème au chargement");
                }
            }
        });
    });
     $("#inputReferentiel").width($(document).width() - $("#menu").width() -500)
    $(window).resize(function () {
        $("#inputReferentiel").width($(document).width() - $("#menu").width() - 500)
    });
    $(".bandeau").css("width",$("#tableReferentielDiv").width());



});

/**
 * Permet de sauvegarder une correcpondance en passant le champ et la valeur à sauvegarder
 *
 * @param idSession
 */
function saveByChamps(champ, valeur)
{
    var id = $('#idReferentiel').val();
    switch (champ) {
        case "code" : var code = valeur; break;
        case "libelle" : var libelle = valeur; break;
        case "commentaireLong" : var commentaireLong = valeur; break;
    }
	$.ajax({url:"/saveByChamps",
        type: "POST",
        data : JSON.stringify({
            "id" : id,
            "code" : code,
            "libelle" : libelle,
            "commentaireLong" : commentaireLong
        }),
        dataType : "text",
        contentType : "application/json; charset=utf-8",
        success : function(retour) {
            if (retour.isError)
            {
                alert(retour.messageRetour);
            }
        }
});
}

function supprimerReferentiel(idReferentiel)
{
    if (confirm("Confirmer la suppression de la fiche"))
    {
        $.ajax({
            type: "POST",
            url : "/deleteReferentiel",
            data : JSON.stringify({
                'id' : idReferentiel
            }),
            success : function(ret) {
                data = JSON.parse(ret);
                if (ret.isError) {
                    alert(ret.messageRetour);
                } else {
                    $("#btnReferentielRetour").click();
                }
            }
        });
    }
}

function refreshEcranSaisie(data)
 {
     $("html, body").stop().animate({scrollTop:0}, 500, 'swing');
     if ($("#cbx_referentiel").val() === "-1") {
         $("#btn_addRecord").hide();
     }
     $("#idReferentiel").val(data.id);
     $("#code").val(data.code);
     $("#libelle").val(data.libelle);
     $("#commentaireLong").val(data.commentaire);
     $("#cbx_referentiel").prop("disabled", true);
     $("#inputReferentiel").show("slide");
     $("#inputReferentiel .field").eq(0).select();
     $.each($("#inputReferentiel input, #inputReferentiel textarea"), function (index, value) {
         if ($(this).val() !== "") {
             $("label[for='" + this.id + "']").addClass("active");
         }
     });
 }

function refreshList()
{
    $.ajax({url : "/getAllByTypeId",
        type: "POST",
        data: JSON.stringify({
            "id": $("#cbx_referentiel").val()
        }),
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success :function(data)
        {
            data = JSON.parse(data);
            $("#tableReferentiel tbody").empty();
            $.each(data, function (index, value) {
                $("#tableReferentiel tbody").append('<tr id="'+value.id+'"><td>'+value.code+'</td><td>'+value.libelle+'</td><td>'+value.commentaire+'</td></tr>');
            });
        }
    });
}