<?php 
    require_once("../funzioni/dbFunctions.php");

    if(empty($_GET['idUtenteSeguito']) || !is_numeric($_GET['idUtenteSeguito'])){
        echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID"));
        http_response_code(400);
        exit;
    }
    if(!safeSessionStart()){
        http_response_code(401);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NOT_LOGGED"));
        exit;
    }

    toggle_tuple("seguiti", ["idUtente", "idUtenteSeguito"], [$_SESSION[ID], $_GET['idUtenteSeguito']], "ii");