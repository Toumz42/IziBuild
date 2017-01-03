/**
 * Created by ttomc on 11/12/2016.
 */
$(function()
{
    $("#signInCheck").click(function(){
        if ( $("#signInCheck").is( ":checked" ) ){
            $("#signInNameDiv").show();
        } else {
            $("#signInNameDiv").hide();
        }
    });

    $("#sub").click(function(){
        if ( ($("#email").size()!=0) && ($("#password").size()!=0) )
        {

            var data = {"name" : $("#last_name").val(),
            "surname" : $("#first_name").val(),
            "email" : $("#email").val(),
            "password" :  $("#password").val()};

            $.ajax ({
                url: "/user",
                type: "POST",
                data: JSON.stringify(data),
                dataType: "text",
                contentType: "application/json; charset=utf-8",
                url : '/user',
                type : 'POST', // Le type de la requête HTTP, ici devenu POST
                success: function(ret, textStatus, jqXHR){
                    $("#formSign").hide();
                    var rep = "<div class='row' style='color: grey; margin-left: 20px'> "+
                    "<span>"+ret+"</span>"+
                    "</div>";
                    $("#formParent").append(rep);

                } // On fait passer nos variables, exactement comme en GET, au script more_com.php
            });


            // $.post("/user",
            //     {
            //         "name"  : $("#last_name").val(),
            //         "surname" : + $("#first_name").val(),
            //         "email" : $("#email").val(),
            //         "password" :  $("#password").val()
            //     },function(ret)
            //     {
            //         alert(ret);
            //     });
        } else {
          alert("")
        }
    });



});