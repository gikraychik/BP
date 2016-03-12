/* Feedback page */

(function( feedbackPage, $, undefined ) {

    const PAGE_NAME = "feedback";

    const M_VK_COMMENTS_ID = "vk-comments";
    const M_VK_API_ID = 5021856;

    /* PRIVATE FUNCTIONS */

    function updateBoxSize () {
        var box = $(".box");
        if (!isMobile()) {
            box.css({
                "max-height": $(window).height() - $("#navigation").height() - $("footer").height() - 70
            });
        }
        else {
            box.css({
                "max-height": "auto",
                "height": "auto"
            });
        }
    }

    /* PJAX:END PAGE HANDLER */

    elementsCallbackStack.addPageCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        VK.init({
            apiId: M_VK_API_ID,
            onlyWidgets: true
        });

        if ($("#"+M_VK_COMMENTS_ID).find("iframe").length > 0) {
            $("#"+M_VK_COMMENTS_ID).empty();
        }

        // VK API Comments init
        var miniOption = 0;
        if ($(window).width() < 850) miniOption = 1;
        VK.Widgets.Comments(M_VK_COMMENTS_ID,
            {
                autoPublish: 0,
                mini:miniOption,
                pageUrl:'http://bubble-park.ru'
            },
            M_VK_API_ID
        );

        updateBoxSize()
    });

    /* ONRISIZE PAGE HANDLER */

    elementsCallbackStack.addOnResizeCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        updateBoxSize();
    });

    elementsCallbackStack.addBeforePjaxSendCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        startPageLoader(PAGE_LOADER_FIRST_RGBA);
        startPageLoaderTimer(PAGE_LOADER_SECOND_RGBA, PAGE_LOADER_DELAY);
    });

}( window.feedbackPage = window.feedbackPage || {}, jQuery ));