<?php

require_once("../funzioni/update-showProfileFunctions.php");
require_once("../funzioni/const.php");

require_once("../funzioni/dbFunctions.php");

enum numbersResult {
    case SUCCESSFUL_QUERY;
    case GENERIC_ERROR;
    case DB_ERROR;
}

header('Content-Type: application/json');

$result['from'] = 'update_profile.php';

    if(!safeSessionStart()) {
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTLOGGED';
        echo json_encode($result);
        exit();
    } 

/*
function numbers($UserId){
        $data = array($UserId);
        $query = "SELECT COUNT(ID) as NumPosts FROM post WHERE idUtente = ?";
        
                try{
                    if(safeQuery($query, $data, "i") == 1)
                        return numbersResult::SUCCESSFUL_QUERY;
                    return registerResult::DB_ERROR;
                }
                catch(mysqli_sql_exception $ex){
                    error_log("dbFunctions.php/register(): ".$ex->getMessage()."\n", 3, ERROR_LOG);
                    return numbersResult::GENERIC_ERROR;
                }
}   
$utente = 1;     
$tmp = numbers();
switch($tmp){
    case numbersResult::SUCCESSFUL_QUERY: 
                //aggiungo campi per la registrazione avvenuta con successo
                $result['result'] = 'OK';
                $result['message'] = 'Registrazione avvenuta con successo';
                $result['data'] = $tmp;
                break;
    case numbersResult::GENERIC_ERROR:
                //aggiungo campi per l'esito negativo della registrazione
                $result['result'] = 'KO';
                $result['message'] = 'EMAIL_ALREADY_EXISTS';
                break;
    case numbersResult::DB_ERROR:
                //aggiungo campi per l'esito negativo della registrazione
                $result['result'] = 'KO';
                $result['message'] = 'DB_ERROR';
                break;    
}
echo json_encode($result);
*/

//problema n°1: quando aggiorno nome e cognome resituisce ERROR_NOTALLFIELDS ma modifica effetivamente il database
//problema n°2: quando aggiorno l'email, tutti i campi vengono svuotati e show profile fallisce

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
$tmp=update();
switch($tmp){
    case updateResult::ERROR_NOTLOGGED:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTLOGGED';
        break;
    case updateResult::MISSING_FIELDS:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_MISSINGFIELDS';
        break;
    case updateResult::ERROR_DB:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_DB';
        break;
    case updateResult::SUCCESSFUL_UPDATE:
        $result['result'] = 'OK';
        $result['message'] = 'Update eseguito con successo';
        break;
    case updateResult::ERROR_UPDATE:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_UPDATE';
        break;
    case updateResult::MISSING_FIELDS_BEFORE:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_MISSINGFIELDS_BEFORE';
        break;
    case updateResult::DUPLICATE_EMAIL:
        $result['result'] = 'KO';
        $result['message'] = 'DUPLICATE_EMAIL';
        break;
}
echo json_encode($result);
}