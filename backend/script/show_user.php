<?php
    require_once("../funzioni/const.php");
    require_once("../funzioni/dbFunctions.php");
    require_once("../funzioni/showProfileFunctions.php");

    if(empty($_GET[ID]) || !is_numeric($_GET[ID])){
        http_response_code(400);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID"));
        exit;
    }

    $risultato['datiUtente'] = showProfile($_GET[ID]);
    switch($risultato['datiUtente']){
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
            $result['data'] = $risultato['datiUtente'];
            http_response_code(200);
            break;
    }

    echo json_encode($risultato);

