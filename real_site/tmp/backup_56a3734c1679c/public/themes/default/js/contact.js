/* Contact page */

(function( contactPage, $, undefined ) {

    const PAGE_NAME = "contact";
    const M_MAPS_DOM_ELEM_ID = "googleMap";
    const M_MAPS_ADRESS = "ул. Степана Разина, 9, Санкт-Петербург, Россия";

    // Create Google Maps API obj
    var M_MAPS_COORDS;
    var m_gMap;

    /* PJAX:END PAGE HANDLER */

    elementsCallbackStack.addPageCb(contactOnLoadCallback);
    function contactOnLoadCallback () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        if (typeof m_gMap == "undefined") {
            M_MAPS_COORDS = new google.maps.LatLng(59.912451, 30.266154);
            m_gMap = new GMap(M_MAPS_COORDS, M_MAPS_ADRESS, M_MAPS_DOM_ELEM_ID);
        }

        // Init gMap obj
        m_gMap.init();

        if (!g_loadedOnce) {
            setContentInVerticalMiddle();
        }
    }

    elementsCallbackStack.addOnResizeCb(contactOnResizeCallback);
    function contactOnResizeCallback (winWidth, winHeight) {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        m_gMap.updateCenter();
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

    /* GOOGLE MAP PROTOTYPE */

    function GMap (gMapsCoords, gMapsAdress, gMapsDomElemId) {
        this.coords = gMapsCoords;
        this.adress = gMapsAdress;
        this.domElemId = gMapsDomElemId;
        this.map = {};
        this.markers = {};
        this.isInit = false;
    }

    GMap.prototype.init = function() {
        var mapProp = {
            center:this.coords,
            zoom:17,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(document.getElementById(this.domElemId),mapProp);

        var marker = new google.maps.Marker({
            position:this.coords
        });

        marker.setMap(this.map);

        var infowindow = new google.maps.InfoWindow({
            content:this.adress
        });

        infowindow.open(this.map, marker);

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(this.map, marker);
        });

        this.isInit = true;
    };

    GMap.prototype.updateCenter = function() {
        this.map.setCenter(this.coords);
    };

}( window.contactPage = window.contactPage || {}, jQuery ));