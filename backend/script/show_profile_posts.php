<?php
    require_once("../funzioni/const.php");
    require_once("../funzioni/dbFunctions.php");
    require_once("../funzioni/showProfileFunctions.php");

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
            http_response_code(200);
        }else{  
            $result['result'] = 'KO';
            $result['message'] = 'POST_NOT_FOUND';
            http_response_code(404);
        }
    }
    echo json_encode($result);
        
