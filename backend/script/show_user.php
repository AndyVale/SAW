<?php
    require_once("../funzioni/const.php");
    require_once("../funzioni/dbFunctions.php");
    require_once("../funzioni/showProfileFunctions.php");

    if(empty($_GET[ID]) || !is_numeric($_GET[ID])){
        http_response_code(400);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID"));
        exit;
    }

    $risultato['datiUtente'] = showProfile($_GET[ID]);
    $risultato['posts'] = show_user_posts($_GET[ID]);

    echo json_encode($risultato);

