<?php 
$isAjaxRequest = isset($_SERVER['HTTP_X_PJAX']); 
$content_name = 'content-home';
$current_page_name = 'home';
?>

<!-- if not Ajax -->
<?php if(!$isAjaxRequest){ ?>
	<!-- send full page -->
	<?php Chunk::get('header'); ?>
	<?php echo "<body id=\"$current_page_name\">" ?>
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
		<br clear="all"/>

		<div id="content">
			<?php Chunk::get($content_name); ?>
		</div>
		<?php Action::run('theme_post_content'); ?>
	<?php Chunk::get('footer'); ?>

<!-- if Ajax -->	
<?php } else {
	// send page title
?>
<!-- page title here -->
	<title><?php echo Site::name() . ' - ' . Site::title(); ?></title>
<!-- end page title -->
<?php
	// send content
	Chunk::get($content_name);
}?>