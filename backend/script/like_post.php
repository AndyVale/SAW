<?php
    require_once("../funzioni/dbFunctions.php");
    if(empty($_GET['idPost']) || !is_numeric($_GET['idPost'])){
        http_response_code(400);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID"));
        exit;
    }
    if(!safeSessionStart()){
        http_response_code(401);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NOT_LOGGED"));
        exit;
    }

    try{
        $query = "INSERT INTO liked (idUtente, idPost) VALUES (?, ?)";
        $params = [$_SESSION[ID], $_GET['idPost']];
        $paramsType = "ii";
        $result = safeQuery($query, $params, $paramsType);//TODO: SafeQuery qui è esagerata?
        http_response_code(201);
    }catch(mysqli_sql_exception $e){
        $query = "DELETE FROM liked WHERE idUtente = ? AND idPost = ?";
        $params = [$_SESSION[ID], $_GET['idPost']];
        $paramsType = "ii";
        $result = safeQuery($query, $params, $paramsType);
        http_response_code(200);
    }catch(Exception $e){
        http_response_code(500);
        echo json_encode(array("result" => "KO", "message" => "ERROR"));
        exit;
    }

