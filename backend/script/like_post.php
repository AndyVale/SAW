<?php
    require_once("../funzioni/dbFunctions.php");
    
    if(empty($_GET['idPost']) || !is_numeric($_GET['idPost'])){
        echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID"));
        http_response_code(400);
        exit;
    }
    if(!safeSessionStart()){
        http_response_code(401);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NOT_LOGGED"));
        exit;
    }

    toggle_tuple("liked", ["idUtente", "idPost"], [$_SESSION[ID], $_GET['idPost']], "ii");
