<?php

require_once("../funzioni/update-showProfileFunctions.php");

session_start();
$_SESSION['email'] = 'email17@example.com';
/*
 $logged_in_user = array(
    'username' => 'utente123',
    'firstname' => 'Giuseppe',
    'lastname' => 'Vessicchio',
    'email' => 'maria.rossi@example.com',
    'posts' => '7',
    'followers' => '13',
    'following' => '21'
);


header('Content-Type: application/json');
echo json_encode($logged_in_user);

function showProfile(){
        //funzione che restituisce i dati del profilo utente
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        
        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;

        $query = "SELECT firstname, lastname, email FROM Utente WHERE email = ?";
        $tmp = safeQuery($query, array($_SESSION[EMAIL]), "s");
        if(!is_numeric($tmp) && count($tmp) == 1)
            return $tmp[0];
        return updateResult::ERROR_UPDATE;
    }   
*/

    header('Content-Type: application/json');
       if(!safeSessionStart()) {
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTLOGGED';
        echo json_encode($result);
        exit();
    }
   
    $tmp = showProfile();
    switch($tmp){
        case updateResult::ERROR_DB:
            $result['result'] = 'KO';
            $result['message'] = 'ERROR_DB';
            break;
        case updateResult::ERROR_NOTLOGGED:
            $result['result'] = 'KO';
            $result['message'] = 'ERROR_NOTLOGGED';
            break;
        case updateResult::ERROR_UPDATE:
            $result['result'] = 'KO';
            $result['message'] = 'ERROR_UPDATE';
            break;
        default:
            $result['result'] = 'OK';
            $result['message'] = 'Show profile eseguito con successo';
            $result['data'] = $tmp;
            break;
    }
    echo json_encode($result);