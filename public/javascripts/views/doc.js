/**
 * Created by ttomc on 06/01/2017.
 */
$(function()
{
    $(".page-title").empty().append("Documents Isitech");
    //    $('a.embed').gdocsViewer();
    /*
     * jQuery File Upload Plugin JS Example 6.7
     * https://github.com/blueimp/jQuery-File-Upload
     *
     * Copyright 2010, Sebastian Tschan
     * https://blueimp.net
     *
     * Licensed under the MIT license:
     * http://www.opensource.org/licenses/MIT
     */

    /*jslint nomen: true, unparam: true, regexp: true */
    /*global $, window, document */

        'use strict';
        var host = 'localhost:9000';
        // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
                url: '/upload',
                type: "POST",
                // autoUpload: true,
                autoUpload: false,
                multipart: true,
                disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent)
        });

    $('#addFile').click(function () {
        $('#addInput').click();
    });


    var ajaxDone = false;
    // $(document).ajaxStop(function (event, request, settings) {
    //     $.ajax ({
    //         url: "/checkAdmin",
    //         type: "GET",
    //         dataType: "text",
    //         contentType: "application/json; charset=utf-8",
    //         success: function(ret, textStatus, jqXHR){
    //             var json = $.parseJSON(ret);
    //             if (json){
    //                 $(".admin").show();
    //             }
    //         },
    //         error: function (xhr, ajaxOptions, thrownError) {
    //             if(xhr.status==403) {
    //                 $(".admin").hide();
    //             }
    //         }
    //     });
    //     ajaxDone = true;
    // });
        // Enable iframe cross-domain access via redirect option:
        // $('#fileupload').fileupload(
        //     'option',
        //     'redirect',
        //     window.location.href.replace(
        //         /\/[^\/]*$/,
        //         '/cors/result.html?%s'
        //     )
        // );

        // if (window.location.hostname === host) {
        //     // Demo settings:
        //     $('#fileupload').fileupload('option', {
        //         url: '//' + host + '/imgs/',
        //         maxFileSize: 5000000,
        //         acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        //         process: [
        //             {
        //                 action: 'load',
        //                 fileTypes: /^image\/(gif|jpeg|png)$/,
        //                 maxFileSize: 20000000 // 20MB
        //             },
        //             {
        //                 action: 'resize',
        //                 maxWidth: 1440,
        //                 maxHeight: 900
        //             },
        //             {
        //                 action: 'save'
        //             }
        //         ]
        //     });
        //     // Upload server status check for browsers with CORS support:
        //     if ($.support.cors) {
        //         $.ajax({
        //             url: '//' + host + '/imgs/',
        //             type: 'HEAD'
        //         }).fail(function () {
        //             $('<span class="alert alert-error"/>')
        //                 .text('Upload server currently unavailable - ' +
        //                     new Date())
        //                 .appendTo('#fileupload');
        //         });
        //     }
        // } else {
            // Load existing files:
    $('#fileupload').addClass('fileupload-processing');
    $.ajax({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: $('#fileupload').fileupload('option', 'url'),
        dataType: 'json',
        context: $('#fileupload')[0]
    }).always(function () {
        $(this).removeClass('fileupload-processing');
    }).done(function (result) {
        $(this).fileupload('option', 'done')
            .call(this, $.Event('done'), {result: result});
    })
        // }

});
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "File is too big",
            "minFileSize": "File is too small",
            "acceptFileTypes": "Filetype not allowed",
            "maxNumberOfFiles": "Max number of files exceeded",
            "uploadedBytes": "Uploaded bytes exceed file size",
            "emptyResult": "Empty file upload result"
        },
        "error": "Error",
        "start": "Start",
        "cancel": "Cancel",
        "destroy": "Delete"
    }
};