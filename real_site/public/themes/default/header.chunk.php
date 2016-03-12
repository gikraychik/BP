<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-dns-prefetch-control" content="on">
    <link rel="dns-prefetch" href="<?php echo Site::url(); ?>" />
    <link rel="dns-prefetch" href="//www.google-analytics.com" />
    
    <title><?php echo Site::name() . ' - ' . Site::title(); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo Site::description(); ?>">
    <meta name="keywords" content="<?php echo Site::keywords(); ?>">
    <meta name="robots" content="<?php echo Page::robots(); ?>">

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- Open Graph Protocol -->
    <meta property="og:site_name" content="<?php echo Site::name(); ?>">
    <meta property="og:url" content="<?php echo Url::current(); ?>">
    <meta property="og:title" content="<?php echo Site::title(); ?> | <?php echo Site::name(); ?>">

    <!-- Google+ Snippets -->
    <meta itemprop="url" content="<?php echo Url::current(); ?>">
    <meta itemprop="name" content="<?php echo Site::title(); ?> | <?php echo Site::name(); ?>">

    <!-- Styles -->

    <?php

    $assets_css_path = "public/assets/css/";
    $theme_css_path = "public/themes/default/css/";
    $css_files = [];

    $css_bootstrap = "public/assets/css/bootstrap.min.css";
    $css_default = "public/themes/default/css/default.css";

    echo "<link rel=\"stylesheet\" href=\"".$css_bootstrap."\" type=\"text/css\" />\n";
    if (Monstra::$environment == Monstra::PRODUCTION) {
        Stylesheet::add($css_default, 'frontend', count($css_files));
        for ($i=0; $i < count($css_files); $i++) { 
            Stylesheet::add($css_files[$i], 'frontend', $i);
        }
    }
    else {
        Stylesheet::add($css_default, 'frontend', count($css_files));
        for ($i=0; $i < count($css_files); $i++) {
            echo "<link rel=\"stylesheet\" href=\"".$css_files[$i]."\" type=\"text/css\" />\n";
        }
    }
    Stylesheet::load();

    ?>

    <?php Action::run('theme_header'); ?>

    <script src="public/assets/js/jquery.min.js" type="text/javascript"></script>
    <script src="public/assets/js/jquery.wait-overlay.min.js" type="text/javascript"></script>

    <script type="text/javascript">
     function downloadJSAtOnload() {
        var elementsUrls = [];
        elementsUrls.push("//vk.com/js/api/openapi.js");

        for (var i = elementsUrls.length - 1; i >= 0; i--) {
            var element = document.createElement("script");
            element.src = elementsUrls[i];
            element.type = "text/javascript";
            element.async = true;
            document.getElementById("vk_api_transport").appendChild(element);
        }
     }

     if (window.addEventListener)
        window.addEventListener("load", downloadJSAtOnload, false);
     else if (window.attachEvent)
        window.attachEvent("onload", downloadJSAtOnload);
     else
        window.onload = downloadJSAtOnload;
    </script>

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav-icons -->
    <link rel="icon" href="<?php echo Site::url(); ?>/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="<?php echo Site::url(); ?>/favicon.ico" type="image/x-icon">
  </head>

  