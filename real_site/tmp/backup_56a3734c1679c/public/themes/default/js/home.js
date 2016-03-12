/* HOME PAGE */

(function( homePage, $, undefined ) {

    const PAGE_NAME = "home";

    var g_homeCarouselLeft, g_homeCarouselRight;
    var g_contentLocation;

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

    function updateContentLocation() {
        if (Modernizr.mq('(max-width: 991px)') && g_contentLocation == "less991px") {
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
            g_contentLocation = "more991px";
        } else if (!Modernizr.mq('(max-width: 991px)') ) {
            if (g_contentLocation == "more991px") {
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
                g_contentLocation = "less991px";
            }
            updatePreDownRowPadding();
        }
    }

    elementsCallbackStack.addConditionCb(function() {
        if (!($("body").attr("id") == PAGE_NAME)) 
            return true;
        return true;
    });

    /* AFTER CONTENT LOADED HADLER */

    elementsCallbackStack.addAfterPageLoadedCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        g_contentLocation = "less991px";
        updateContentLocation();

    });

    /* PJAX:END PAGE HANDLER */

    elementsCallbackStack.addPageCb(homeOnLoadCallback);
    function homeOnLoadCallback ()
    {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        if (typeof  g_homeCarouselLeft == 'undefined') {
            g_homeCarouselLeft = new Carousel("carouselLeft", true);
        } else {
            g_homeCarouselLeft.reinit();
        }

        if (typeof  g_homeCarouselRight == 'undefined') {
            g_homeCarouselRight = new Carousel("carouselRight", true);
        } else {
            g_homeCarouselRight.reinit();
        }

        $(".owl-item.active").find("img").resizeToParent("once");

        $(".grouped_elements").fancybox({
            'transitionIn'	:	'elastic',
            'transitionOut'	:	'elastic',
            'speedIn'		:	600,
            'speedOut'		:	200,
            'overlayShow'	:	false
        });

        $('#video').lazyYT();

        if (!g_loadedOnce) {
            g_contentLocation = "less991px";
            updateContentLocation();

            setContentInVerticalMiddle(true);
        }

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

        $(".owl-item.active").find("img").resizeToParent("once");
        $(".item").width(parseFloat($(".owl-wrapper-outer").width()));
        
        updateContentLocation();

        setContentInVerticalMiddle();
    }

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

}( window.homePage = window.homePage || {}, jQuery ));