<?php
    require_once("dbConfig.php");
    require_once("dbFunctions.php");
    require_once("const.php");
    enum loginResult {
        case SUCCESSFUL_LOGIN;
        case WRONG_CREDENTIALS;
        case DB_ERROR;
        case MISSING_FIELDS;
    }
    function login($data, $pass, $hash){
        //funzione che effettua il login, in $data devono essere passati i campi da inserire nella sessione
        $inSessionByDefault = array(EMAIL, FIRSTNAME, ROLE, LASTNAME, ID, USERNAME);

        if(password_verify($pass, $hash)){
            if(session_status() !== PHP_SESSION_ACTIVE)
                session_start();
            
            foreach ($inSessionByDefault as $SessionVar){
                if(array_key_exists($SessionVar, $data)){
                    $_SESSION[$SessionVar] = $data[$SessionVar];
                }
            }

            return loginResult::SUCCESSFUL_LOGIN;
        }
        return loginResult::WRONG_CREDENTIALS;
    }
    function cookieLogin(){
        //Funzione che effettua il login tramite cookie
        if(empty($_COOKIE[REMEMBERME]))//controllo che il cookie sia settato
            return loginResult::MISSING_FIELDS;
        $conn = connect();
        if($conn == null)
            return loginResult::DB_ERROR;//se la connessione non va a buon fine è un problema del DB

        $actualTime = time();
        $campi = ID.",".EMAIL.",".REMEMBERME.",".FIRSTNAME.",".LASTNAME.",".USERNAME;//.",".ROLE;
        $query = "SELECT $campi FROM Utente WHERE expireTime > $actualTime";
        $risultato = $conn -> query($query);
        while($utente = $risultato -> fetch_assoc()){
            if(password_verify($_COOKIE[REMEMBERME], $utente[REMEMBERME])){
                return login($utente, $_COOKIE[REMEMBERME], $utente[REMEMBERME]);
            }
        }
        return loginResult::WRONG_CREDENTIALS;
    }
    function credentialsLogin(){
        //Funzione che effettua il login tramite email e password
        if(emptyFields(EMAIL, PASS))//controllo che i campi non siano vuoti
            return loginResult::MISSING_FIELDS;
    
        $conn = connect();
        if($conn == null)
            return loginResult::DB_ERROR;//se la connessione non va a buon fine è un problema del DB
        
        $fields = ID.",".EMAIL.",".PASS.",".FIRSTNAME.",".LASTNAME.",".USERNAME;//.",".ROLE;
        $query = "SELECT $fields FROM Utente WHERE email = ?";
        $result = safeQuery($query, array($_POST[EMAIL]), "s");
        
        if(!is_numeric($result)) {//controllo che safeQuery abbia restituito un solo oggetto
            if(count($result) != 1)
                return loginResult::WRONG_CREDENTIALS;
            return login($result[0], $_POST[PASS], $result[0][PASS]);
        }
        return loginResult::DB_ERROR;
    }
    function setRememberMe(){
        /*funzione che setta i cookie per il rememberme, funziona solo se la sessione è già stata avviata.
        Il controllo sul campo "rememberme" deve essere fatto prima di invocare la funzione.*/

        if(!isLogged()) {//se la sessione non è stata avviata non posso settare il cookie
            return false;
        }

        $cookieValue = random_int(PHP_INT_MIN,PHP_INT_MAX);//genero un cookie value "random" che rilascio in chiaro al client
        $expireTime = time() + 60*60*24*30;//scade dopo 30 giorni
        setcookie(REMEMBERME, $cookieValue, $expireTime, '/', null, false, true);//setto il cookie

        $cookieValue = password_hash($cookieValue, PASSWORD_DEFAULT);//hasho il cookie per lasciarlo sul DB
        $query = "UPDATE Utente SET rememberMe = ?, expireTime = ? WHERE email = ?";
        
        if(safeQuery($query, array($cookieValue, $expireTime, $_SESSION[EMAIL]), "sis") == 1) {
            return true;//cookie settato correttamente
        }
        error_log("dbFunctions.php/setRememberMe(): Impossibile impostare il cookie sul db \n", 3, ERROR_LOG);
        return false;//cookie non settato
    }
?>