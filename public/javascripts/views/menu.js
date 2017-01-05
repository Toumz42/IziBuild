/**
 * Created by ttomc on 05/01/2017.
 */
$(function () {
var btn = document.querySelector('.nav__button'), container = document.querySelector('.conteneur');
$("#button").on('click', function () {
    this.classList.toggle('open');
    container.classList.toggle('active');
});

(function hamb() {

    'use strict';

    $(".material-design-hamburger__icon").on(
        'click',
        function() {
            var child;


            child = this.childNodes[1].classList;

            if (child.contains('material-design-hamburger__icon--to-arrow')) {
                child.remove('material-design-hamburger__icon--to-arrow');
                child.add('material-design-hamburger__icon--from-arrow');
            } else {
                child.remove('material-design-hamburger__icon--from-arrow');
                child.add('material-design-hamburger__icon--to-arrow');
            }

        });

})();

(function (window, document) {

    var menu     = $('#menu'),
        menuLink = $('#button'),
        overlay  = $('#overlay');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
            if (classes[i] === className) {
                classes.splice(i, 1);
                break;
            }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.on("click", function (e) {
        var active = 'enable';

        e.preventDefault();
        toggleClass(menu, active);
        toggleClass(menuLink, active);
        toggleClass(overlay, active);
    });

}(this, this.document));
});