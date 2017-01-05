/**
 * Created by ttomc on 03/01/2017.
 */
$(function () {
    $('#login').val('');
    var password = $('#password').val('');

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

    $('#logout').bind("click", function () {
        $.post(
            '/logout',
            function (retour) {

            if (retour.error) {
                alert(retour.messageRetour);
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
    
});
    