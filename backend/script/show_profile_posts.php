<?php
    require_once("../funzioni/const.php");
    require_once("../funzioni/dbFunctions.php");

    function show_user_posts(int $idUtente) {
        try{
            $res = standardQuery("SELECT post.ID, post.oraPubblicazione, post.urlImmagine, COUNT(liked.idPost) as likes FROM post, liked WHERE post.idUtente = $idUtente AND post.ID = liked.idPost GROUP BY post.ID ORDER BY post.oraPubblicazione DESC");
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