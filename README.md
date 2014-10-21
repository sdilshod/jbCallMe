jbCallMe
========

 Install
--------

Put to block `<head>` of the page which you want to appearance a form, links to script/style files.

` <script type="text/javascript" src="/путь_к/jquery.js"></script> ` <br/>
` <script type="text/javascript" src="/путь_к/jquery.jbcallme.js"></script> ` <br/>
` <link rel="stylesheet" type="text/css" href="/путь_к/jquery.jbcallme.css"> `


Simple call
-----------

`<a class="callme_button">Request a call</a> ` <br/>

    $(function() {
        $('.callme_button').jbcallme();
    });

Adding fields
-------------

    $(function() {
        $('.callme_order_btn').jbcallme({
            postfix: "callme_order",
            validate_error_message: "Field must be fill",
            fields: {
                time: {
                    label: "Call time",
                    placeholder: "17:30 - 20:00",
                },
                descr: {
                    label: "Note",
                    type: "textarea",
                },
                action: {
                    type: "hidden",
                    value: "callme_order",
                },
            },
        });
    });
