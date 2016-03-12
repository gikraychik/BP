<?php

/**
 * Return page name by page url.
 *
 * @param $current_url Page url.
 *
 * @return string Page name.
 */
function get_page_name($current_url)
{
    $PAGE_404_TEMPLE = "usual";

    // array of all existing pages
    $page_names_array = array("home", "kids", "descr", "price", "night", "contact", "feedback", "teambuilding");

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