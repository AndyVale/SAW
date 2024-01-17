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

function update2(){
    //funzione che effettua un aggiornamento del profilo utente dai dati mandati in POST
    if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
    
    $conn = connect();
    if($conn == null) return updateResult::ERROR_DB;
    
    $SetFields = "";
    $SetValues = array();
    $SetTypes = "";
    $automaticUpdatableFields = array(FIRSTNAME, LASTNAME);
    $toUpdate = array();

    foreach($_POST as $key => $value) {//la key sarebbe il nome del campo, il value il valore contenuto in POST
        if(in_array($key, $automaticUpdatableFields)) {//se ci sono campi in POST che rientrano tra quelli aggiornabili
            $SetFields .= $key." = ?, ";//aggiungo la stringa al campo SET della query
            $SetValues[] = trim(htmlentities($value));//aggiungo il valore all'array dei valori (su cui farò il bind)
            $SetTypes .= "s";//aggiungo il tipo che è sempre string per i campi aggiornabili
            $toUpdate[$key] = trim(htmlentities($value));
        }
    }
    
    if(!empty($_POST[EMAIL])){//L'email è un campo particolare, non è automaticamente aggiornabile perchè deve passare il controllo di filtraggio
        if(!filter_var($_POST[EMAIL], FILTER_VALIDATE_EMAIL)){
            return updateResult::ERROR_UPDATE;//non mi preoccupo di dare un errore specifico perchè via frontend non è possibile mandare una email non valida
        }
        $SetFields .= EMAIL." = ?, ";//aggiungo la stringa al campo SET della query
        $SetValues[] = trim(htmlentities($_POST[EMAIL]));//aggiungo il valore all'array dei valori (su cui farò il bind)
        $toUpdate[EMAIL] = trim(htmlentities($_POST[EMAIL]));
        $SetTypes .= "s";//aggiungo il tipo che è sempre string per i campi aggiornabili
    }

    $strLen = strlen($SetFields);
    if($strLen > 0)
        $SetFields = substr($SetFields, 0, $strLen-2);//tolgo l'ultima virgola e lo spazio
    else
        return updateResult::MISSING_FIELDS;//se non ci sono campi aggiornabili restituisco un errore

    $query = "UPDATE Utente SET $SetFields WHERE email = ?";
    $SetTypes .= "s";//per l'email come chiave 
    $SetValues[] = $_SESSION[EMAIL];//aggiungo l'email come chiave
    //sanificazione input
    //aggiornamento sessione email

    if(safeQuery($query, $SetValues, $SetTypes) == 1){
        foreach($toUpdate as $key => $value) {//la key sarebbe il nome del campo, il value il valore contenuto in POST
            $_SESSION[$key] = $value;
        }
        return updateResult::SUCCESSFUL_UPDATE;
    }
    return updateResult::ERROR_UPDATE;//nota: viene restituito questo anche qualora l'utente non avesse modificato nessun campo
}

//problema n°1: quando aggiorno nome e cognome resituisce ERROR_NOTALLFIELDS ma modifica effetivamente il database
//problema n°2: quando aggiorno l'email, tutti i campi vengono svuotati e show profile fallisce

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
$tmp=update2();
switch($tmp){
    case updateResult::ERROR_NOTLOGGED:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTLOGGED';
        break;
    case updateResult::MISSING_FIELDS:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTALLFIELDS';
        break;
    case updateResult::ERROR_DB:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_DB';
        break;
    case updateResult::SUCCESSFUL_UPDATE:
        $result['result'] = 'OK';
        $result['message'] = 'Update eseguito con successo';
        //$result['data'] = $SESSION; -> Penso volessi fare una cosa del genere restituendo tmp. Non so se sia fattibile a livello di sicurezza
        break;
    case updateResult::ERROR_UPDATE:
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_UPDATE';
        break;
}
echo json_encode($result);
}