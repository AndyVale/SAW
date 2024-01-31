<?php
    require_once("../funzioni/const.php");
    require_once("../funzioni/dbFunctions.php");

    function show_user_posts(int $idUtente) {
        try{
            $query = "SELECT post.ID, post.oraPubblicazione, post.urlImmagine, COUNT(liked.idUtente) as likes
                      FROM post LEFT JOIN liked ON post.ID = liked.idPost
                      WHERE post.idUtente = $idUtente
                      GROUP BY post.ID";
            $res = standardQuery($query);
        }
        catch(Exception $e){
            error_log("show_profile_posts.php: Query non andata a buon fine, id: $idUtente\n", 3, ERROR_LOG);
            $res = -1;
        }
        return $res;
    }

    session_start();
    //var_dump($_SESSION);
    header('Content-Type: application/json');
    $result['from'] = 'show_profile_posts.php';

    if(!safeSessionStart()) {
        $result['result'] = 'KO';
        $result['message'] = 'ERROR_NOTLOGGED';
    }else{
        $userPosts = show_user_posts($_SESSION[ID]);
        if(!is_numeric($userPosts)){
            $result['result'] = 'OK';
            $result['message'] = 'Post ottenuti con successo';
            $result['data'] = $userPosts;
        }else{  
            $result['result'] = 'KO';
            $result['message'] = 'POST_NOT_FOUND';
        }
    }
    echo json_encode($result);
        
?>