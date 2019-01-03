/**
 * Created by ttomc on 03/01/2017.
 */
$(function () {
    var pathname = window.location.pathname;


    $("#signInCheck").click(function(){
        if ( $("#signInCheck").is( ":checked" ) ){
            $("#signInNameDiv").toggleClass("hide",false);
        } else {
            $("#signInNameDiv").toggleClass("hide",true);
        }
    });

    if (pathname === "/login") {
        $('.logout').hide();
    }
    $(".page-title").empty().append("Connexion");

    $('#email').val('');
    $('#password').val('');
    //fixedMailInput();

    $('#btn_connexion').bind("click", function () {
        var id = $('#email').val();
        var password = $('#password').val();
        var stay = $('#stay').is(":checked");
        var data = {'login': id ,'pswd':password,"stay":stay};
        // $.ajaxSetup({
        //     contentType: "application/json; charset=utf-8"
        // });

        $.ajax({
            type: "POST",
            url: '/identifyUser',
            data: JSON.stringify(data),
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            success: function (retour) {
                if (retour.error) {
                    alert(retour.messageRetour);
                    $('#login').select();
                }
                else {
                    window.location = retour;
                }
            }
        });
    });
    $(".modal").modal({startingTop: '25%', endingTop: '25%'});
    $('.forgot-pass').bind("click", function () {
        var id = $('#email').val();
        if (id !== '') {
            $.ajax({
                method: 'POST',
                url: '/forgotPassword',
                data: JSON.stringify({"mail": id}),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function (retour) {
                    if (retour.error) {
                        myToast(retour.messageRetour);
                    } else {
                        $(".modal").modal("open");
                    }
                }
            });
        } else {
            myToast("Erreur le mail est vide")
        }
    });

    $('.input-field').keypress(function (e) {
        if (e.which == 13) {
            $('#btn_connexion').click();
            return false;    //<---- Add this line
        }
    });


});
    