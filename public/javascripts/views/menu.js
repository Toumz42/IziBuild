/**
 * Created by ttomc on 05/01/2017.
 */
currentUser = 'none';
$(function () {
    var btn = document.querySelector('.nav__button'), container = document.querySelector('.conteneur');

    function is_touch_device() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }
    if (is_touch_device()) {
        $('#nav-mobile').css({ overflow: 'auto'});
    }
    //addToHomescreen()

    $('.logout').on("click", function () {
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
    $(".sidenav").sidenav();

    $.ajax ({
        url: "/getCurrentUser",
        type: "GET",
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if (json){
                $("#nameNav").text(json.name + " " + json.surname);
                $("#mailNav").text(json.email);
                currentUser = json;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.status==403) {

            }
        }
    });

});