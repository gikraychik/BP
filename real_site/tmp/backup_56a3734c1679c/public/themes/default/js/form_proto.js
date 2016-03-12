/* FORM PROTOTYPE */

function Form (formId) {
    this.formId = formId;
    this.$form = $(this.formId);
    this.resultContainerId = this.formId + " #result";
    this.$resultContainer = this.$form.find("#result");
    this.afterSubmitFunctions = [];
    this.beforeSubmitFunctions = [];

    this.initFormHandlers();
}

Form.prototype.reinit = function (formId) {
    this.constructor(this.formId);
}

Form.prototype.initFormHandlers = function () {
    $(document).on('submit', this.formId, function (event) {
        this.callBeforeSubmitFunctions();
        $.pjax.submit(event, this.resultContainerId, {
            "push": false,
            "scrollTo": false,
            "timeout": 10000,
            "from": "form"
        });
    }.bind(this));
};

Form.prototype.afterSubmit = function () {
    this.$resultContainer = $(this.resultContainerId);
    if (this.$resultContainer.find("#success").length > 0) {
        //if server answer success
        this.$resultContainer
            .css({"background-color":"green", "right":"-10px", "display":"block"})
            .delay(700)
            .fadeOut(
                function () {
                    //call all callbacks then form success
                    this.callAfterSubmitFunctions();
                    this.$form.trigger('reset');
                }.bind(this)
            );
    }
    else {
        //if server answer have errors
        this.$resultContainer.css({"background-color":"#de4040"});
        // if result container is not already shown
        if (this.$resultContainer.find("#error").length > 0 &&
            $(this.resultContainerId + ":hidden").length > 0) {
            this.$resultContainer.fadeIn(200);
        }
        // if result container is already shown
        else {
            this.$resultContainer.animate({marginTop: "-=10", bottom: "+=10"}, 100, function () {
                $(this).animate({marginTop: "+=10", bottom: "-=10"}, 100);
            });
        }
        if (isMobile()) {
            $('html, body').animate({
                scrollTop: this.$resultContainer.offset().top
            }, 500);
        }
    }
};

Form.prototype.callAfterSubmitFunctions = function () {
    for (var i = this.afterSubmitFunctions.length - 1; i >= 0; i--) {
        this.afterSubmitFunctions[i]();
    }
};

Form.prototype.callBeforeSubmitFunctions = function () {
    for (var i = this.beforeSubmitFunctions.length - 1; i >= 0; i--) {
        this.beforeSubmitFunctions[i]();
    }
};

Form.prototype.initDateFields = function () {
    if (isMobile()) {
        // if not PC set native data picker
        $("#date-field").attr("id", "");
    }
    else{
        // if PC set custom data picker
        $("#date-field").attr("type", "text");
        $('#date-field').datetimepicker({
            lang:'ru',
            timepicker:false,
            format:'d.m.Y'
        });
    }
};


Form.prototype.initTimeFields = function () {
    if (isMobile()) {
        // if not PC set native time picker
        $("#time-field").attr("id", "");
    }
    else{
        // if PC set custom time picker
        $("#time-field").attr("type", "text");
        $('#time-field').datetimepicker({
            lang:'ru',
            datepicker:false,
            format:'H:i'
        });
    }
};