<?php
    //ho iniziato solo a guardarle ma non c'è ancora niente di concreto qui
    require_once ("../funzioni/showProfileFunctions.php");

    header('Content-Type: application/json');
    $result['from'] = 'show_profile.php';

    if(!safeSessionStart()) {
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTLOGGED';
        echo json_encode($result);
        exit();
    }
    //$result['debug']= $_SESSION[EMAIL];
    $tmp = showProfile($_SESSION[ID]);
    switch($tmp){
        case showProfileResult::DB_ERROR:
            $result['result'] = 'KO';
            $result['message'] = 'DB_ERROR';
            http_response_code(500);
            break;
        case showProfileResult::ERROR_NOTLOGGED:
            $result['result'] = 'KO';
            $result['message'] = 'ERROR_NOTLOGGED';
            http_response_code(401);
            break;
        case showProfileResult::ERROR_SHOW:
            $result['result'] = 'KO';
            $result['message'] = 'ERROR_SHOW';
            http_response_code(500);
            break;
        default:
            $result['result'] = 'OK';
            $result['message'] = 'Show profile eseguito con successo';
            $result['data'] = $tmp;
            http_response_code(200);
            break;
    }
    echo json_encode($result);