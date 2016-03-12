<?php
require_once 'libraries/ValidateSome/ValidateFormFields.php';
require_once 'libraries/PHPMailer/PHPMailerAutoload.php';

$promo = strtoupper(htmlspecialchars($_POST["promo"]));
$promo_codes = explode("\n", Block::get("promo-codes"));

for ($i = 0; $i < count($promo_codes); $i++) {
    $promo_codes[$i] = str_ireplace(["<p>","</p>"], "", $promo_codes[$i]);
}

$err = "";

if (strlen($promo) <= 0) {
    $err = $err . "<div id=\"error\">Введите промо код</div>";
}

if (!in_array(mb_strtoupper($promo, 'UTF-8'), $promo_codes)) {
    $err = $err . "<div id=\"error\">Неверный промо код</div>";
}

if (!empty($err)) {
    echo $err;
} else {
    echo '<div id="success">Промо код принят!</div>';
}

?>