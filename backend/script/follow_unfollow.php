<?php 
    require_once("../funzioni/dbFunctions.php");
    
    if(!safeSessionStart()){
        http_response_code(401);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NOT_LOGGED"));
        exit;
    }

    //--- GET

    try{
        if($_SERVER['REQUEST_METHOD'] == 'GET'){
            if(empty($_GET[IDSEGUITO]) || !is_numeric($_GET[IDSEGUITO])){//TODO: controllare sia un intero
                echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID"));
                http_response_code(400);
                exit;
            }
            $query = "SELECT * FROM seguiti WHERE idUtente = ? AND ".IDSEGUITO." = ?";
            $result = safeQuery($query, [$_SESSION[ID], $_GET[IDSEGUITO]], "ii");
            if(count($result) == 1){
                echo json_encode(array("result" => "OK", "isFollowed" => true, "message" => "User is followed by you"));
            }
            else{
                echo json_encode(array("result" => "OK", "isFollowed" => false, "message" => "User is not followed by you"));
            }
            http_response_code(200);
            exit;
        }
    }catch(Exception $e){
        http_response_code(500);
        echo json_encode(array("result" => "KO", "message" => "DB_ERROR"));
        exit;
    }

    //--- POST

    try{
        $dati = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
    }catch(Exception $e){
        http_response_code(400);
        echo json_encode(array("result" => "KO", "message" => "ERROR_JSON"));
        exit;
    }
    
    if(empty($dati[IDSEGUITO]) || !is_numeric($dati[IDSEGUITO])){//se sono qui non era una GET TODO: controllare sia un intero
        echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID_FOLLOWED_USER"));
        http_response_code(400);
        exit;
    }

    if($dati[IDSEGUITO] == $_SESSION[ID]){//easy rickroll, non ti puoi seguire da solo
        http_response_code(204);
        echo json_encode(array("result" => "KO", "message" => "START_RICKROLLING"));
        exit;
    }

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $add = add_tuple("seguiti", ["idUtente", IDSEGUITO], [$_SESSION[ID], $dati[IDSEGUITO]], "ii");
        http_response_code(201);
        if($add['result'] == "KO"){
            http_response_code(500);
        }
        echo json_encode($add);
        exit;
    }

    //--- DELETE

    if($_SERVER['REQUEST_METHOD'] == 'DELETE'){
        $del = delete_tuple("seguiti", ["idUtente", IDSEGUITO], [$_SESSION[ID], $dati[IDSEGUITO]], "ii");
        http_response_code(200);
        if($del['result'] == "KO"){
            http_response_code(500);
        }
        echo json_encode($del);
        exit;
    }
    