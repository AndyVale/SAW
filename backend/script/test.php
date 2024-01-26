<?php
    require_once "../funzioni/dbConfig.php";
    require_once "../funzioni/dbFunctions.php";
    require_once "../funzioni/const.php";
    require_once "../funzioni/loginFunctions.php";
    require_once "../funzioni/update-showProfileFunctions.php";
    /*$conn = connect();
    if($conn == null) {
        echo "connessione fallita<br>";
    }else{
        echo "connessione riuscita<br>";
    }
    */
    $_POST['email'] = "email12@example.com";
    $_POST['pass'] = "pass2";
    //echo "<br><br><br>";
    var_dump(credentialsLogin());
    //echo "<br><br><br>";
    //var_dump(cookieLogin());
    //var_dump($_SESSION);
?>