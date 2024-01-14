<?php
    require_once("../funzioni/loginFunctions.php");

    $result['from'] = 'cookie_login.php';
    
    switch (cookieLogin()) {
        case loginResult::SUCCESSFUL_LOGIN:
            $result['result'] = 'OK';
            $result['message'] = 'Login mediante cookie avvenuto con successo';
            $result['data'] = array(FIRSTNAME=>$_SESSION[FIRSTNAME], LASTNAME=>$_SESSION[LASTNAME], EMAIL=>$_SESSION[EMAIL]);
            break;
        case loginResult::WRONG_CREDENTIALS:
            $result['result'] = 'KO';
            $result['message'] = 'COOKIE_NOT_VALID';
            break;
        case loginResult::DB_ERROR:
            $result['result'] = 'KO';
            $result['message'] = 'DB_ERROR';
            break;
        case loginResult::MISSING_FIELDS:
            $result['result'] = 'KO';
            $result['message'] = 'COOKIE_NOT_FOUND';
            break;
        default:
            $result['result'] = 'KO';
            break;
    }

    echo json_encode($result);
?>