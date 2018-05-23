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
        var data = 'login='+ id +'&pswd='+password;
        // $.ajaxSetup({
        //     contentType: "application/json; charset=utf-8"
        // });

        $.post(
            '/identifyUser',
            data,
            function (retour) {

            if (retour.error) {
                alert(retour.messageRetour);
                $('#login').select();
            }
            else {
                window.location = retour;
            //     var rep = "<div class='row' style='color: grey; margin-left: 20px'> "+
            //         "<span>"+retour.messageRetour+"</span>"+
            //         "</div>";
            //     $("#formParent").append(rep);
            }
        });
    });

    $('.input-field').keypress(function (e) {
        if (e.which == 13) {
            $('#btn_connexion').click();
            return false;    //<---- Add this line
        }
    });



    Materialize.showStaggeredList($("#stage"));
});
    