$(function () {
    $('#btn_connexion').bind("click", function () {
        var password = $('#password1').val();
        var data = JSON.stringify({"password": password});
        if (checkPass()) {
            $.ajax({
                url: '/resetPassword',
                data: data,
                type: "POST",
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                success: function (retour) {
                    if (retour.error) {
                        alert(retour.messageRetour);
                        $('#login').select();
                    } else {
                        $(".modal").modal("open");
                        window.location = "/home";
                    }
                }
            });
        }
    });
    $("#password1").focusout(function () {
        checkPass();
    });
    $("#password2").focusout(function () {
        checkPass2();
    });

    function checkPassWord() {
        return checkPass() && checkPass2();
    }
    function checkPass2()
    {
        if ($("#password2").val() != "") {
            if ($("#password1").val() == $("#password2").val()) {
                $("#password2").addClass("valid");
                $("#password2").removeClass("invalid");
                return true;
            }
            else {
                $("#password2").removeClass("valid");
                $("#password2").addClass("invalid");
                $("#password2").focus();
            }
        } else if ($("#password1").val() == "") {
            $("#password1").focus();
        } else {
            $("#password2").removeClass("invalid");
            $("#password2").focus();
        }
        return false;
    }
    function checkPass()
    {
        if ($("#password1").val() != "") {
            if ($("#password1").val().length < 6) {
                myToast("Minimum 6 caractères!");
                $("#password1").removeClass("valid");
                $("#password1").addClass("invalid");
                $("#password1").focus();
            } else {
                return true;
            }
        }
        return false;
    }
});