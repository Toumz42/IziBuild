/**
 * Created by ttomc on 05/01/2017.
 */
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
    
    $.ajax ({
        url: "/checkAdmin",
        type: "GET",
        dataType: "text",
        contentType: "application/json; charset=utf-8",
        success: function(ret, textStatus, jqXHR){
            var json = $.parseJSON(ret);
            if (json){
                $(".linkproj").prop("href","/admin");
                $(".projText").text("Administration");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.status==403) {
                $(".linkproj").prop("href","/projet")
            }
        }
    });  

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
    $(".button-collapse").sideNav();


$.ajax ({
    url: "/checkAdmin",
    type: "GET",
    dataType: "text",
    contentType: "application/json; charset=utf-8",
    success: function(ret, textStatus, jqXHR){
        var json = $.parseJSON(ret);
        if (json){
            $(".linkNote").prop("href","/admnote");
            $(".noteText").text("Administration Notes");
        }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        if(xhr.status==403) {
            $(".linknote").prop("href","/note")
        }
    }
});

});