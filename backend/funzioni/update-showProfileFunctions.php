<?php
    require_once("dbFunctions.php");
    enum updateResult {
        case SUCCESSFUL_UPDATE;
        case MISSING_FIRSTNAME;
        case MISSING_LASTNAME;
        case MISSING_EMAIL;
        case MISSING_USERNAME;
        case MISSING_FIELDS;
        case DIFFERENT_PASSWORDS;    
        case ERROR_UPDATE;
        case ERROR_NOTLOGGED;
        case DB_ERROR;
        case DUPLICATE_EMAIL;
        case WRONG_EMAIL_FORMAT;
    }
    
    //funzione che restituisce true se ci sono campi vuoti inviati in $_POST
    function emptyFields() {
    //funzione che restituisce un array contenente tutti gli argomenti passati a una funzione
    //comunemente utilizzata quando si vuole creare una funzione che accetta un numero variabile di argomenti
    $args = func_get_args();

    foreach ($args as $fieldName) {
        if (empty($_POST[$fieldName])) {
            return true; // Trovato un campo vuoto
        }
    }
    return false; // Nessun campo vuoto
    }

    function update(){
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            //se l'utente non modifica qualche campo, si deve:
            //-aggiornarli tutti ugualmente nel database
            //-controllare se alcuni fossero uguali ai precedenti (è davvero l'unico modo per farlo fare una select?)
        
            //controlliamo che l'utente non abbia svuotato un campo
            //ATTENZIONE!! Va aggiunto username
            if(emptyFields(FIRSTNAME, LASTNAME, EMAIL/*, USERNAME*/)){//NON SI DEVE CONTROLLARE USERNAME, I TEST AUTOMATICI FALLIREBBERO
                return updateResult::MISSING_FIELDS;
            }
            //controllo, che l'email sia stata modificata o no, che sia valida
            if(!filter_var($_POST[EMAIL], FILTER_VALIDATE_EMAIL))
                return updateResult::WRONG_EMAIL_FORMAT;
            
            //ATTENZIONE!! Va aggiunto username e tolto l'ultimo 
            $data = array(  htmlentities(trim($_POST[FIRSTNAME])), 
                            htmlentities(trim($_POST[LASTNAME])),
                            htmlentities(strtolower($_POST[EMAIL])),
                            $_SESSION[ID]); //Uso l'ID per evitare problemi con la vecchia mail
        
            $conn = connect();
            if($conn == null) return updateResult::DB_ERROR;
             
            //uso un prepared statement per evitare sql injection
            $query = "UPDATE utente SET firstname = ?, lastname = ?, email = ? WHERE ID = ?";
        
            try{
                if(safeQuery($query, $data, "sssi") < 2){
                    return updateResult::SUCCESSFUL_UPDATE;
                }
                return updateResult::DB_ERROR;
            }
            catch(mysqli_sql_exception $ex){
                error_log("update-showProfileFunctions.php/update(): ".$ex->getMessage()."\n", 3, ERROR_LOG);
                return updateResult::DUPLICATE_EMAIL;
            }
        }
    }

    function pswUpdate(){
        //funzione che effettua un aggiornamento della password utente dai dati mandati in POST 
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        if(empty($_POST[UPDATEREQUEST]||empty($_POST[PASS]) || empty($_POST[CONFIRM]))) return updateResult::MISSING_FIELDS;
        if($_POST[PASS] != $_POST[CONFIRM]) return updateResult::DIFFERENT_PASSWORDS;

        $conn = connect();
        if($conn == null) return updateResult::DB_ERROR;
        
        $query = "UPDATE Utente SET pass = ? WHERE email = ?";
        $HshdPsw = password_hash(trim($_POST[PASS]), PASSWORD_DEFAULT);
        if(safeQuery($query, array($HshdPsw, $_SESSION[EMAIL]), "ss") == 1)//la query deve interessare una sola riga
            return updateResult::SUCCESSFUL_UPDATE;

        return updateResult::ERROR_UPDATE;
        
    }

    function showProfile(){
        //funzione che restituisce i dati del profilo utente
        if(!isLogged()) return updateResult::ERROR_NOTLOGGED;
        
        $conn = connect();
        if($conn == null) return updateResult::DB_ERROR;

        $query = "SELECT utente.firstname, utente.lastname, utente.email FROM utente WHERE utente.ID = ?";
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
        return updateResult::ERROR_UPDATE;
        
    }
?>