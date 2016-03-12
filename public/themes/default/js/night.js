/* NIGHT PAGE */

(function( nightPage, $, undefined ) {

    const PAGE_NAME = "night";
    const PAGE_ID ="#"+PAGE_NAME;

    var m_popupWindowRegistration;
    var m_registrationForm;

    var m_popupWindowTeams;
    var m_popupWindowCalendar;
    var m_popupWindowArchive;

    var m_pageLoader = true;

    var isNeedVerticalMiddle = true;

    /* PJAX:END PAGE HANDLER */

    elementsCallbackStack.addPageCb(nightOnLoadCallback);
    function nightOnLoadCallback () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        /* Initialize popupWindowRegister */
        if (typeof m_popupWindowRegistration == 'undefined') {
            m_popupWindowRegistration = new PopupWindow("#register-form-popup", "#register-button", PAGE_ID);
            m_popupWindowRegistration.init();
        }

        /* Initialize registrationForm */
        if (typeof m_registrationForm == 'undefined') {
            m_registrationForm = new Form("#register-form");
            m_registrationForm.afterSubmitFunctions.push(m_popupWindowRegistration.close.bind(m_popupWindowRegistration));
            //set onhide popupWindowRegister callback
            m_popupWindowRegistration.functionsOnShow.push(function () {
                m_registrationForm.$resultContainer.fadeOut(10);
            });
            m_popupWindowRegistration.functionsOnHide.push(function () {
                m_registrationForm.$resultContainer.fadeOut();
            });
        } else {
            m_registrationForm.reinit();
        }

        m_registrationForm.initDateFields();

        /* Initialize popupWindowTeams */
        if (typeof m_popupWindowTeams == 'undefined') {
            m_popupWindowTeams = new PopupWindow("#teams-popup", "#teams-open-button", PAGE_ID);
            m_popupWindowTeams.init();
            m_popupWindowTeams.functionsOnHide.push(function () {
                m_popupWindowTeams.$popup.find("#fake-close").trigger('click');
            })
        }

        /* Initialize popupWindowCalendar */
        if (typeof m_popupWindowCalendar == 'undefined') {
            m_popupWindowCalendar = new PopupWindow("#calendar-popup", "#calendar-open-button", PAGE_ID);
            m_popupWindowCalendar.init();
        }

        /* Initialize popupWindowArchive */
        if (typeof m_popupWindowArchive == 'undefined') {
            m_popupWindowArchive = new PopupWindow("#archive-popup", "#archive-open-button", PAGE_ID);
            m_popupWindowArchive.init();
        }

        $(".teams-list .team").each(function (index) {
            var $team = $(this);
            var $team_descr = $("#team-descr" + (index+1));
            $team.on( "click", function () {
                $(".teams-list").fadeOut(100, function () {
                    $team_descr.fadeIn(200);
                    $("#fake-close").fadeIn(100);
                });
            });
        });

        $("#fake-close").on( "click", function () {
            $(".team-descr").fadeOut(100, function () {
                $(".teams-list").delay(100).fadeIn(200);
            });
            $(this).fadeOut(100);
        });

        $("#calendar").on('click', '.navigation a', function(event) {
            event.preventDefault();
            stopPageLoader();
            $("#calendar").find('table').wait();
            m_pageLoader = false;
        });

        qtipInit();
        calendarInit();
        archiveInit();

        if (!g_loadedOnce) {
            setContentInVerticalMiddle();
        }
    }

    elementsCallbackStack.addOnPjaxReplaceCb( function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        var isAnimated = (PAGE_ANIMATION == 'move');
        setContentInVerticalMiddle(isAnimated);
    });

    elementsCallbackStack.addFormCb(registrationFormSubmitedCallback);
    function registrationFormSubmitedCallback () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        /* Form answer handler */
        m_registrationForm.afterSubmit();

        /* After change calendar page */
        qtipInit();
        calendarInit();
        $("#calendar").find('table').unwait();
        m_pageLoader = true;
    }

    elementsCallbackStack.addBeforePjaxSendCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        startPageLoader(PAGE_LOADER_FIRST_RGBA);
        startPageLoaderTimer(PAGE_LOADER_SECOND_RGBA, PAGE_LOADER_DELAY);
    });

    function qtipInit () {
        $('.hasTooltip').each(function() {
            $(this).qtip({
                content: {
                    text: $(this).next('div').html()
                },
                style: {
                    classes: 'qtip-bootstrap qtip-shadow text qtip-night-page'
                },
                position: {
                    my: 'top left',
                    at: 'bottom center',
                    adjust: {
                        method: 'shift shift'
                    },
                    viewport: $(document)
                }
            });
        });
        
        var position = {
            my: 'right center',
            at: 'left center'
        };
        if (Modernizr.mq('(max-width: 1250px)')) {
            position = {
                my: 'bottom center',
                at: 'top center'
            };
        }
        $('.round-night-button').each(function() {
            $(this).qtip({
                content: {
                    text: $(this).next('div').html()
                },
                style: {
                    classes: 'qtip-bootstrap qtip-shadow text'
                },
                position: {
                    my: position.my,
                    at: position.at,
                    adjust: {
                        method: 'shift shift'
                    },
                    viewport: $(document)
                }
            });
        });
    }

    function calendarInit () {
        $('.tournament-date').on('click', function () {
            var date = $(this).find("a").next(".hidden").find('#date').html();
            m_registrationForm.$form.find('#date-field').val(date);
            m_popupWindowCalendar.close();
            m_popupWindowRegistration.open();
        });
    }

    function archiveInit () {
        $(".archive").find(".teams-list").each(function() {
            $(this).find('li').each(function() {
                $(this).on('click', function(event) {
                    var team = getTeamByName($(this).html());
                    m_popupWindowArchive.close();
                    m_popupWindowTeams.open();
                    team.trigger('click');
                });
            });
        });
    }

    function getTeamByName (name) {
        var teams = $(".team").toArray();
        for (var i = teams.length - 1; i >= 0; i--) {
            if ($(teams[i]).find("#name").html() == name)
                return $(teams[i]);
        }
    }

    elementsCallbackStack.addOnResizeCb(onResizeNightCallback);
    function onResizeNightCallback() {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        setContentInVerticalMiddle();
    }

}( window.nightPage = window.nightPage || {}, jQuery ));