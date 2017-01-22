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

    // $("#button").on('click', function () {
    //     this.classList.toggle('open');
    //     container.classList.toggle('active');
    //     container.classList.toggle('enable');
    //
    //     var child = $(this).find(".material-design-hamburger__layer")
    //     if (child.hasClass('material-design-hamburger__icon--to-arrow')) {
    //         child.removeClass('material-design-hamburger__icon--to-arrow');
    //         child.addClass('material-design-hamburger__icon--from-arrow');
    //         $(".swipe-area").width("50px");
    //     } else {
    //         child.removeClass('material-design-hamburger__icon--from-arrow');
    //         child.addClass('material-design-hamburger__icon--to-arrow');
    //         $(".swipe-area").width("300px");
    //     }
    // });
    //
    // $(".swipe-area").swipe({
    //     swipeLeft:function(event, phase, direction, distance, duration, fingers) {
    //         $("#button").click();
    //         $(".swipe-area").width("50px");
    //     },
    //     swipeRight:function(event, phase, direction, distance, duration, fingers)
    //     {
    //
    //         $("#button").click();
    //         $(".swipe-area").width("300px");
    //
    //
    //     }
    // });

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
    
});