<?php
    require_once("dbFunctions.php");
    enum updateResult {
        case SUCCESSFUL_UPDATE;
        case MISSING_FIELDS;
        case DIFFERENT_PASSWORDS;    
        case ERROR_UPDATE;
        case ERROR_NOTLOGGED;
        case ERROR_DB;
        case DUPLICATE_EMAIL;
        case MISSING_FIELDS_BEFORE;
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
        
        $conn = connect();
        if($conn == null) return updateResult::ERROR_DB;
        
        $SetFields = "";
        $SetValues = array();
        $SetTypes = "";
        $automaticUpdatableFields = array(FIRSTNAME, LASTNAME, EMAIL);
        $toUpdate = array(); 

        if(empty($_POST)){
            return updateResult::MISSING_FIELDS_BEFORE;
        }
        foreach($_POST as $key => $value) {//la key sarebbe il nome del campo, il value il valore contenuto in POST
            if(in_array($key, $automaticUpdatableFields)) {//se ci sono campi in POST che rientrano tra quelli aggiornabili
                $SetFields .= $key." = ?, ";//aggiungo la stringa al campo SET della query
                $SetValues[] = trim(htmlentities($value));//aggiungo il valore all'array dei valori (su cui farò il bind)
                $SetTypes .= "s";//aggiungo il tipo che è sempre string per i campi aggiornabili
                $toUpdate[$key] = trim(htmlentities($value));
            }
        }
        
        if(!empty($_POST[EMAIL])){//L'email è un campo particolare, non è automaticamente aggiornabile perchè deve passare il controllo di filtraggio
            if(!filter_var($_POST[EMAIL], FILTER_VALIDATE_EMAIL)){
                return updateResult::ERROR_UPDATE;//non mi preoccupo di dare un errore specifico perchè via frontend non è possibile mandare una email non valida
            }
            $SetFields .= EMAIL." = ?, ";//aggiungo la stringa al campo SET della query
            $SetValues[] = trim(htmlentities($_POST[EMAIL]));//aggiungo il valore all'array dei valori (su cui farò il bind)
            $toUpdate[EMAIL] = trim(htmlentities($_POST[EMAIL]));
            $SetTypes .= "s";//aggiungo il tipo che è sempre string per i campi aggiornabili
        }
    
        //Debugging
        //echo "SetFields: $SetFields\n"; 

        $strLen = strlen($SetFields);
        if($strLen > 0){
            $SetFields = substr($SetFields, 0, $strLen-2);//tolgo l'ultima virgola e lo spazio
        }
        else {
            return updateResult::MISSING_FIELDS;//se non ci sono campi aggiornabili restituisco un errore
        }

        $query = "UPDATE Utente SET $SetFields WHERE email = ?";
        $SetTypes .= "s";//per l'email come chiave 
        $SetValues[] = $_SESSION[EMAIL];//aggiungo l'email come chiave
        //sanificazione input
        //aggiornamento sessione email
    
        try{
         if(safeQuery($query, $SetValues, $SetTypes) == 1){
             foreach($toUpdate as $key => $value) {//la key sarebbe il nome del campo, il value il valore contenuto in POST
                 $_SESSION[$key] = $value;
            }
            return updateResult::SUCCESSFUL_UPDATE;
         } 
        }
        catch(mysqli_sql_exception $ex){
          error_log("update-showProfileFunctions.php/update(): ".$ex->getMessage()."\n", 3, ERROR_LOG);
         return updateResult::DUPLICATE_EMAIL;
        }
        
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