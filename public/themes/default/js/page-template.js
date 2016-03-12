/* SOME PAGE */

(function( somePage, $, undefined ) {

    /* CONSTANTS */
    const PAGE_NAME = "some"; // unique page name, must by equal <body> id

    /* PRIVATE MEMBERS */

    /* PRIVATE FUNCTIONS */

    /* CONDITION CALLBACK */
    /* Works if return true                   */
    /* If return false then lock page loading */
    elementsCallbackStack.addConditionCb(function() {
        if (!($("body").attr("id") == PAGE_NAME)) 
            return true;
        return true;
    });

    /* AFTER CONTENT LOADED HADLER */
    elementsCallbackStack.addAfterPageLoadedCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

    });

    /* PAGE FULLY LOADED HANDLER */
    elementsCallbackStack.addPageCb(function() {
        if (!($("body").attr("id") == PAGE_NAME)) return;
    });

    /* ONRESIZE HANDLER */
    elementsCallbackStack.addOnResizeCb(homeOnResizeCallback);
    function homeOnResizeCallback (winWidth, winHeight) {
        if (!($("body").attr("id") == PAGE_NAME)) return;

    }

    /* ON CONTENT REPLACE HANDLER */
    elementsCallbackStack.addOnPjaxReplaceCb( function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

    });

    /* BEFORE AJAX REQUEST SEND HANDLER */
    elementsCallbackStack.addBeforePjaxSendCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
    });

    /* ANOTHER HANDLERS */

}( window.somePage = window.somePage || {}, jQuery ));