<?php
    require_once("../funzioni/const.php");
    require_once("../funzioni/dbFunctions.php");
    require_once("../funzioni/showProfileFunctions.php");

    function getNonSesitiveData($id) : array{
        //$result['userdata'] = showProfile();
        //var_dump($result['userdata']);
        
        $risultato['posts'] = show_user_posts($id);
        //var_dump($risultato['post']);
        $risultato['datiUtente'] = showProfile($id,false);
        return $risultato;
    }

    if(!isset($_GET[ID])){
        http_response_code(400);
        echo json_encode(array("result" => "KO", "message" => "ERROR_NO_ID"));
        exit;
    }
    
    echo json_encode(getNonSesitiveData($_GET[ID]));

