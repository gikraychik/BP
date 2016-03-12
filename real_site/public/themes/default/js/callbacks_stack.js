function ElementsCallbackStack() {
    this.pagesCallbacks = [];
    this.formCallbacks = [];
    this.onResizeCallbacks = [];
    this.onPjaxReplaceCb = [];
    this.conditionCb = [];
    this.afterPageLoadedCb = [];
    this.beforePjaxSend = [];
    
    this.addPageCb = function (func) {
        this.pagesCallbacks.push(func)
    };

    this.addFormCb = function (func) {
        this.formCallbacks.push(func)
    };

    this.addAfterPageLoadedCb = function (func) {
        this.afterPageLoadedCb.push(func)
    };

    this.addOnResizeCb = function (func) {
        this.onResizeCallbacks.push(func)
    };

    this.addOnPjaxReplaceCb = function (func) {
        this.onPjaxReplaceCb.push(func)
    };

    this.addConditionCb = function (func) {
        this.conditionCb.push(func)
    };

    this.addBeforePjaxSendCb = function (func) {
        this.beforePjaxSend.push(func)
    };

    this.callAllPagesCb = function () {
        for (var i = this.pagesCallbacks.length - 1; i >= 0; i--) {
            this.pagesCallbacks[i]();
        }
    };

    this.callAllFormsCb = function () {
        for (var i = this.formCallbacks.length - 1; i >= 0; i--) {
            this.formCallbacks[i]();
        }
    };

    this.callAllAfterPageLoadedCb = function () {
        for (var i = this.afterPageLoadedCb.length - 1; i >= 0; i--) {
            this.afterPageLoadedCb[i]();
        }
    };

    this.callAllOnResizeCb = function (winWidth, winHeight) {
        for (var i = this.onResizeCallbacks.length - 1; i >= 0; i--) {
            this.onResizeCallbacks[i](winWidth, winHeight);
        }
    };

    this.callAllOnPjaxReplaceCb = function () {
        for (var i = this.onPjaxReplaceCb.length - 1; i >= 0; i--) {
            this.onPjaxReplaceCb[i]();
        }
    }

    this.callAllConditionCb = function () {
        for (var i = this.conditionCb.length - 1; i >= 0; i--) {
            if (!this.conditionCb[i]()) return false;
        }
        return true;
    }

    this.callAllBeforePjaxSendCb = function () {
        for (var i = this.beforePjaxSend.length - 1; i >= 0; i--) {
            this.beforePjaxSend[i]();
        }
    }
}

var elementsCallbackStack = new ElementsCallbackStack();