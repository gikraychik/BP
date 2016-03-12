<?php
    include_once 'libraries/ValidateSome/ValidateFormFields.php';  
    include_once 'libraries/PHPMailer/PHPMailerAutoload.php';

    $team = htmlspecialchars($_POST["team"]);
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $phone = htmlspecialchars($_POST["phone"]);
    $date = htmlspecialchars($_POST["date"]);

    $err = "";

    if ( strlen($team) <= 0 ) {
        $err = $err."<div id=\"error\">Введите название команды</div>";
    }
    
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

        // Set email format to HTML
        $mail->isHTML(true);

        $mess = "<!DOCTYPE html>
                <html>
                <head>
                    <meta charset=\"UTF-8\">
                    <title></title>
                </head>
                <body>
                    Название команды: $team <br>
                    Имя заказчика: $name <br> 
                    Телефон: $phone <br> 
                    Email: $email <br> 
                    Дата турнира: $date
                </body>
                </html>";

        $mail->Subject = "Регистрация новой команды $team";
        $mail->Body    =  $mess;

        $mail->AltBody = "Название команды: $team
                          Имя заказчика: $name
                          Телефон: $phone
                          Email: $email
                          Дата турнира: $date";

        if(!$mail->send()) {
            echo '<div id="error">Упс, произошла какая-то ошибка. Поробуйте позже.</div>';
            // For debug only
            // echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo '<div id="success">Комманда успешно зарегистрирована!</div>';
        }
    }
?>
