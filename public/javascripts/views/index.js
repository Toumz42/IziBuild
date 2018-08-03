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

    $('#logoLI').show();
    $('#nav-mobile').css({ 'margin-top': '0px'}).removeClass('fixed');
    $('.button-collapse').removeClass('hide-on-large-only').addClass('show-on-large');
    $('.parallax').parallax();
    // Detect touch screen and enable scrollbar if necessary
    if (is_touch_device()) {
        $('.arrowCarousel').hide();
    }
    $('.carousel.carousel-slider').carousel({fullWidth: true}).removeAttr("style");
  //  $('.carousel').css("height", $(window).height() );
  //  $('.parallax-carousel').css("height", $(window).height());

    // $(window).resize(function() {
    //     $('.carousel').css("height", $(window).height() );
    //     $('.parallax-carousel').css("height", $(window).height() );
    // });

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
        if (st > lastScrollTop && st > $(window).height()){
            $('nav').addClass('headerHidden');
        } else {
            $('nav').removeClass('headerHidden');
        }
        var pc = ((st) / $(window).height());
        if (st < $(window).height()) {
            $('nav').removeClass('red accent-4').addClass('transparent');
            $(".carousel .active img").css('opacity', 1 - pc);
        } else {
            $('nav').addClass('red accent-4').removeClass('transparent');
            $(".carousel .active img").css('opacity', 1);
        }
        lastScrollTop = st;
    });
    var st = $(this).scrollTop();
    if (st < $(window).height()) {
        $('nav').addClass('transparent').removeClass('red accent-4');
    } else {
        $('nav').addClass('red accent-4').removeClass('transparent');
    }

});

function is_touch_device() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}