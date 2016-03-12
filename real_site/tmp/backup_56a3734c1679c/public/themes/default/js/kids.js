/* Kids page */

(function (kidsPage, $, undefined) {

    const PAGE_NAME = "kids";

    var g_kidsCarousel;
    var g_winSize;

    /* PJAX:END PAGE HANDLER */

    elementsCallbackStack.addPageCb(kidsOnLoadCallback);
    function kidsOnLoadCallback() {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        if (typeof  g_kidsCarousel == 'undefined') {
            g_kidsCarousel = new Carousel("carousel", true);
        } else {
            g_kidsCarousel.reinit();
        }
        $(".owl-item.active").find("img").resizeToParent("once");

        $(".grouped_elements").fancybox({
            'transitionIn': 'elastic',
            'transitionOut': 'elastic',
            'speedIn': 600,
            'speedOut': 200,
            'overlayShow': false
        });

        if (!g_loadedOnce) {
            setContentInVerticalMiddle();
        }   
    }

    elementsCallbackStack.addOnResizeCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        $(".owl-item.active").find("img").resizeToParent("once");
        $(".item").width(parseFloat($(".owl-wrapper-outer").width()));
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

}(window.kidsPage = window.kidsPage || {}, jQuery));