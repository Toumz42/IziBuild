$(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/assets/sw.js',{ scope : "/" }).then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    $('#nav-mobile').removeClass('fixed');
    $('.button-collapse').removeClass('hide-on-large-only');
    $('.button-collapse').addClass('show-on-large');
    $('.parallax').parallax();
    // Detect touch screen and enable scrollbar if necessary
    if (is_touch_device()) {
        $('.arrowCarousel').hide();
    }
    $('.carousel.carousel-slider').carousel({fullWidth: true});
    $('.carousel').css("height", $(window).height() - 90 );
    $('.parallax-carousel').css("height", $(window).height() - 90);

    $(window).resize(function() {
        $('.carousel').css("height", $(window).height() - 90 );
        $('.parallax-carousel').css("height", $(window).height() - 90);
    });

    $('.prev').on('click touchstart',function() {
        $('.carousel').carousel('prev');
    });
    $('.next').on('click touchstart',function() {
        $('.carousel').carousel('next');
    });
    $('.logout').text("Connexion");
    $('header').css("padding-left", 0);
    $('main').css("padding-left", 0);
    $('footer').css("padding-left", 0);
    $('.slider').slider();

    //setInterval(function(){ $('.carousel').carousel('next'); }, 5000);
    lastScrollTop = 0;
    $(window).on('scroll', function() {
        var st = $(this).scrollTop();
        if (st > lastScrollTop){
            $('#headerHolder').hide();
            $('nav').addClass('headerHidden');
        } else {
            $('nav').removeClass('headerHidden');
            $('#headerHolder').show();
        }
        lastScrollTop = st;
    });

});

function is_touch_device() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}