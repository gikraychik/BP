/*global jQuery */
/*!
 * FlexVerticalCenter.js 1.0
 *
 * Copyright 2011, Paul Sprangers http://paulsprangers.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Fri Oct 28 19:12:00 2011 +0100
 */
(function ($) {

    $.fn.flexVerticalCenter = function (options) {
        var settings = $.extend({
            verticalOffset: 0,            // the number of pixels to offset the vertical alignment by
            parentSelector: null,         // a selector representing the parent to vertically center this element within
            debounceTimeout: 25,          // a default debounce timeout in milliseconds
            deferTilWindowLoad: false,     // if true, nothing will take effect until the $(window).load event
            setOnResize: true,
            excludeSpace: 0,
            parentHeight: 0,
            animate: false
        }, options || {});

        return this.each(function () {
            var $this = $(this); // store the object
            var debounce;

            // recalculate the distance to the top of the element to keep it centered
            var resizer = function () {

                var parentHeight;
                if (settings.parentHeight){
                    parentHeight = settings.parentHeight;
                } else {
                    parentHeight = (settings.parentSelector && $this.parents(settings.parentSelector).length) ?
                        $this.parents(settings.parentSelector).first().height() : $this.parent().height();
                }

                if (settings.animate){
                    $this.velocity({
                        marginTop: ( ( ( parentHeight - settings.excludeSpace - $this.height() ) / 2 ) + parseInt(settings.verticalOffset) )
                    });
                } else {
                    $this.css({
                        "margin-top": ( ( ( parentHeight - settings.excludeSpace - $this.height() ) / 2 ) + parseInt(settings.verticalOffset) )
                    });
                }
            };

            // Call on resize. Opera debounces their resize by default.
            if (settings.setOnResize) {
                $(window).resize(function () {
                    clearTimeout(debounce);
                    debounce = setTimeout(resizer, settings.debounceTimeout);
                });
            }

            if (!settings.deferTilWindowLoad) {
                // call it once, immediately.
                resizer();
            }

            // Call again to set after window (frames, images, etc) loads.
            //$(window).load(function () {
            //    resizer();
            //});

        });

    };

})(jQuery);