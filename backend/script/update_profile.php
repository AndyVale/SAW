<?php

require_once("../funzioni/updateProfileFunctions.php");
require_once("../funzioni/const.php");
require_once("../funzioni/dbFunctions.php");


header('Content-Type: application/json');
$result['from'] = 'update_profile.php';

if(!safeSessionStart()) {
    $result['result'] = 'KO';
    $result['message'] = 'ERROR_NOTLOGGED';
    echo json_encode($result);
    http_response_code(401);
    exit;
}

$tmp = update();
switch($tmp){
    case updateResult::DB_ERROR:
        $result['result'] = 'KO';
        $result['message'] = 'DB_ERROR';
        break;
    case updateResult::ERROR_UPDATE:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_UPDATE';
        break;
    case updateResult::MISSING_FIELDS:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_MISSINGFIELDS';
        break;
    case updateResult::WRONG_EMAIL_FORMAT: 
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_WRONGEMAILFORMAT';
        break;
    case updateResult::WRONG_IMAGE_FORMAT: 
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_WRONGIMAGEFORMAT';
        break;
    case updateResult::DUPLICATE_EMAIL:
        $result['result'] = 'KO';
        $result['message'] = 'DUPLICATE_EMAIL';
        break;
    case updateResult::SUCCESSFUL_UPDATE:
        $result['result'] = 'OK';
        $result['message'] = 'SUCCESSFUL_UPDATE';
        break;
}
echo json_encode($result);
