<?php
    require_once("dbFunctions.php");
    enum showProfileResult {
        case ERROR_SHOW;
        case ERROR_NOTLOGGED;
        case DB_ERROR;
    }

    function showProfile($idUtente){
        //funzione che restituisce i dati del profilo utente
        //if(!isLogged()) return showProfileResult::ERROR_NOTLOGGED;
        
        $conn = connect();
        if($conn == null) return showProfileResult::DB_ERROR;

        $query = "SELECT 
                        utente.firstname, 
                        utente.lastname, 
                        utente.email, 
                        utente.profilePicture,
                        (SELECT COUNT(post.idUtente) FROM post WHERE post.idUtente = utente.ID) as nPost,
                        (SELECT COUNT(seguiti.idUtente) FROM seguiti WHERE seguiti.idUtenteSeguito = utente.ID) as nFollower,
                        (SELECT COUNT(seguiti.idUtenteSeguito) FROM seguiti WHERE seguiti.idUtente = utente.ID) as nFollowing
                FROM 
                    utente 
                WHERE 
                    utente.ID = ?";

        $result = safeQuery($query, array($idUtente), "s");
        if(!is_numeric($result) && count($result) == 1){
            return $result[0];
        }
        //TODO: MODIFICARE QUESTE QUERY CHE FANNO PENA
        return showProfileResult::ERROR_SHOW;
    }

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