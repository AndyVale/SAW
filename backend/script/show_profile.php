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
    $tmp = showProfile();
    switch($tmp){
        case showProfileResult::DB_ERROR:
            $result['result'] = 'KO';
            $result['message'] = 'DB_ERROR';
            break;
        case showProfileResult::ERROR_NOTLOGGED:
            $result['result'] = 'KO';
            $result['message'] = 'ERROR_NOTLOGGED';
            break;
        case showProfileResult::ERROR_SHOW:
            $result['result'] = 'KO';
            $result['message'] = 'ERROR_SHOW';
            break;
        default:
            $result['result'] = 'OK';
            $result['message'] = 'Show profile eseguito con successo';
            $result['data'] = $tmp;
            break;
    }
    echo json_encode($result);