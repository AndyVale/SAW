<?php
    require_once "../funzioni/dbConfig.php";
    require_once "../funzioni/dbFunctions.php";
    require_once "../funzioni/const.php";
    require_once "../funzioni/loginFunctions.php";
    /*$conn = connect();
    if($conn == null) {
        echo "connessione fallita<br>";
    }else{
        echo "connessione riuscita<br>";
    }
    */
    session_start();
    var_dump($_SESSION);
    //var_dump(cookieLogin());
    //var_dump($_SESSION);
?>