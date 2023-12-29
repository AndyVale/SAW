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
    $_POST['email'] = "proXvfxa.ricotti@gmail.com";
    $_POST['pass'] = "123";
    $_POST['confirm'] = "123";
    $_POST['firstname'] = "prXX>oVa";
    $_POST['lastname'] = "ricotti";
    $_POST[UPDATEREQUEST] = "1";
    echo "<br><br><br>";
    
    
    var_dump(credentialsLogin());
    echo "<br><br><br>SESSIONE: ";
    var_dump($_SESSION);
    
    //var_dump(cookieLogin());
    //var_dump($_SESSION);
?>