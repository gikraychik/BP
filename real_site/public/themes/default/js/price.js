/* PRICE PAGE */

(function( pricePage, $, undefined ) {

    const PAGE_NAME = "price";
    const PAGE_ID = "#"+PAGE_NAME;

    const MAX_SALE = 30;
    const CLASS_ON_CLICKED = "checked-sale";
    const CLASS_DISABLED = "disabled-sale";
    const SELECTOR_ON_CLICKED = "."+CLASS_ON_CLICKED;
    const SALE_SELECTOR = ".item a";

    /* DEFINITION OF GLOBAL VARS */

    var g_priceCalc;
    var g_popupWindowPrice;
    var g_popupWindowInfo;
    var g_popupWindowPromo;
    var g_orderForm;
    var g_promoForm;

    var m_isPageLoad = true;

    /* PJAX:END PAGE HANDLER */
    elementsCallbackStack.addPageCb(priceOnLoadCallback);
    function priceOnLoadCallback ()
    {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        /* Initialize priceCalc */
        var salesList = $(SALE_SELECTOR).map(function (i, el) {
            return new Sale($(el), i);
        });
        g_priceCalc = new PriceCalc(salesList);

        g_priceCalc.updateLocation($(window).width());

        /* Update all */
        for (var i = g_priceCalc.saleList.length - 1; i >= 0; i--) {
            g_priceCalc.updateIncludes(g_priceCalc.saleList[i]);
            g_priceCalc.updateExcludes(g_priceCalc.saleList[i]);
        }
        g_priceCalc.updatePrice();

        /* Initialize popupWindowPrice */
        if (typeof g_popupWindowPrice == 'undefined') {
            g_popupWindowPrice = new PopupWindow("#popup", "#order", PAGE_ID);
            g_popupWindowPrice.init();
        }

        /* Initialize orderForm */
        if (typeof g_orderForm == 'undefined') {
            g_orderForm = new Form("#order-form");
            g_orderForm.afterSubmitFunctions.push(g_popupWindowPrice.close.bind(g_popupWindowPrice));
            g_popupWindowPrice.functionsOnHide.push(function () {
                g_orderForm.$resultContainer.fadeOut();
            });
        } else {
            g_orderForm.reinit(g_orderForm.formId);
        }
        g_orderForm.initDateFields();
        g_orderForm.initTimeFields();

        /* Initialize popupInfo */
        if (typeof g_popupWindowInfo == 'undefined') {
            g_popupWindowInfo = new PopupWindow("#popup-info", "#info-button", PAGE_ID);
            g_popupWindowInfo.init();
        }

        /* Initialize popupPromo */
        if (typeof g_popupWindowPromo == 'undefined') {
            g_popupWindowPromo = new PopupWindow("#popup-promo", ".promo-button", PAGE_ID);
            g_popupWindowPromo.init();
        }

        /* Initialize pormoForm */
        if (typeof g_promoForm == 'undefined') {
            g_promoForm = new Form("#promo-form");

            g_promoForm.afterSubmitFunctions.push(function () {
                g_priceCalc.promo.isActive = true;
                g_priceCalc.promo.checkPromo(g_priceCalc.getSaleByDomElem($(".promo-button")));
                g_priceCalc.promo.isUsed = true;
                g_priceCalc.updatePrice();
            }.bind(g_priceCalc));

            g_promoForm.beforeSubmitFunctions.push(function () {
                g_promoForm.$form.find("button").wait();
                m_isPageLoad = false;
            }.bind(g_priceCalc))

            g_promoForm.afterSubmitFunctions.push(g_popupWindowPromo.close.bind(g_popupWindowPromo));

            g_popupWindowPromo.functionsOnHide.push(function () {
                g_promoForm.$resultContainer.fadeOut();
            });
        } else {
            g_promoForm.reinit(g_promoForm.formId);
        }

        $('.hasTooltip').each(function() {
            $(this).qtip({
                content: {
                    text: $(this).next('div').html()
                },
                style: {
                    classes: 'qtip-bootstrap qtip-shadow text'
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    adjust: {
                        method: 'shift shift'
                    },
                    viewport: $(document)
                }
            });
        });

        if (!g_loadedOnce) {
            setContentInVerticalMiddle();
        }
    }

    elementsCallbackStack.addOnPjaxReplaceCb( function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        var isAnimated = (PAGE_ANIMATION == 'move');
        setContentInVerticalMiddle(isAnimated);
    });

    /* PJAX:END:FORM HANDLER */

    elementsCallbackStack.addFormCb(orderFormSubmitedCallback);
    function orderFormSubmitedCallback () {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        /* Form answer handler */
        g_orderForm.afterSubmit();
        g_promoForm.afterSubmit();

        g_promoForm.$form.find("button").unwait();
        m_isPageLoad = true;
    }

    /* ONRESIZE HANDLER */

    elementsCallbackStack.addOnResizeCb(priceOnResizeCallback);
    function priceOnResizeCallback (winWidth, winHeight) {
        if (!($("body").attr("id") == PAGE_NAME)) return;

        g_priceCalc.updateLocation(winWidth);

        setContentInVerticalMiddle();
    }

     /* BEFORE PJAX SEND HANDLER */

    elementsCallbackStack.addBeforePjaxSendCb(function () {
        if (!($("body").attr("id") == PAGE_NAME)) return;
        
        if (m_isPageLoad) {
            startPageLoader(PAGE_LOADER_FIRST_RGBA);
            startPageLoaderTimer(PAGE_LOADER_SECOND_RGBA, PAGE_LOADER_DELAY);
        }

    });

    /* SALE CALCULATOR HANDLERS */

    $(document).on("click", PAGE_ID + " .item a", function(event){
        event.preventDefault();
        var elem = $(this);
        var sale = g_priceCalc.getSaleByDomElem(elem);

        if (sale.isDisabled) return;

        if (!sale.isSelected) {
            sale.select();
        } else {
            sale.unselect();
        }

        g_priceCalc.saleList.each(function() {
            g_priceCalc.updateIncludes(this);
            g_priceCalc.updateExcludes(this);
            g_priceCalc.udpateOverflowSales();
        });

        g_priceCalc.updatePrice();

        var text = new Form();
    });

    $(document).on("click", "input[name=hours]", function(){
        for (var i = g_priceCalc.saleList.length - 1; i >= 0; i--) {
            g_priceCalc.updateIncludes(g_priceCalc.saleList[i]);
        }
        g_priceCalc.udpateOverflowSales();
        g_priceCalc.updatePrice();
    });

    /* PRICE CALCULATOR PROTOTYPE */

    function PriceCalc (saleList) {
        this.saleList = saleList;
        this.hours = new Hours();
        this.promo = new Promo();
        this.fixPrice = parseInt($("#fix-price").html());
        this.$elem = $("#price-calc");
        this.location = "down";
    }

    PriceCalc.prototype.getSaleByDomElem = function (domElem) {
        return this.saleList[this.getSaleIndexByDomElem(domElem)];
    };

    PriceCalc.prototype.getSaleIndexByDomElem = function (domElem) {
        var domElemParent = domElem.parent();
        return $("."+domElemParent.attr("class")).index(domElemParent);
    };

    PriceCalc.prototype.getSaleById = function (saleId) {
        for (var i = this.saleList.length - 1; i >= 0; i--) {
            if (this.saleList[i].id == saleId) {
                return this.saleList[i];
            }
        }
    };

    PriceCalc.prototype.checkHours = function(sale, hoursId) {
        var hoursIdSlice = hoursId.split("#");
        var condition = hoursIdSlice[1].split("-")[0];
        var value = parseInt(hoursIdSlice[1].split("-")[1]);

        if (condition == "more") {
            if (this.hours.getValue() < value ) {
                sale.disableBy(hoursId);
            } else {
                sale.enableBy(hoursId)
            }
        }
        else if (condition == "less") {
            if (this.hours.getValue() > value ) {
                sale.disableBy(hoursId);
            } else {
                sale.enableBy(hoursId)
            }
        }
    };

    PriceCalc.prototype.updateIncludes = function (currentSale) {
        if (currentSale.includes.length > 0) {
            for (var i = currentSale.includes.length - 1; i >= 0; i--) {

                /* if hours dependence */
                if ( this.hours.isHoursId(currentSale.includes[i]) ) {
                    this.checkHours(currentSale, currentSale.includes[i]);
                    continue;
                }

                /* if promo dependence */
                if ( this.promo.isPromoId(currentSale.includes[i])) {
                    if (!this.promo.isUsed){
                        if (!currentSale.isDisabled) {
                            this.promo.setPromoHandler(currentSale);
                        } else {
                            this.promo.removePromoHandler(currentSale);
                        }
                        this.promo.checkPromo(currentSale);
                    }
                    continue;
                }

                /* if another sale dependence */
                var includedSale = this.getSaleById(currentSale.includes[i]);
                if (!includedSale.isSelected) {
                    currentSale.disableBy(includedSale.index);
                } else {
                    currentSale.enableBy(includedSale.index);
                }
            }
        }
    };

    PriceCalc.prototype.updateExcludes = function(currentSale) {
        if (currentSale.excludes.length > 0) {
            for (var i = currentSale.excludes.length - 1; i >= 0; i--) {
                var excludedSale = this.getSaleById(currentSale.excludes[i]);
                if (currentSale.isSelected) {
                    excludedSale.disableBy(currentSale.index);
                } else {
                    excludedSale.enableBy(currentSale.index);
                }
            }
        }
    };

    PriceCalc.prototype.udpateOverflowSales = function() {
        var overflowId = "overflow";

        for (var i = this.saleList.length - 1; i >= 0; i--) {
            if ( this.isSaleMax(this.saleList[i]) && !this.saleList[i].isSelected ) {
                this.saleList[i].disableBy(overflowId);
            } else {
                this.saleList[i].enableBy(overflowId);
            }
        }
    };

    PriceCalc.prototype.isSaleMax = function(sale) {
        var customSaleValue = sale.value + this.getSalesSum();
        return customSaleValue > MAX_SALE;
    };

    PriceCalc.prototype.getSalesSum = function() {
        var saleSum = 0;
        for (var i = this.saleList.length - 1; i >= 0; i--) {
            if (this.saleList[i].isSelected) {
                saleSum += this.saleList[i].value;
            }
        }
        return saleSum > MAX_SALE ? MAX_SALE : saleSum;
    };

    PriceCalc.prototype.getSum = function() {
        var sale = this.getSalesSum() / 100;
        var hours = this.hours.getValue();
        return Math.round(this.fixPrice * hours - sale * this.fixPrice * hours);
    };

    PriceCalc.prototype.updatePrice = function() {
        var	sum = this.getSum();
        var sale = this.getSalesSum();
        var hours = this.hours.getValue();

        $(PAGE_ID + " #sum").html(sum);
        $(PAGE_ID + " #sum-field").val(sum);

        $(PAGE_ID + " #sum-sale").html(sale);
        $(PAGE_ID + " #sale-field").val(sale);

        $(PAGE_ID + " #mult").html(hours);
        $(PAGE_ID + " #hours-field").val(hours);

        var selectedSales = "";
        var length = $(SELECTOR_ON_CLICKED).length;
        $(SELECTOR_ON_CLICKED).each(function (i) {
            selectedSales += $(this).parent().children("span").html() + (length != i + 1 && length != 1 ? ", " : ".");
        });
        $(PAGE_ID + " #checked-sales-field").val(selectedSales.toLowerCase());
    };

    PriceCalc.prototype.updateLocation = function (winWidth) {
        if (Modernizr.mq('(max-width: 1200px)') && g_priceCalc.location == "down") {
            g_priceCalc.moveUp();
            g_priceCalc.location = "up";
        } else if (!Modernizr.mq('(max-width: 1200px)') && g_priceCalc.location == "up") {
            g_priceCalc.moveDown();
            g_priceCalc.location = "down";
        }
    };

    PriceCalc.prototype.moveUp = function () {
        $("#price-calc-up").append(this.$elem);
    };

    PriceCalc.prototype.moveDown = function () {
        $("#price-calc-down").append(this.$elem);
    };

    /* SALE PROTOTYPE */

    function Sale (saleElem, index) {
        this.index = index;
        this.id = "";
        this.sale = saleElem;
        this.includes = [];
        this.excludes = [];
        this.saleParent = this.sale.parent();
        this.disabledBy = [];
        this.isSelected = false;
        this.isDisabled = false;
        this.value = parseInt(this.sale.find("#sale").html());

        var saleId = this.saleParent.attr("id");
        if (saleId) {
            this.id = saleId;
        }

        var includesStr = this.saleParent.attr("includes");
        if (includesStr) {
            this.includes = includesStr.split(" ");
        }

        var excludesStr = this.saleParent.attr("excludes");
        if (excludesStr) {
            this.excludes = excludesStr.split(" ");
        }
    }

    Sale.prototype.disable = function() {
        this.unselect();
        this.sale.addClass(CLASS_DISABLED);
        this.isDisabled = true;
    };

    Sale.prototype.disableBy = function(disablerId) {
        this.disable();
        if ( !this.isDisabledBy(disablerId) ) {
            this.disabledBy.push(disablerId);
        }
    };

    Sale.prototype.isDisabledBy = function(disablerId) {
        var index = $.inArray(disablerId, this.disabledBy);
        return index > -1;
    };

    Sale.prototype.popDisable = function(disablerId) {
        var index = $.inArray(disablerId, this.disabledBy);
        if (index > -1) {
            this.disabledBy.splice(index, 1);
        }
    };

    Sale.prototype.enable = function() {
        this.sale.removeClass(CLASS_DISABLED);
        this.isDisabled = false;
    };

    Sale.prototype.enableBy = function(enablerId) {
        if ( this.isDisabledBy(enablerId) ) {
            this.popDisable(enablerId);
            if (this.disabledBy.length == 0) {
                this.enable();
            }
        }
    };

    Sale.prototype.select = function() {
        this.sale.addClass(CLASS_ON_CLICKED);
        this.isSelected = true;
    };

    Sale.prototype.unselect = function() {
        this.sale.removeClass(CLASS_ON_CLICKED);
        this.isSelected = false;
    };

    /* HOURS PROTOTYPE */

    function Hours () {

    }

    Hours.prototype.getValue = function(id) {
        return $('input[name=hours]:checked').val();
    };

    Hours.prototype.isHoursId = function(id) {
        var idPieces = id.split("#");
        return idPieces.length > 1;
    };

    /* PROMO PROTOTYPE */

    function Promo () {
        this.isUsed = false;
        this.isActive = false;
    }

    Promo.prototype.isPromoId = function (id) {
        return id == "promo";
    };

    Promo.prototype.checkPromo = function (sale) {
        if (this.isActive) {
            sale.select();
            this.removePromoHandler(sale);
        } else {
            sale.unselect();
        }
    };

    Promo.prototype.setPromoHandler = function (sale) {
        if (!sale.sale.hasClass("promo-button")) {
            sale.sale.addClass("promo-button");
        }
    };

    Promo.prototype.removePromoHandler = function (sale) {
        if ( sale.sale.hasClass("promo-button") ) {
            sale.sale.removeClass("promo-button");
        }
    }


}( window.pricePage = window.pricePage || {}, jQuery ));