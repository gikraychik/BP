<?php
require_once 'libraries/ValidateSome/ValidateFormFields.php';
require_once 'libraries/PHPMailer/PHPMailerAutoload.php';
$name = htmlspecialchars($_POST["name"]);
$email = htmlspecialchars($_POST["email"]);
$phone = htmlspecialchars($_POST["phone"]);
$date = htmlspecialchars($_POST["date"]);
$time = htmlspecialchars($_POST["time"]);
$hours = (int)htmlspecialchars($_POST["hours"]);
$sale = (int)htmlspecialchars($_POST["sale"]);
$sales = htmlspecialchars($_POST["checked-sales"]);
$sum = (int)htmlspecialchars($_POST["sum"]);
$err = "";
if ( strlen($name) <= 0 ) {
$err = $err."<div id=\"error\">Введите имя</div>";
}
if ( strlen($phone) <= 0 || !validatePhone($phone)) {
$err = $err."<div id=\"error\">Введите телефон</div>";
}
// if ( !validateEMail($email) ) {
//     $err = $err."<div id=\"error\">E-mail введён неверно!</div>";
// }
// if ( strlen($date) <= 0 || !validateDate($date) ) {
//     $err = $err."<div id=\"error\">Дата введёна неверно!</div>";
// }
// if ( strlen($time) <= 0 || !validateTime($time) ) {
//     $err = $err."<div id=\"error\">Время введёно неверно!</div>";
// }
if ( !in_array($hours, array(1, 2, 3)) ) {
$err = $err."<div id=\"error\">Количество часов выбрано неверно!</div>";
}
if ( $sale < 0 || $sale > 30 ) {
$err = $err."<div id=\"error\">Скидка выбрана неверно!</div>";
}
if ( $sum <= 0 ) {
$err = $err."<div id=\"error\">Общая сумма оплаты должны быть больше нуля!</div>";
}
if (!empty($err)) {
echo $err;
}
else {
$site_mail = explode(" ", Option::get('system_email'));
$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.yandex.ru';                       // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'info@bubble-park.ru';              // SMTP username
$mail->Password = 'mAD6K0uKMr3Gf4';                   // SMTP password
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to
$mail->From = 'info@bubble-park.ru';
$mail->FromName = Site::name();
// Add a recipient
foreach ($site_mail as $value) {
$mail->addAddress($value);
}
// Так добавлять ещё получателей
//$mail->addAddress('george.kraychik@gmail.com');
//$mail->addAddress('mrlisdim@yandex.ru');
// Set email format to HTML
$mail->isHTML(true);
$fll = fopen('my_pro.txt','r');
$pcode = fgets($fll);
fclose($fll);
$ppp = "отсутствует";
if (stripos($sales, 'промо') !== false) {
$ppp = $pcode;
}
//$emails = file('part_emails.txt');
$emails = explode("\n", Block::get("promo-emails"));
$pcds = explode("\n", Block::get("promo-codes"));
$k = -1;
for ($i = 0; $i < count($pcds); $i++) {
if (strcasecmp($ppp, $pcds[$i]) == 0) {
$k = $i;
}
}
if (($k >= 0)) {
$mail->AddCC($emails[$k]);
}
$mess = "<!DOCTYPE html>
<html>
<head>
<meta charset=\"UTF-8\">
<title></title>
</head>
<body>
Имя заказчика: $name <br>
Телефон: $phone <br>
Email: $email <br>
Заказ на $date в $time <br>
Время игры $hours ч. <br>
Выбранные скидки: $sales <br>
Промо-код: $ppp <br>
Суммарная скидка: $sale% <br><br>
Итого: $sum руб.
</body>
</html>";
$mail->Subject = "Новый заказ на $date";
$mail->Body    =  $mess;
$mail->AltBody = "Имя заказчика: $name
Телефон: $phone
Email: $email
Заказ на $date в $time
Время игры $hours ч.
Выбранные скидки: $sales
Суммарная скидка: $sale%
Итого: $sum руб.";
if(!$mail->send()) {
echo '<div id="error">Упс, произошла какая-то ошибка. Поробуйте позже.</div>';
// For debug only
// echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
echo '<div id="success">Заказ успешно отправлен!</div>';
}
}
?>