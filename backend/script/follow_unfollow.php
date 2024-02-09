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
    if($_SERVER['REQUEST_METHOD'] == 'GET'){
        $query = "SELECT * FROM seguiti WHERE idUtente = ? AND idUtenteSeguito = ?";
        $result = safeQuery($query, [$_SESSION[ID], $_GET['idUtenteSeguito']], "ii");
        if(count($result) == 1){
            echo json_encode(array("result" => "OK", "isFollowed" => true, "message" => "User is followed by you"));
        }
        else{
            echo json_encode(array("result" => "OK", "isFollowed" => false, "message" => "User is not followed by you"));
        }
        http_response_code(200);
        exit;
    }
    if($_SERVER['REQUEST_METHOD'] == 'PUT' || $_SERVER['REQUEST_METHOD'] == 'DELETE'){
        toggle_tuple("seguiti", ["idUtente", "idUtenteSeguito"], [$_SESSION[ID], $_GET['idUtenteSeguito']], "ii");
        exit;
    }