<?php
    require_once("../funzioni/const.php");
    function logout() {
        //funzione che distrugge la sessione e i cookie
        if(session_status() == PHP_SESSION_ACTIVE) session_destroy();
        setcookie(REMEMBERME, "", time()-3600);
        return true;
    }

    logout();
    echo json_encode(array('result'=>'OK', 'message'=>'Logout avvenuto con successo'));
?>