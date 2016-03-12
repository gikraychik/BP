/* POPUP WINDOW PROTOTYPE */

function PopupWindow (popupId, buttonId, pageId) {
    this.popupId = popupId;
    this.openButtonId = buttonId;
    this.$popup = $(this.popupId);
    this.$popupWindow = this.$popup.find(".popup-window");
    this.$openButtonElem = $(this.openButtonId);
    if (typeof pageId !== 'undefined') {
        this.pageId = pageId;
    } else {
        this.pageId = "document";
    }
    this.functionsOnShow = [];
    this.functionsOnHide = [];
}

PopupWindow.prototype.init = function () {
    $(document).on("click", this.openButtonId,
        function () {
            this.open();
            this.callFunctionsOnShow();
        }.bind(this)
    );

    $(document).on("click", this.popupId + " #close",
        function () {
            this.close();
            this.callFunctionsOnHide();
        }.bind(this)
    );

    $(document).keyup(function( event ) {
        if ( event.which == 27 ) {
            this.close();
            this.callFunctionsOnHide();
        }
    }.bind(this));
};

PopupWindow.prototype.callFunctionsOnShow = function () {
    for (var i = this.functionsOnShow.length - 1; i >= 0; i--) {
        this.functionsOnShow[i]();
    }
};

PopupWindow.prototype.callFunctionsOnHide = function () {
    for (var i = this.functionsOnHide.length - 1; i >= 0; i--) {
        this.functionsOnHide[i]();
    }
};

PopupWindow.prototype.open = function () {
    $(this.pageId).find(this.popupId).fadeIn(200);
    if (this.$popupWindow.css("position") == "absolute") {
        $('html, body').animate({
            scrollTop: this.$popupWindow.offset().top
        }, 500);
    }
};

PopupWindow.prototype.close = function () {
    $(this.pageId).find(this.popupId).fadeOut(200);
};