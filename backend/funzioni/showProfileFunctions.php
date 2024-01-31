<?php
    require_once("dbFunctions.php");
    enum showProfileResult {
        case ERROR_SHOW;
        case ERROR_NOTLOGGED;
        case DB_ERROR;
    }

    function showProfile($idUtente, bool $checkforlogin = false){
        //funzione che restituisce i dati del profilo utente
        if($checkforlogin && !isLogged()) return showProfileResult::ERROR_NOTLOGGED;
        
        $conn = connect();
        if($conn == null) return showProfileResult::DB_ERROR;

        $query = "SELECT utente.firstname, utente.lastname, utente.email, utente.profilePicture FROM utente WHERE utente.ID = ?";
        $tmp = safeQuery($query, array($idUtente), "s");
        if(!is_numeric($tmp) && count($tmp) == 1)
            $result = $tmp[0];

        $query = "SELECT COUNT(post.idUtente) as nPost FROM utente INNER JOIN post ON utente.ID = ? and utente.ID = post.idUtente ";
        $tmp = safeQuery($query, array($idUtente), "s");
        if(!is_numeric($tmp) && count($tmp) == 1){
            $result = array_merge($result, $tmp[0]);
        }
        $query = "SELECT COUNT(seguiti.idUtente) as nFollower FROM utente INNER JOIN seguiti ON utente.ID = ? and utente.ID = seguiti.idUtenteSeguito ";
        $tmp = safeQuery($query, array($idUtente), "s");
        if(!is_numeric($tmp) && count($tmp) == 1){
            $result = array_merge($result, $tmp[0]);
        }
        $query = "SELECT COUNT(seguiti.idUtenteSeguito) as nFollowing FROM utente INNER JOIN seguiti ON utente.ID = ? and utente.ID = seguiti.idUtente";
        $tmp = safeQuery($query, array($idUtente), "s");
        if(!is_numeric($tmp) && count($tmp) == 1){
            $result = array_merge($result, $tmp[0]);
            return $result;
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