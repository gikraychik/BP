<?php

require_once 'public/themes/default/get-page-name.func.php';

function generate_carousel($page_url, $postfix = "", $group_all = true, $lazyLoad = true)
{
    $page_name = get_page_name($page_url);
    $carousel_data = "";
    $images_path = "public/uploads/";

    if ($postfix != "") {
        $images_array = glob($images_path.$page_name."-".$postfix."-carousel-*.*");
    }
    else {
        $images_array = glob($images_path.$page_name."-carousel-*.*");
    }

    foreach ($images_array as $image) {
        $image_pieces = explode("-", $image);
        $alt = 'Бампербол, Футбол в шарах в СПб, Санкт-Петербург.Новый и веселый вид отдыха в Bubble Park. Незабываемые впечатления!';
        if (count($image_pieces) == 4) {
            $last_pieces = explode(".", $image_pieces[3]);
            $alt = $last_pieces[0];
        }
        $rel = $page_name.'-'.$postfix;
        if ($group_all) {
            $rel = $page_name."-all";
        }
        if ($lazyLoad) {
            $item = '<div class="item">
                        <a class="grouped_elements" rel="'.$rel.'" href="'.$image.'">
                            <img class="lazyOwl" title="Бампербол или Футбол в шарах вместе с Bubble Park!" data-src="'.$image.'" alt="'.$alt.'">
                        </a>
                     </div>';
        }
        else {
            $item = '<div class="item">
                        <a class="grouped_elements" rel="'.$rel.'" href="'.$image.'">
                            <img src="'.$image.'" alt="'.$alt.'">
                        </a>
                     </div>';
        }
        $carousel_data = $carousel_data.$item;
    }
    
    return $carousel_data;
}