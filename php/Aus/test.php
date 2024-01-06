<?php
    require_once "dbConfig.php";
    require_once "dbFunctions.php";
    require_once "const.php";
    /*$conn = connect();
    if($conn == null) {
        echo "connessione fallita<br>";
    }else{
        echo "connessione riuscita<br>";
    }
    */
    $_POST['email'] = "email1@example.com";
    $_POST['pass'] = "pass1";
    $_POST['confirm'] = "pass1";
    echo "<br><br><br>";
    
    
    var_dump(credentialsLogin());
    echo "<br><br><br>SESSIONE: ";
    var_dump($_SESSION);
    
    //var_dump(cookieLogin());
    //var_dump($_SESSION);
?>