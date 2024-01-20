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
        
            //ATTENZIONE!! $_SESSION[EMAIL] va cambiato con $_SESSION[ID]
            $email = $_SESSION[EMAIL];
        
            //se l'utente non modifica qualche campo, si deve:
            //-aggiornarli tutti ugualmente nel database
            //-controllare se alcuni fossero uguali ai precedenti (è davvero l'unico modo per farlo fare una select?)
        
            //controlliamo che l'utente non abbia svuotato un campo
            //ATTENZIONE!! Va aggiunto username
            if(emptyFields(FIRSTNAME, LASTNAME, EMAIL, USERNAME)){
                return updateResult::MISSING_FIELDS;
            }
            //controllo, che l'email sia stata modificata o no, che sia valida
            if(!filter_var($_POST[EMAIL], FILTER_VALIDATE_EMAIL))
                return updateResult::WRONG_EMAIL_FORMAT;
            
            //ATTENZIONE!! Va aggiunto username e tolto l'ultimo 
            $data = array(htmlentities(trim($_POST[FIRSTNAME])), 
                                htmlentities(trim($_POST[LASTNAME])),
                                htmlentities(strtolower($_POST[EMAIL])),
                                htmlentities(strtolower($_SESSION[EMAIL]))); //vecchia email per la clausola where
        
            $conn = connect();
            if($conn == null) return updateResult::DB_ERROR;
             
            //uso un prepared statement per evitare sql injection
        
            //ATTENZIONE!! where email = ? va cambiato con id = ? e va aggiunto username
            $query = "UPDATE utente SET firstname = ?, lastname = ?, email = ? WHERE email = ?";
        
            try{
                if(safeQuery($query, $data, "ssss") < 2)
                    return updateResult::SUCCESSFUL_UPDATE;
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

        $query = "SELECT firstname, lastname, email FROM utente WHERE email = ?";
        $tmp = safeQuery($query, array($_SESSION[EMAIL]), "s");
        if(!is_numeric($tmp) && count($tmp) == 1)
            return $tmp[0];
        return updateResult::ERROR_UPDATE;
    }
?>