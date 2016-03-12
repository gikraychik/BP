<?php

/**
 * Return page name by page url.
 *
 * @param $current_url Page url.
 * @param $pages All site pages
 *
 * @return string Page name.
 */

include_once('public/themes/default/pages.defines.php');

function get_page_name($current_url)
{
    $PAGE_404_TEMPLE = "usual";

    global $G_PAGES;
    // array of all existing pages
    $page_names_array = $G_PAGES;

    // get path of page from url
    $full_current_page_path = parse_url($current_url, PHP_URL_PATH);
    $current_page_name = "";
    $current_page_path_pieces = explode("/", $full_current_page_path);
    $current_page_path = "/" . $current_page_path_pieces[count($current_page_path_pieces) - 1];

    // if home page
    if ($current_page_path == "/") {
        $current_page_name = "home";
    } else {
        // found page name in array of names
        foreach ($page_names_array as $name) {
            $page = "/" . $name;
            if ($page == $current_page_path) {
                $current_page_name = $name;
                break;
            }
        }
    }
    if ($current_page_name == "") {
        $current_page_name = $PAGE_404_TEMPLE;
    }

    return $current_page_name;
}

?>