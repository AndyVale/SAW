<?php
    require_once "dbConfig.php";
    require_once "dbFunctions.php";
    $conn = connect();
    if($conn == null) {
        var_dump($conn);
        die();
    }else{
        var_dump($conn);
    }

    $conn = connect();
    if($conn == null) {
        var_dump($conn);
        die();
    }else{
        var_dump($conn);

    }
    $conn->close();
?>