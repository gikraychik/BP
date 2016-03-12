/* HOME PAGE */

(function( homePage, $, undefined ) {

    /* CONSTANTS */
    const PAGE_NAME = "home";

    /* PRIVATE MEMBERS */
    var m_homeCarouselLeft, m_homeCarouselRight;
    var m_contentLocation;

    /* PRIVATE FUNCTIONS */
    function updatePreDownRowPadding() {
        var rowPreDown = {
            'paddingTop':0,
            'paddingBottom':0
        }
        rowPreDown.paddingBottom = $('html').height() - 
                                   $("#title-big").offset().top - 
                                   $("#title-big").height() - 
                                   $("footer").height();
        rowPreDown.paddingTop = $("#title-big").offset().top -
                                $('#col-up-right').offset().top - 
                                parseInt($(".item").css('height')) - 35;
        $("#row-pre-down").css({
            "margin-bottom": -rowPreDown.paddingBottom,
            "padding-bottom": rowPreDown.paddingBottom,
            "padding-top": rowPreDown.paddingTop,
            "margin-top": -rowPreDown.paddingTop
        });
    }

    /* This function update position of */
    /* elements on page if width is more*/
    /* or less than 991px               */
    function updateContentLocation() {
        if (Modernizr.mq('(max-width: 991px)') && m_contentLocation == "less991px") {
            $("#row-pre-down").css({
                "margin-bottom": 0,
                "padding-bottom": 0,
                "padding-top": 0,
                "margin-top": 0,
                "background-color":"#fff"
            }).find('#title-big').css({
                "color":"#25527f"
            });
            $(".down-list span").css({
                "color":"#25527f"
            });
            $("#row-up")
                .append("<div class=\"col-md-12\" id='col-logo'>" +
                "<img src=\"public/uploads/logo.png\" style=\"display:block; margin: 0 auto;\" class=\"fullwidth-img\" /> " +
                "</div> ")
                .append($("#col-up-center"))
                .append($("#col-pre-down"));
            $("#row-pre-down")
                .append($("#col-up-left"))
                .append($("#col-down"));
            $("#row-down")
                .append($("#col-up-right"));
            m_contentLocation = "more991px";
        } else if (!Modernizr.mq('(max-width: 991px)') ) {
            if (m_contentLocation == "more991px") {
                $("#row-pre-down").css({
                    "background-color":"#25527f"
                })
                $('#title-big').css({
                    "color":"#fff"
                });
                $(".down-list span").css({
                    "color": '#fff'
                });
                $("#row-up").find("#col-logo").remove();
                $("#row-up")
                    .append($("#col-up-left"))
                    .append($("#col-up-center"))
                    .append($("#col-up-right"));
                $("#row-pre-down")
                    .append($("#col-pre-down"));
                $("#row-down")
                    .append($("#col-down"));
                m_contentLocation = "less991px";
            }
            updatePreDownRowPadding();
        }
    }

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
        
        m_contentLocation = "less991px";
        updateContentLocation();
    });

    /* PJAX:END PAGE HANDLER */
    elementsCallbackStack.addPageCb(homeOnLoadCallback);
    function homeOnLoadCallback ()
    {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        /* Make left photo gallery */
        if (typeof  m_homeCarouselLeft == 'undefined') {
        /* if gallery not exist yet */
            m_homeCarouselLeft = new Carousel("carouselLeft", true);
        } else {
            m_homeCarouselLeft.reinit();
        }

        /* Make right photo gallery */
        if (typeof  m_homeCarouselRight == 'undefined') {
        /* if gallery not exist yet */
            m_homeCarouselRight = new Carousel("carouselRight", true);
        } else {
            m_homeCarouselRight.reinit();
        }
        /* Resize gallery photos to parent block */
        $(".owl-item.active").find("img").resizeToParent("once");

        /* Set popup gallery settings */
        $(".grouped_elements").fancybox({
            'transitionIn'	:	'elastic',
            'transitionOut'	:	'elastic',
            'speedIn'		:	600,
            'speedOut'		:	200,
            'overlayShow'	:	false
        });

        /* Load Youtube video */
        $('#video').lazyYT();

        /* If page not loading first (get by ajax) */
        if (!g_loadedOnce) {
            m_contentLocation = "less991px";
            updateContentLocation();

            setContentInVerticalMiddle(true);
        }

        /* Forced call resize window trigger (see ONRESIZE HANDLER below) */
        /* Yes, I know... I am very bad web-developer. But... it's work!*/
        for (var i = 20; i >= 0; i--) {
            $(window).trigger('resize'); 
        };
        setTimeout(function () {
            for (var i = 20; i >= 0; i--) {
                $(window).trigger('resize'); 
            };
        }, 400)
    }

    /* ONRESIZE HANDLER */
    elementsCallbackStack.addOnResizeCb(homeOnResizeCallback);
    function homeOnResizeCallback (winWidth, winHeight) {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        /* Set new size of gallery photos and items */
        $(".owl-item.active").find("img").resizeToParent("once");
        $(".item").width(parseFloat($(".owl-wrapper-outer").width()));
        
        updateContentLocation();

        setContentInVerticalMiddle();
    }

    /* ON CONTENT REPLACE HANDLER */
    elementsCallbackStack.addOnPjaxReplaceCb( function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        var isAnimated = (PAGE_ANIMATION == 'move');
        setContentInVerticalMiddle(isAnimated);
    });

    /* BEFORE AJAX REQUEST SEND HANDLER */
    elementsCallbackStack.addBeforePjaxSendCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        startPageLoader(PAGE_LOADER_FIRST_RGBA);
        startPageLoaderTimer(PAGE_LOADER_SECOND_RGBA, PAGE_LOADER_DELAY);
    });

}( window.homePage = window.homePage || {}, jQuery ));