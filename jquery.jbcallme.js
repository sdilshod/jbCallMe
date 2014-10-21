;/*
jbCallMe v0.2 2014
by Jet Bit - http://JetBit.ru

For more information, visit:
http://jetbit.ru/market/jbcallme
*/

(function ($, window, document, undefined) {
    var pluginName = 'jbcallme',
        defaults = {
            no_name: false,
            no_tel: false,
            no_submit: false,
            title: 'Call me',
            action_url: '/postmaster.php',
            success: 'Message sent',
            fail: 'Message not sent',
            fields: {},
            postfix: "default",
            validate_error_message: "Please fill out this field"
        };

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {

        return this.build();
    };
    Plugin.prototype.build = function () {
        function merge(obj1,obj2){
            var obj3 = {};
            for (var key in obj1) { obj3[key] = obj1[key]; }
            for (var key in obj2) { obj3[key] = obj2[key]; }
            return obj3;
        }
        var _this = this;
        if (!$("#jbCallme_overlay").length) {
            $('<div id="jbCallme_overlay" class="jbCallme_overlay"></div>').appendTo($("body"));
        }
        if (!$("#jbCallme_" + this.options.postfix).length) {
            $('<div id="jbCallme_' + this.options.postfix + '" class="jbCallme"><div class="jb_title">' + this.options.title + '</div><a title="Close" class="jb_close">Close</a><form class="jb_form"></form><div class="jb_success">' + this.options.success + '</div><div class="jb_progress"></div><div class="jb_fail">' + this.options.fail + '</div></div>').appendTo($("body"));

            this.$success = $('.jb_success').hide();
            this.$fail = $('.jb_fail').hide();
            this.$progress = $('.jb_progress').hide();
            this.$overlay = $('#jbCallme_overlay');
            this.$overlay = $('#jbCallme_overlay');
            this.$container = $("#jbCallme_" + this.options.postfix);
            this.$container.append($('<a/>').html('@ JetBit.ru 2013').attr('href','http://jetbit.ru/market/jbcallme').attr('target','_blank').addClass("jb_dev"));
            this.$form = this.$container.find(".jb_form");
            var options = {};
            if (!this.options.no_name) {
                options.name = {
                    required: true,
                    placeholder: "Your name",
                    type: "text"
                }
            }
            if (!this.options.no_tel) {
                options.tel = {
                    required: true,
                    placeholder: "Telephone number",
                    type: "text"
                }
            }
            this.options.fields = merge(options, this.options.fields);
            if (!this.options.no_submit) {
                this.options.fields.submit = {
                    value: "Request a call",
                    type: 'submit'
                }
            }
            if (!this.options.fields.action) {
                this.options.fields.action = {
                    value: "callme",
                    type: 'hidden'
                }
            }
            var err_message = this.options.validate_error_message;
            $.each(this.options.fields, function (index, value) {
                var form_input = '';
                if (value.type && value.type == 'textarea') {
                    form_input = '<textarea ' +
                        (value.required ? 'required="required" oninvalid="this.setCustomValidity(\''+err_message+'\')" oninput="this.setCustomValidity(\'\')"' : '') +
                        (value.class ? 'class="' + value.class + '" ' : '') +
                        (value.placeholder ? 'placeholder="' + value.placeholder + '" ' : '') +
                        'name="' + index + '">'+(value.value ? 'value="' + value.value + '" ' : '')+'</textarea>';
                } else if (value.type && value.type == 'select') {
                    form_input = '<select ' +
                        (value.required ? 'required="required" oninvalid="this.setCustomValidity(\''+err_message+'\')" oninput="this.setCustomValidity(\'\')"' : '') +
                        (value.class ? 'class="' + value.class + '" ' : '') +
                        'name="' + index + '">';
                        form_input += value.placeholder ? '<option disabled="disabled">'+value.placeholder+'</option>' : '';
                        for (var i = 0; i < value.options.length; i++) {
                            form_input += '<option value="'+value.options[i]+'">'+value.options[i]+'</option>';
                        }

                    form_input += '</select>';
                } else {
                    form_input = (value.required ? '<span>*</span>' : '') +'<input ' +
                        (value.required ? 'required="required" oninvalid="this.setCustomValidity(\''+err_message+'\')" oninput="this.setCustomValidity(\'\')"' : '') +
                        (value.placeholder ? 'placeholder="' + value.placeholder + '" ' : '') +
                        (value.class ? 'class="' + value.class + '" ' : '') +
                        (value.value ? 'value="' + value.value + '" ' : '') +
                        'type="' + (value.type && jQuery.inArray(value.type, ["submit", "hidden", "text", "email", "date", "color"]) >= 0 ? value.type : 'text') + '" name="' + index + '" />';
                }

                $((value.type != 'hidden' ? '<div class="jb_input">' +
                        (value.label ? '<label>' + value.label + '</label>' : '') : '') +
                    form_input +
                    (value.type != 'hidden' ? '</div>' : '')).appendTo(_this.$form);
            });

            this.$container.hide().find(".jb_close").on('click', function () {
                _this.end();
                return false;
            });
            this.$overlay.hide().on('click', function () {
                _this.end();
                return false;
            });
            this.$form.on('submit', function () {
                _this.submit();
                return false;
            });
        }
        $(_this.element).on('click', function () {
            _this.show();
            return false;
        });
    };
    Plugin.prototype.submit = function () {
        var _this = this;
        _this.$container.find('.jb_progress').show();
        _this.$container = $("#jbCallme_" + this.options.postfix);
        _this.$container.find('form').hide();
        $.ajax({
            type: "POST",
            url: this.options.action_url,
            data: this.$form.serialize(),
            success: function(data) {
                _this.$container.find('.jb_progress').hide();
                if (data == '200') {
                    _this.$container.find('.jb_success').show();
                } else {
                    _this.$container.find('.jb_fail').show();
                }
            },
            error: function(){
                _this.$container.find('.jb_progress').hide();
                _this.$container.find('.jb_fail').show();
            }
        });
        setTimeout(function () {
            _this.end()
        }, 9000);
        return false;
    };
    Plugin.prototype.end = function () {
        this.$overlay = $('#jbCallme_overlay').fadeOut();
        this.$container = $(".jbCallme").fadeOut();
        $('#jbCallme_' + this.options.postfix).find('form')[0].reset();
        $('.jbCallme .jb_success, .jbCallme .jb_fail').hide();
        $('.jbCallme form').show();

    };
    Plugin.prototype.show = function () {
        this.$other = $('.jbCallme:not(#jbCallme_' + this.options.postfix + ')').hide();
        this.$overlay = $('#jbCallme_overlay').fadeIn();
        $('#jbCallme_' + this.options.postfix).find('form')[0].reset();
        element = $(this.element);
        $("#jbCallme_" + this.options.postfix).find('input,textarea').each(function(){
            if(element.data($(this).attr('name'))){
                $(this).val(element.data($(this).attr('name')));
            }
        });
        this.$container = $("#jbCallme_" + this.options.postfix).show();
    };
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }

        });
    }

})(jQuery, window, document);
