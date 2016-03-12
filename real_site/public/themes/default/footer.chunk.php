</div>
<footer class="footer">
	<div class="container-fluid">
        <div class="col-md-4 phone">
        	<?php echo Block::get("footer-left"); ?>
        </div>
		<div class="col-md-4 ambly">
			<?php echo Block::get("footer-center"); ?>
		</div>
		<div class="col-md-4 social">
			<?php echo Block::get("footer-right"); ?>
		</div>
	</div>
</footer>

<div class="guard" id="guard"></div>

	<!-- JavaScripts -->

    <?php include_once '/public/themes/default/get-page-name.func.php' ?>

    <?php 
    $current_page_name = get_page_name(Url::current());
    if ($current_page_name == 'feedback') {
        echo '<script src="http://vk.com/js/api/openapi.js" type="text/javascript"></script>';
    }
    else {
        echo '<div id="vk_api_transport"></div>';
    }
    ?>

    <script src="http://maps.googleapis.com/maps/api/js" type="text/javascript"></script>

    <?php
    $js_files = [];
    $js_files[] = "public/assets/js/jquery.easing.1.3.js";
    $js_files[] = "public/assets/js/modernizr.custom.50388.js";
    $js_files[] = "public/assets/js/bootstrap.js";
    $js_files[] = "public/themes/default/js/callbacks_stack.js";
    $js_files[] = "public/themes/default/js/main.js";
    $js_files[] = "public/assets/js/jquery.pjax.js";
    $js_files[] = "public/assets/js/jquery.datetimepicker.js";
    $js_files[] = "public/themes/default/js/price.js";
    $js_files[] = "public/themes/default/js/feedback.js";
    $js_files[] = "public/themes/default/js/contact.js";
    $js_files[] = "public/themes/default/js/kids.js";
    $js_files[] = "public/themes/default/js/teambuilding.js";
    $js_files[] = "public/themes/default/js/home.js";
    $js_files[] = "public/themes/default/js/night.js";
    $js_files[] = "public/themes/default/js/content_changer.js";
    $js_files[] = "public/assets/js/owl.carousel.1.js";
    $js_files[] = "public/themes/default/js/carousel_proto.js";
    $js_files[] = "public/themes/default/js/popup_window_proto.js";
    $js_files[] = "public/themes/default/js/form_proto.js";
    $js_files[] = "public/assets/js/jquery.resizeimagetoparent.js";
    $js_files[] = "public/assets/js/jquery.fancybox.js";
    $js_files[] = "public/assets/js/jquery.qtip.js";
    $js_files[] = "public/assets/js/jquery.backstretch.js";
    $js_files[] = "public/assets/js/jquery.flexverticalcenter.js";
    $js_files[] = "public/themes/default/js/description.js";
    $js_files[] = "public/assets/js/velocity.js";
    $js_files[] = "public/assets/js/lazyYT.js";

    if (Monstra::$environment == Monstra::PRODUCTION) {
        for ($i=0; $i < count($js_files); $i++) { 
            $original_file = explode('.js', $js_files[$i]);
            $minified_file = $original_file[0].'.min.js';
            Javascript::add($minified_file, 'frontend', $i); 
        }
        Javascript::load();
    }
    else {
        for ($i=0; $i < count($js_files); $i++) { 
            echo "<script src=\"".$js_files[$i]."\" type=\"text/javascript\"></script>\n";
        }
    }
    ?>  

  </body>
</html>
