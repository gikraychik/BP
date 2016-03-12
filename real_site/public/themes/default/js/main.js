var g_loadedOnce = false;
var g_universalGlobalFlac = true;
var g_universalGlobalCounter = 0;
var g_loaderTimer;

const PAGE_LOADER_FIRST_RGBA = '0, 0, 0, 0';
const PAGE_LOADER_SECOND_RGBA = '0, 0, 0, 0.8';
const PAGE_LOADER_DELAY = 1300;

function getPageUrl () {
    return window.location.protocol + "//" + window.location.host + window.location.pathname
}

function isMobile () {
    var isiOS = /iPad|iPhone|iPod/.test(navigator.platform);
    var isAndroid = /(android)/i.test(navigator.userAgent);

    return window.screen.width < 640 || isiOS || isAndroid;
}

function getContentHeight () {
    return $(document).height() - $("footer").outerHeight() + $("#navigation").outerHeight();
}

function setContentInVerticalMiddle(isAnimateActive) {
    if (!isAnimateActive) isAnimateActive = false;

    var contentSize = getContentHeight();
    if (contentSize > $(PAGE_CONTAINER).outerHeight()) {
        $(PAGE_CONTAINER).flexVerticalCenter({
            parentSelector: document,
            parentHeight: $(document).height(),
            setOnResize:false,
            excludeSpace: $("footer").outerHeight() + $("#navigation").outerHeight(),
            animate:isAnimateActive
        });
    } else {
         $(PAGE_CONTAINER).css({"margin-top":0});
    }
}

function resetContentStyles() {
    $('#content').css({"margin-top":"0"});
}

function getImageSize ($obj) {
    var img = $obj; // Get my img elem
    var pic_real_width, pic_real_height;
    $("<img/>") // Make in memory copy of image to avoid css issues
        .attr("src", $(img).attr("src"))
        .load(function() {
            pic_real_width = this.width;   // Note: $(this).width() will not
            pic_real_height = this.height; // work for in memory images.
        });
    return {width:pic_real_width, height:pic_real_height};
}

function startPageLoaderTimer(backgroundRGBA, delay) {
    g_loaderTimer = setTimeout(function () {
        startPageLoader(backgroundRGBA);
    }, delay);
}

function stopPageLoaderTimer() {
    clearTimeout(g_loaderTimer);
    setTimeout(stopPageLoader, 500);
}

/* ON RESIZE HANDLER */
$( window ).resize(function() {
    elementsCallbackStack.callAllOnResizeCb($(window).innerWidth(), $(window).innerHeight());
});