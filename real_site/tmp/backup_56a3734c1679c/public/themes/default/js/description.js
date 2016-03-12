/* DESCRIPTION PAGE */

(function( descriptionPage, $, undefined ) {

    const PAGE_NAME = "descr";

    /* PJAX:END PAGE HANDLER */

    elementsCallbackStack.addPageCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        if (!g_loadedOnce) {
            setContentInVerticalMiddle();
        }
    });

    elementsCallbackStack.addOnResizeCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        setContentInVerticalMiddle();
    });

    elementsCallbackStack.addOnPjaxReplaceCb( function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        var isAnimated = (PAGE_ANIMATION == 'move');
        setContentInVerticalMiddle(isAnimated);
    });

    elementsCallbackStack.addBeforePjaxSendCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        startPageLoader(PAGE_LOADER_FIRST_RGBA);
        startPageLoaderTimer(PAGE_LOADER_SECOND_RGBA, PAGE_LOADER_DELAY);
    });

}( window.descriptionPage = window.descriptionPage || {}, jQuery ));