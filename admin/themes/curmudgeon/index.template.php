<?php if ( ! defined('MONSTRA_ACCESS')) exit('No direct script access allowed'); ?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Monstra - <?php echo __('Administration', 'system'); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Monstra Admin Area">

<link rel="icon" href="<?php echo Option::get('siteurl'); ?>favicon.ico" type="image/x-icon">
<link rel="shortcut icon" href="<?php echo Option::get('siteurl'); ?>favicon.ico" type="image/x-icon">

<!-- Styles -->
<?php Stylesheet::add('public/assets/css/bootstrap.css', 'backend', 1); ?>
<?php Stylesheet::add('public/assets/css/bootstrap-lightbox.css', 'backend', 2); ?>
<?php Stylesheet::add('public/assets/css/bootstrap-responsive.css', 'backend', 3); ?>
<?php Stylesheet::add('admin/themes/curmudgeon/css/default.css', 'backend', 4); ?>
<?php Stylesheet::add('admin/themes/curmudgeon/css/font-awesome.css', 'backend', 5); ?>
<?php Stylesheet::load(); ?>

<!-- Font Awesome supports for IE7 -->
<!--[if IE 7]>
	<link href="<?php echo Option::get('siteurl'); ?>admin/themes/curmudgeon/css/font-awesome-ie7.css" rel="stylesheet">
<![endif]-->

<!-- JavaScripts -->
<?php Javascript::add('public/assets/js/jquery.js', 'backend', 1); ?>
<?php Javascript::add('public/assets/js/bootstrap.js', 'backend', 2); ?>
<?php Javascript::add('public/assets/js/bootstrap-lightbox.js', 'backend', 3); ?>
<?php Javascript::add('admin/themes/curmudgeon/js/default.js', 'backend', 4); ?>
<?php Javascript::load(); ?>

<?php Action::run('admin_header'); ?>

<!--[if lt IE 9]>
	<link href="css/ie.css" rel="stylesheet">
	<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->

</head>
<body class="admin-dashboard">

<!-- Block Header -->
<header class="navbar navbar-inverse navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container">
			<a class="brand" href="<?php echo Option::get('siteurl'); ?>admin"><?php echo __('Monstra'); ?></a>
			<p class="pull-right user-panel">
				<?php Navigation::draw('top', Navigation::TOP); ?>
			</p>
		</div>
	</div>
</header>
<!-- /Block Header -->

<!-- Block Container -->
<div class="container">
	<div class="page">

		<div class="row">

			<!-- Block Sidebar -->
			<div class="span2">
				<div class="sidebar">
					<div class="hidden-desktop">
						<select class="input-block-level" name="sections" id="sections">
							<?php
								Navigation::getDropdown('content');
								Navigation::getDropdown('extends');
								Navigation::getDropdown('system');
							?>
						</select>
					</div>

					<div class="hidden-phone hidden-tablet">
						<h4><i class="icon-file-alt"></i> <?php echo __('Content', 'pages'); ?></h4>
						<ul>
							<?php Navigation::draw('content'); ?>
						</ul>
						<div class="monstra-menu-separator"></div>
						<?php if (Session::exists('user_role') && in_array(Session::get('user_role'), array('admin'))) { ?>
						<h4><i class="icon-cog"></i> <?php echo __('Extends', 'system'); ?></h4>
						<ul>
							<?php Navigation::draw('extends'); ?>
						</ul>
						<div class="monstra-menu-separator"></div>
						<?php } ?>
						<h4><i class="icon-cogs"></i> <?php echo __('System', 'system'); ?></h4>
						<ul>
							<?php Navigation::draw('system'); ?>
						</ul>
					</div>
				</div> <!--/.sidebar -->
			</div>
			<!-- /Block Sidebar -->

			<!-- Block Content -->
			<div class="span10">
				<div class="content">
					<div id="update-monstra"></div>
					<div><?php Action::run('admin_pre_template'); ?></div>
					<div>
						<?php
							if ($plugin_admin_area) {
								if (is_callable(ucfirst(Plugin::$plugins[$area]['id']).'Admin::main')) {
									call_user_func(ucfirst(Plugin::$plugins[$area]['id']).'Admin::main');
								} else {
									echo '<div class="message-error">'.__('Plugin main admin function does not exist', 'system').'</div>';
								}
							} else {
								echo '<div class="message-error">'.__('Plugin does not exist', 'system').'</div>';
							}
						?>
					</div>
					<div><?php Action::run('admin_post_template'); ?></div>
				</div> <!--/.content -->
			</div>
			<!-- /Block Content -->

		</div> <!--/.row -->

	</div>
</div>
<!-- /Block Container -->

<!-- Block Footer -->
<footer class="monstra-info">
	<p class="hidden-phone">
		<a href="http://forum.monstra.org" target="_blank"><?php echo __('Official Support Forum', 'system'); ?></a> &ndash;
		<a href="http://monstra.org/documentation" target="_blank"><?php echo __('Documentation', 'system'); ?></a> &ndash;
		&copy; 2012 &ndash; 2013 <a href="http://monstra.org" target="_blank">Monstra</a> – <?php echo __('Version', 'system'); ?> <?php echo Monstra::VERSION; ?>
	</p>
</footer>
<!-- /Block Footer -->

</body>
</html>