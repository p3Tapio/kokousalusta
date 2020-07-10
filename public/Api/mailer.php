<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';

function sendEmail($senderEmailAdd, $senderPassword, $senderName, $sendToEmail, $sendToName, $subject, $body) {
  
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    $mail->SMTPAuth = true; 
    $mail->SMTPSecure = "tls";
    
    $mail->Host = "smtp.gmail.com";
    $mail->Port = 587;

    $mail->Username = $senderEmailAdd; 
    $mail->Password = $senderPassword; 

    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

    $mail->From = $senderEmailAdd; 
    $mail->FromName = $senderName; 

    $mail->AddAddress("$sendToEmail", "$sendToName"); 
    $mail->Subject = $subject;
    $mail->Body = $body; 

    try {
        $mail->send(); 
        return "Message sent!";
    } catch (Exception $ex) {
        return "Failed, error: {$mail->ErrorInfo}";
    }
}
?>