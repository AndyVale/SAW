<?php
    require_once "dbConfig.php";
    require_once "dbFunctions.php";
    $conn = connect();
    if($conn == null) {
        echo "connessione fallita<br>";
    }else{
        echo "connessione riuscita<br>";
    }
    $_POST['email'] = "provfa.ricotti@gmail.com";
    $_POST['pass'] = "123";
    $_POST['confirm'] = "123";
    $_POST['firstname'] = "prova";
    $_POST['lastname'] = "ricotti";

    var_dump(register());
    echo "<br>";
    var_dump($_SESSION);
?>