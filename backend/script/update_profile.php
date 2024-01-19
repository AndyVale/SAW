<?php

require_once("../funzioni/update-showProfileFunctions.php");
require_once("../funzioni/const.php");
require_once("../funzioni/dbFunctions.php");


header('Content-Type: application/json');
$result['from'] = 'update_profile.php';

session_start();

//controllo subito che l'utente sia autenticato, assumo la pagina riservata
//perciò può visualizzarla solo se autenticato
if (!isLogged()) {
    header("Location: ../../frontend/pages/homepage/index.html");
    //oppyre return updateResult::ERROR_NOTLOGGED; 
    exit();
}
$error = "errore";
$tmp = update();
switch($tmp){
    case updateResult::DB_ERROR:
        $result['result'] = 'KO';
        $result['message'] = 'DB_ERROR';
        echo $error;
        break;
    /*
    case updateResult::ERROR_NOTLOGGED:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTLOGGED';
        break;
        */
    case updateResult::ERROR_UPDATE:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_SHOW';
        echo $error;
        break;
    case updateResult::MISSING_FIELDS:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_MISSINGFIELDS';
        echo $error;
        break;
    case updateResult::WRONG_EMAIL_FORMAT: 
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_WRONGEMAILFORMAT';
        echo $error;
        break;
    case updateResult::DUPLICATE_EMAIL:
        $result['result'] = 'KO';
        $result['message'] = 'DUPLICATE_EMAIL';
        echo $error;
        break;
    case updateResult::SUCCESSFUL_UPDATE:
        $result['result'] = 'OK';
        $result['message'] = 'SUCCESSFUL_UPDATE';
        header("Location: ../../frontend/pages/show_profile/index.html");
        break;
}
