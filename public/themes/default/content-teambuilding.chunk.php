<?php require_once 'public/themes/default/generate_carousel.func.php'; ?>

<div class="container content">
    <div class="row">
        <div class="col-md-8">
            <div id="carousel" class="owl-carousel owl-theme box">
                <?php echo generate_carousel(Url::current()) ?>
            </div>
        </div>
        <div class="col-md-4">
            <div class="box">
                <?php echo Site::content(); ?>
            </div>
        </div>
    </div>
</div>