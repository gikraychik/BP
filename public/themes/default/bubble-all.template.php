<!-- 
    Universal Ajax-ready bubble-park temple.
-->

<?php

require_once 'public/themes/default/get-page-name.func.php';

// check if Axax request
$isAjaxRequest = isset($_SERVER['HTTP_X_PJAX']);

$current_page_name = get_page_name(Url::current());

// set content name
$content_name = "content-" . $current_page_name;
?>

<!-- if not Ajax -->
<?php if(!$isAjaxRequest){ ?>
    <!-- send full page -->
    <?php Chunk::get('header'); ?>
    <?php echo "<body id=\"$current_page_name\">" ?>

    <div class="popup" id="load" style="z-index:9999999; display:block; background-color:#fff;">
        <div class="wait-overlay" style="position: absolute; 
        display: table; z-index: 9999; 
        width: 0px; height: 0px; 
        left: 50%; top: 50%; 
        margin-top: -11px; margin-left: -11px;">
            <div>
                <div class="wait"></div>
                <div class="wait-lens"></div>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        function startPageLoader (backgroundRGBA) {
            if (typeof backgroundRGBA !== 'undefined') {
                $('#load').css({
                    'background-color' : 'rgba('+backgroundRGBA+')'
                });
            }

            $("#load").fadeIn(500);
            $("#loader").wait();
        }

        function stopPageLoader () {
            $("#load").fadeOut(100);
            $("#loader").unwait();
        }

        $(window).load(function() {

            elementsCallbackStack.addPageCb(function () {
                resetContentStyles();
            });
            elementsCallbackStack.callAllPagesCb();
            g_loadedOnce = true;
            
            $('#load').delay(500).fadeOut(400, function () {
                $('#load').remove();
            });

            $("body").append('<div class="popup popup-load" id="load" style="z-index:9999999;">' +
                '<div class="load" id="loader"></div>'+
                '</div>');
        });
    </script>

        <?php Action::run('theme_pre_content'); ?>
        <div id="navigation" class="navbar navbar-default navbar-static-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="./home">Bubble Park</a>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <?php echo Menu::get(); ?>
                    </ul>
                </div>
            </div>
        </div>

<div class="global-wrapper">
        <div id="content">
            <?php Chunk::get($content_name); ?>
        </div>
        <?php Action::run('theme_post_content'); ?>
    <?php Chunk::get('footer'); ?>

<!-- if Ajax -->	
<?php 
    } else {
    // if from was sended
    if($_SERVER['REQUEST_METHOD'] == "POST") {
        $form_name = $_POST["form-name"];
        Chunk::get($form_name);
    }
    else {
        // send page
?>
        <!-- page title here -->
            <title><?php echo Site::name() . ' - ' . Site::title(); ?></title>
        <!-- end page title -->
<?php
        // send content
        Chunk::get($content_name);
    }
} ?>