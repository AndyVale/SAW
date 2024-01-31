<?php
    require_once '../funzioni/dbFunctions.php';

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

    if(empty($_GET[ID]) || !is_numeric($_GET[ID])){//in get prendo l'utente di cui voglio controllare i post
        http_response_code(400);
        $result['result'] = 'KO';
        $result['message'] = 'MISSING_FIELDS';
        echo json_encode($result);
        exit;
    }
    if(!safeSessionStart()){//dalla sessione prendo l'utente che ha messo i like
        http_response_code(401);
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOT_LOGGED';
        echo json_encode($result);
        exit;
    }

    echo json_encode(getLikedPosts($_SESSION[ID], $_GET[ID]));