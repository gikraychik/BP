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

<script>
	$().ready(function () {
		<?php if (Notification::get('reset_password') == 'reset_password') { ?>
			$('.reset-password-area, .administration-btn').show();
			$('.administration-area, .reset-password-btn').hide();
		<?php } else { ?>
			$('.reset-password-area, .administration-btn').hide();
			$('.administration-area, .reset-password-btn').show();
		<?php } ?>

		$('.reset-password-btn').click(function() {
			$('.reset-password-area, .administration-btn').show();
			$('.administration-area, .reset-password-btn').hide();
		});

		$('.administration-btn').click(function() {
			$('.reset-password-area, .administration-btn').hide();
			$('.administration-area, .reset-password-btn').show();
		});
	});
</script>

<?php Action::run('admin_header'); ?>

<!--[if lt IE 9]>
	<link href="css/ie.css" rel="stylesheet">
	<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->

</head>
<body>

<div class="container form-sign-in">

	<img class="monstra-logo" src="<?php echo Option::get('siteurl'); ?>admin/themes/curmudgeon/img/monstra_128px.png" alt="Monstra Logo">
	<h2><a href="<?php echo Option::get('siteurl'); ?>admin"><?php echo __('Monstra'); ?></a></h2>

	<div class="administration-area">
		<hr class="soften">
		<h3><?php echo __('Administration', 'system'); ?></h3>
		<form method="post">
			<label><i class="icon-user"></i> <?php echo __('Username', 'users'); ?></label>
			<input class="input-xlarge" name="login" type="text">
			<label><i class="icon-lock"></i> <?php echo __('Password', 'users'); ?></label>
			<input class="input-xlarge" name="password" type="password">
			<?php if (isset($login_error) && $login_error !== '') { ?><div class="alert alert-error"><?php echo $login_error; ?></div><?php } ?>
			<div class="btn-centered">
				<input type="submit" name="login_submit" class="btn btn-success" value="<?php echo __('Log In', 'users'); ?>">
			</div>
		</form>
	</div>

	<div class="reset-password-area">
		<hr class="soften">
		<h3><?php echo __('Reset Password', 'system'); ?></h3>
		<?php if (Notification::get('success')) Alert::success(Notification::get('success')); ?>
		<form method="post">
			<label><i class="icon-user"></i> <?php echo __('Username', 'users'); ?></label>
			<input name="login" class="input-xlarge" type="text" value="<?php echo $user_login; ?>">
			<?php if (Option::get('captcha_installed') == 'true') { ?>
			<label><i class="icon-text-width"></i> <?php echo __('Captcha'); ?></label>
			<input type="text" name="answer" class="input-xlarge">
			<?php CryptCaptcha::draw(); ?>
			<?php } ?>
			<?php
				if (count($errors) > 0) {
					foreach ($errors as $error) {
						Alert::error($error);
					}
				}
			?>
			<div class="btn-centered">
				<input type="submit" name="reset_password_submit" class="btn btn-success" value="<?php echo __('Send New Password', 'users')?>">
			</div>
		</form>
	</div>

	<hr class="soften">
	<div class="warn">
		<a href="<?php echo Option::get('siteurl'); ?>"><?php echo __('< Back to Website', 'system');?></a> -
		<a class="reset-password-btn" href="javascript:;"><?php echo __('Forgot your password? >', 'system');?></a>
		<a class="administration-btn" href="javascript:;"><?php echo __('Administration >', 'system');?></a>
	</div>

</div> <!--/.container .form-signin -->

<div class="footer-info">
	<p>&copy; 2013 <a href="http://monstra.org" class="small-grey-text" target="_blank">Monstra</a> – <?php echo __('Version', 'system'); ?> <?php echo Monstra::VERSION; ?></p>
</div>

</body>
</html>