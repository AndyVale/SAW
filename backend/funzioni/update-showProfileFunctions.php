<?php
    require_once("dbFunctions.php");
    enum updateResult {
        case SUCCESSFUL_UPDATE;
        case MISSING_FIELDS;
        case DIFFERENT_PASSWORDS;    
        case ERROR_UPDATE;
        case ERROR_NOTLOGGED;
        case ERROR_DB;
    }
    function pswUpdate(){
        //funzione che effettua un aggiornamento della password utente dai dati mandati in POST 
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        if(empty($_POST[UPDATEREQUEST]||empty($_POST[PASS]) || empty($_POST[CONFIRM]))) return updateResult::MISSING_FIELDS;
        if($_POST[PASS] != $_POST[CONFIRM]) return updateResult::DIFFERENT_PASSWORDS;

        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;
        
        $query = "UPDATE Utente SET pass = ? WHERE email = ?";
        $HshdPsw = password_hash(trim($_POST[PASS]), PASSWORD_DEFAULT);
        if(safeQuery($query, array($HshdPsw, $_SESSION[EMAIL]), "ss") == 1)//la query deve interessare una sola riga
            return updateResult::SUCCESSFUL_UPDATE;

        return updateResult::ERROR_UPDATE;
        
    }
    function update(){
        //funzione che effettua un aggiornamento del profilo utente dai dati mandati in POST
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        if(empty($_POST[UPDATEREQUEST])) return updateResult::MISSING_FIELDS;

        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;
        
        $SetFields = "";
        $SetValues = array();
        $SetTypes = "";
        $updatableFields = array(FIRSTNAME, LASTNAME, EMAIL);

        foreach($_POST as $key => $value) {//la key sarebbe il nome del campo, il value il valore contenuto in POST
            if(in_array($key, $updatableFields)) {//se ci sono campi in POST che rientrano tra quelli aggiornabili
                $SetFields .= $key." = ?, ";//aggiungo la stringa al campo SET della query
                $SetValues[] = $value;//aggiungo il valore all'array dei valori (su cui farò il bind)
                $SetTypes .= "s";//aggiungo il tipo che è sempre string per i campi aggiornabili
            }
        }
        
        //TODO: aggiungere altri campi FACOLTATIVI

        $strLen = strlen($SetFields);
        if($strLen > 0)
            $SetFields = substr($SetFields, 0, $strLen-2);//tolgo l'ultima virgola e lo spazio
        else
            return updateResult::MISSING_FIELDS;//se non ci sono campi aggiornabili restituisco un errore

        $query = "UPDATE Utente SET $SetFields WHERE email = ?";
        $SetTypes .= "s";//per l'email come chiave 
        $SetValues[] = $_SESSION[EMAIL];//aggiungo l'email come chiave
        
        if(safeQuery($query, $SetValues, $SetTypes) == 1)
            return updateResult::SUCCESSFUL_UPDATE;
        return updateResult::ERROR_UPDATE;//nota: viene restituito questo anche qualora l'utente non avesse modificato nessun campo
    }
    function showProfile(){
        //funzione che restituisce i dati del profilo utente
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        
        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;

        $query = "SELECT firstname, lastname, email FROM Utente WHERE email = ?";
        $tmp = safeQuery($query, array($_SESSION[EMAIL]), "s");
        if(!is_numeric($tmp) && count($tmp) == 1)
            return $tmp[0];
        return updateResult::ERROR_UPDATE;
    }
?>