<?php require_once 'public/themes/default/generate_carousel.func.php'; ?>
<div class="container-fluid content">
<div class="row row-up" id="row-up">
<div class="col-md-3" id="col-up-left">
<div id="carouselLeft" class="owl-carousel owl-theme box">
<?php echo generate_carousel(Url::current(), "left") ?>
</div>
</div>
<div class="col-md-6" id="col-up-center">
<div class="box">
<div id="video" class="lazyYT video" data-youtube-id="Yk1lv2onjpQ" data-width="100%"> </div>
</div>
</div>
<div class="col-md-3"  id="col-up-right">
<div id="carouselRight" class="owl-carousel owl-theme box">
<?php echo generate_carousel(Url::current(), "right") ?>
</div>
</div>
</div>
<div class="row row-pre-down" id="row-pre-down">
<div class="col-md-12" id="col-pre-down">
<span class="title-big" id='title-big'>Футбол в шарах</span>
</div>
</div>
<div class="row row-down" id="row-down">
<div class="col-md-12 down-list" id="col-down">
<span>Активный отдых | </span>
<span>Безопасное развлечение | </span>
<span>От 300р за человека | </span>
<span>Бесплатная фотосъемка</span>
</div>
</div>
</div>