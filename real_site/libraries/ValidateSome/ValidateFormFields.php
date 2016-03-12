<?php
    function validateDate($date)
    {   
        return (bool)preg_match('/^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4}$/', $date) || 
               (bool)preg_match('/^(0[1-9]|[1-2][0-9]|3[0-1]).(0[1-9]|1[0-2]).[0-9]{4}$/', $date);
    }

    function validateTime($time)
    {   
        return (bool)preg_match("/(?:[01][0-9]|2[0-4]):[0-5][0-9]/", $time);
    }

    function validateEMail($email)
    {   
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    function validatePhone($phone)
    {   
        return filter_var($phone, FILTER_SANITIZE_NUMBER_INT) == $phone;
    }
?>