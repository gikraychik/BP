/* CAROUSEL PROTOTYPE */

function Carousel(carouselId, isInit) {
    this.id = carouselId;
    this.$carousel = $("#" + carouselId);
    this.carouselPureClone = {};
    this.makeClone();

    if (isInit) this.init();
}

Carousel.prototype.init = function () {
    this.$carousel.owlCarousel({
        navigation: false,
        slideSpeed: 400,
        paginationSpeed: 400,
        singleItem: true,
        autoPlay: 5000,
        stopOnHover: true,
        lazyLoad: true,
        autoHeight: false,
        addClassActive: true,
        afterMove: function ($base, $elem) {
            $elem.find("img").resizeToParent("once");
        },
        afterLazyLoad: function ($base, $elem) {
            $elem.find("img").resizeToParent("once");
        }
    });
};

Carousel.prototype.reinit = function () {
    $("#" + this.id).replaceWith($(this.carouselPureClone));
    this.makeClone();
    this.$carousel = $("#" + this.id);
    this.init();
};

Carousel.prototype.makeClone = function () {
    this.carouselPureClone = document.getElementById(this.id).cloneNode(true);
};

Carousel.prototype.setAfterLoadFunction = function (func) {
    this.$carousel.data("owlCarousel").reinit({
        afterLazyLoad: func
    });
};

Carousel.prototype.reconfigure = function (opts) {
    this.$carousel.data("owlCarousel").reinit(
        opts
    );
};