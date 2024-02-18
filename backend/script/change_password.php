<?php

require_once("../funzioni/updateProfileFunctions.php");
require_once("../funzioni/const.php");
require_once("../funzioni/dbFunctions.php");


header('Content-Type: application/json');
$result['from'] = 'change_password.php';

session_start();

$tmp = passwordUpdate();
switch($tmp){
    case updateResult::DB_ERROR:
        $result['result'] = 'KO';
        $result['message'] = 'DB_ERROR';
        break;
    case updateResult::MISSING_FIELDS:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_MISSINGFIELDS';
        break;
    case updateResult::ERROR_NOTLOGGED:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTLOGGED';
        break;
    case updateResult::DIFFERENT_PASSWORDS:
        $result['result'] = 'KO';
        $result['message'] = 'DIFFERENT_PASSWORDS';
        break;
    case updateResult::ERROR_UPDATE:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_UPDATE';
        break;
    case updateResult::WRONG_CREDENTIALS:
        $result['result'] = 'KO';
        $result['message'] = 'WRONG_CREDENTIALS';
        break;
    case updateResult::SUCCESSFUL_UPDATE:
        $result['result'] = 'OK';
        $result['message'] = 'SUCCESSFUL_UPDATE';
        break;
}
echo json_encode($result);