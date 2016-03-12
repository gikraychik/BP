(function( contentChanger, $, undefined ) {

    /* CONSTANTS */
    const EMPTY_PATH_URL_LENGTH = 3;
    window.PAGE_CHANGE_DURATION = 500; //ms
    window.PAGE_ANIMATION = "hide";
    const CONTENT_HEIGHT_CHANGE_DURATION = 500; //ms
    const FIX_HEIGHT_ELEM_ID = "fix-elem";
    const PAGE_EASING = 'easeInOutCirc';
    const LOADER_WRAPPER_ID = "#load";
    window.PAGE_CONTAINER = '#content';


    /* PRIVATE MEMBERS */
    var m_shiftSize = $(window).width();
    var m_pageShift = m_shiftSize;
    var m_lastUrl = getPageUrl();
    var m_isPjaxCalled = false;
    

    /* PRIVATE FUNCTIONS */
    function lockPage() {
        $("#guard").show();
    }

    function unlockPage() {
        $("#guard").hide();
    }

    function getPageName(pageUrl) {
        var url_pieces = pageUrl.split("/");
        var page_name = url_pieces[url_pieces.length - 1];
        if (page_name.length == EMPTY_PATH_URL_LENGTH) {
            page_name = "home"
        }
        return page_name;
    }

    function setActiveLink(pageUrl) {
        var navigationBar = $("#navigation");

        // remove menu .current class
        var oldLink = navigationBar.find("li.active a");
        oldLink.removeClass("current");
        oldLink.parent().removeClass("active");

        // set menu .current class
        var newLink = navigationBar.find("li a[href='" + pageUrl + "']");
        newLink.addClass("current");
        newLink.parent().addClass("active");
    }

    function setPageStyle(pageUrl) {
        // remember last url
        m_lastUrl = pageUrl;

        //set new body id
        var page_name = getPageName(pageUrl);
        $('body').attr("id", page_name);
    }

    elementsCallbackStack.addOnResizeCb(function () {
        m_shiftSize = $(window).width();
    });

    if ($.support.pjax) {
        function changePage (changeContentFunc, direction, newPageUrl) {
            lockPage();
            setActiveLink(newPageUrl);

            var pageHeight = $(document).height() - $("#navigation").outerHeight() - $("footer").outerHeight();
            var pageWidth = $(PAGE_CONTAINER).width();
            var navMarginBottom = parseFloat($("#navigation").css('margin-bottom'));
            var pageMarginBottom = parseFloat($(PAGE_CONTAINER).css('margin-top'));

            $(PAGE_CONTAINER).after("<div id=\"" + FIX_HEIGHT_ELEM_ID + "\"></div>");

            var newMarginBottom = pageMarginBottom - navMarginBottom;
            if (newMarginBottom < 0) newMarginBottom = pageMarginBottom;

            $(PAGE_CONTAINER).css({
                'position':'absolute',
                'width': pageWidth,
                'margin-top': newMarginBottom
            });

            if (PAGE_ANIMATION == 'move') {
                $("body").css({'overflow-x':'hidden'});
                m_pageShift = (direction == 'forward') ?
                    m_shiftSize : -m_shiftSize;
            } else {
                m_pageShift = 0;
            }

            $("#" + FIX_HEIGHT_ELEM_ID).css({
                "height": pageHeight
            });

            $(PAGE_CONTAINER).stop(true, true).velocity({
                    opacity: 0,
                    left: "-="+m_pageShift
                },
                PAGE_CHANGE_DURATION,
                PAGE_EASING,
                function(){
                    setPageStyle(newPageUrl);
                    changeContentFunc();
                }
            )
        }

        // Tag <a> handler
        $('#navigation').find('a').on('click', function(event) {
            m_isPjaxCalled = true;
            event.preventDefault();
            var newPageUrl = $(this).attr('href');
            if (m_lastUrl != newPageUrl) {
                changePage (function () {
                    $.pjax({
                        url: newPageUrl,
                        container: PAGE_CONTAINER
                    });
                }, 'forward', newPageUrl)
            }
        });

        // Navigation handler
        $(window).on('popstate', function(event) {
            // if pAjax really was called
            if (!m_isPjaxCalled) return;

            startPageLoader(PAGE_LOADER_FIRST_RGBA);
            startPageLoaderTimer(PAGE_LOADER_SECOND_RGBA, PAGE_LOADER_DELAY);

            changePage(function () {
                $.pjax.navigation(event)
            }, $.pjax.getNavDirection(event), event.state.url)
        });

        // Process state handlers
        $(document).on('pjax:beforeSend', function(){
            elementsCallbackStack.callAllBeforePjaxSendCb();
        });

        $(document).on('pjax:end', function() {

            resetContentStyles();

            elementsCallbackStack.callAllAfterPageLoadedCb();

            while (!elementsCallbackStack.callAllConditionCb()) {}

            if (PAGE_ANIMATION == "move") {
                $(PAGE_CONTAINER)
                .css({'left':m_pageShift})
                .velocity({
                    left: "0",
                    opacity: 1
                }, PAGE_CHANGE_DURATION, PAGE_EASING);

                $("#" + FIX_HEIGHT_ELEM_ID).velocity({
                    height: $(PAGE_CONTAINER).outerHeight()
                }, CONTENT_HEIGHT_CHANGE_DURATION, PAGE_EASING, function () {
                    $("body").css({'overflow-x':'visible'});
                    $(PAGE_CONTAINER).css({
                        'position':'static',
                        'width':'auto'
                    });
                    $("#" + FIX_HEIGHT_ELEM_ID).css({'height':'0'}).remove();
                    elementsCallbackStack.callAllOnPjaxReplaceCb();
                });

            } else {
                $("#" + FIX_HEIGHT_ELEM_ID).velocity({
                    height: $(PAGE_CONTAINER).outerHeight()
                }, CONTENT_HEIGHT_CHANGE_DURATION, PAGE_EASING, function () {
                    $("body").css({'overflow-x':'visible'});
                    $(PAGE_CONTAINER).css({
                        'position':'static',
                        'width':'auto'
                    });
                    $("#" + FIX_HEIGHT_ELEM_ID).css({'height':'0'}).remove();

                    setTimeout(function() {
                        elementsCallbackStack.callAllOnPjaxReplaceCb();
                        $(PAGE_CONTAINER).velocity({
                            opacity: 1
                        }, PAGE_CHANGE_DURATION, PAGE_EASING);
                    }, 100);
                });
            }

            elementsCallbackStack.callAllPagesCb();

            //hide loader
            stopPageLoaderTimer();

            unlockPage();
        });

        $(document).on('pjax:form:end', function() {
            elementsCallbackStack.callAllFormsCb();

            //hide loader
            stopPageLoaderTimer();

            unlockPage();
        });
    }

}( window.contentChanger = window.contentChanger || {}, jQuery ));