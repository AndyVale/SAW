<?php
    require_once("dbFunctions.php");
    enum showProfileResult {
        case ERROR_SHOW;
        case ERROR_NOTLOGGED;
        case DB_ERROR;
    }

    function showProfile($idUtente){
        $query = "SELECT 
                        utente.".FIRSTNAME.", 
                        utente.".LASTNAME.", 
                        utente.".EMAIL.", 
                        utente.".PROFILEPICTURE.",
                        utente.".USERNAME.",
                        (SELECT COUNT(post.idUtente) FROM post WHERE post.idUtente = utente.ID) as nPost,
                        (SELECT COUNT(seguiti.idUtente) FROM seguiti WHERE seguiti.idUtenteSeguito = utente.ID) as nFollower,
                        (SELECT COUNT(seguiti.idUtenteSeguito) FROM seguiti WHERE seguiti.idUtente = utente.ID) as nFollowing
                FROM 
                    utente 
                WHERE 
                    utente.ID = ?";

        try{
            $result = safeQuery($query, array($idUtente), "s");
            if(!is_numeric($result) && count($result) == 1){
                return $result[0];
            }
        }catch(mysqli_sql_exception $ex){
            //error_log("showProfileFunctions.php/showProfile(): ".$ex->getMessage()."\n", 3, ERROR_LOG);
        }
        return showProfileResult::ERROR_SHOW;
    }
