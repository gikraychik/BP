/* TEAMBUILDING PAGE */

(function( teambuildingPage, $, undefined ) {

    const PAGE_NAME = "teambuilding";

    var g_teambuildingCarousel;
    var g_winSize;

    /* PJAX:END PAGE HANDLER */

    elementsCallbackStack.addPageCb(teambuildingOnLoadCallback);
    function teambuildingOnLoadCallback ()
    {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        if (typeof  g_teambuildingCarousel == 'undefined') {
            g_teambuildingCarousel = new Carousel("carousel", true);
        } else {
            g_teambuildingCarousel.reinit();
        }

        $(".grouped_elements").fancybox({
            'transitionIn'	:	'elastic',
            'transitionOut'	:	'elastic',
            'speedIn'		:	600,
            'speedOut'		:	200,
            'overlayShow'	:	false
        });

        if (!g_loadedOnce) {
            setContentInVerticalMiddle();
        }   

        $(".owl-item.active").find("img").resizeToParent("once");
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

     /* BEFORE PJAX SEND HANDLER */

    elementsCallbackStack.addBeforePjaxSendCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        startPageLoader(PAGE_LOADER_FIRST_RGBA);
        startPageLoaderTimer(PAGE_LOADER_SECOND_RGBA, PAGE_LOADER_DELAY);
    });

}( window.teambuildingPage = window.teambuildingPage || {}, jQuery ));