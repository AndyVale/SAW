<?php
    require_once("../funzioni/dbFunctions.php");

    function getLikedPosts($likeGiver, $likeReciverId){
        $query = "SELECT post.ID
                  FROM post JOIN liked ON post.ID = liked.idPost
                  WHERE liked.idUtente = ? AND post.idUtente = ?";
        $params = [$likeGiver, $likeReciverId];
        $paramsType = "ii";
        $result = safeQuery($query, $params, $paramsType);
        if(!is_numeric($result)){
            return $result;
        }
        return [];
    }
    
    if(!safeSessionStart()){
        http_response_code(401);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NOT_LOGGED"));
        exit;
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'GET'){
        try{
            if(!empty($_GET[ID]) and is_numeric($_GET[ID])){//se in get ho un ID numerico lo uso come ID dell'utente di cui voglio sapere i post
                echo json_encode(getLikedPosts($_SESSION[ID], $_GET[ID]));
            }else{//altrimenti uso l'ID dell'utente loggato
                echo json_encode(getLikedPosts($_SESSION[ID], $_SESSION[ID]));
            }
        }catch(Exception $e){
            http_response_code(500);
            echo json_encode(array("result" => "KO", "message" => "DB_ERROR"));
        }
        exit;
    }

    if(empty($_GET['idPost']) || !is_numeric($_GET['idPost'])){//se sono qui non era una GET TODO: controllare sia un intero
        echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID"));
        http_response_code(400);
        exit;
    }
    
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $add = add_tuple("liked", ["idUtente", "idPost"], [$_SESSION[ID], $_GET['idPost']], "ii");
        http_response_code(201);
        if($add['result'] == "KO"){
            http_response_code(500);
        }
        echo json_encode($add);
        exit;
    }

    if($_SERVER['REQUEST_METHOD'] == 'DELETE'){
        $del = delete_tuple("liked", ["idUtente", "idPost"], [$_SESSION[ID], $_GET['idPost']], "ii");
        http_response_code(200);
        if($del['result'] == "KO"){
            http_response_code(500);
        }
        echo json_encode($del);
        exit;
    }
