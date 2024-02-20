<?php
    require_once("../funzioni/const.php");
    require_once("../funzioni/dbFunctions.php");

    header('Content-Type: application/json');
    $result['from'] = 'logout.php';

    function logout() {
        //funzione che distrugge la sessione e i cookie
        session_start();
        session_destroy();
        if (isset($_COOKIE[REMEMBERME])) {
            unset($_COOKIE[REMEMBERME]); 
            setcookie(REMEMBERME, '', -1, '/'); 
        }
    }
    logout();
    echo json_encode(array('result'=>'OK', 'message'=>'Logout avvenuto con successo'));
