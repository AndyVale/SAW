<?php
    require_once("../funzioni/const.php");

    header('Content-Type: application/json');
    $result['from'] = 'logout.php';

    function logout() {
        //funzione che distrugge la sessione e i cookie
        if(session_status() == PHP_SESSION_ACTIVE) session_destroy();
        if (isset($_COOKIE[REMEMBERME])) {
            unset($_COOKIE[REMEMBERME]); 
            setcookie(REMEMBERME, '', -1, '/'); 
            return true;
        }
        return true;
    }

    logout();
    echo json_encode(array('result'=>'OK', 'message'=>'Logout avvenuto con successo'));
?>