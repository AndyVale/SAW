<?php
    require_once("dbFunctions.php");
    enum showProfileResult {
        case ERROR_SHOW;
        case ERROR_NOTLOGGED;
        case DB_ERROR;
    }

    function showProfile(){
        //funzione che restituisce i dati del profilo utente
        if(!isLogged()) return showProfileResult::ERROR_NOTLOGGED;
        
        $conn = connect();
        if($conn == null) return showProfileResult::DB_ERROR;

        $query = "SELECT utente.firstname, utente.lastname, utente.email, utente.profilePicture FROM utente WHERE utente.ID = ?";
        $tmp = safeQuery($query, array($_SESSION[ID]), "s");
        if(!is_numeric($tmp) && count($tmp) == 1)
            $result = $tmp[0];

        $query = "SELECT COUNT(post.idUtente) as nPost FROM utente INNER JOIN post ON utente.ID = ? and utente.ID = post.idUtente ";
        $tmp = safeQuery($query, array($_SESSION[ID]), "s");
        if(!is_numeric($tmp) && count($tmp) == 1){
            $result = array_merge($result, $tmp[0]);
        }
        $query = "SELECT COUNT(seguiti.idUtente) as nFollower FROM utente INNER JOIN seguiti ON utente.ID = ? and utente.ID = seguiti.idUtenteSeguito ";
        $tmp = safeQuery($query, array($_SESSION[ID]), "s");
        if(!is_numeric($tmp) && count($tmp) == 1){
            $result = array_merge($result, $tmp[0]);
        }
        $query = "SELECT COUNT(seguiti.idUtenteSeguito) as nFollowing FROM utente INNER JOIN seguiti ON utente.ID = ? and utente.ID = seguiti.idUtente";
        $tmp = safeQuery($query, array($_SESSION[ID]), "s");
        if(!is_numeric($tmp) && count($tmp) == 1){
            $result = array_merge($result, $tmp[0]);
            return $result;
        }
        //TODO: MODIFICARE QUESTE QUERY CHE FANNO PENA
        return showProfileResult::ERROR_SHOW;
        
    }